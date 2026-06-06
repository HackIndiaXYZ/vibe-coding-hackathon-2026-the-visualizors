import pandas as pd
import xgboost as xgb
import shap
import pickle
import json
import os
from dotenv import load_dotenv

# NEW SDK IMPORTS
from google import genai
from google.genai import types

# 1. Securely load the API key
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("API Key not found. Please check your .env file.")

# Initialize the new Google GenAI client
client = genai.Client(api_key=GEMINI_API_KEY)

print("Loading data and training XGBoost model...")
# 2. Load the dataset we just generated
df = pd.read_csv('data/synthetic_cognitive_data.csv')
X = df[['sleep', 'stress', 'focus', 'screen_time']]
y = df['risk_score']

# Train the model
xgb_model = xgb.XGBRegressor(objective='reg:squarederror', random_state=42)
xgb_model.fit(X, y)

# Export the model for the Flask Backend
with open('model.pkl', 'wb') as f:
    pickle.dump(xgb_model, f)
print("SUCCESS: Model saved as 'model.pkl'")

print("Calculating SHAP values for a sample user payload...")
# 3. Simulate a payload from the frontend React App
test_user = pd.DataFrame({'sleep': [5], 'stress': [8], 'focus': [4], 'screen_time': [11]})

# Predict the risk score
predicted_score = xgb_model.predict(test_user)[0]

# Calculate SHAP values to explain the prediction
explainer = shap.Explainer(xgb_model)
shap_values = explainer(test_user)

# Extract feature contributions (How much did each metric push the score up or down?)
contributions = {
    "sleep_impact": float(shap_values.values[0][0]),
    "stress_impact": float(shap_values.values[0][1]),
    "focus_impact": float(shap_values.values[0][2]),
    "screen_time_impact": float(shap_values.values[0][3])
}

# Export SHAP baseline for the Flask backend
with open('shap_outputs.json', 'w') as f:
    json.dump(contributions, f, indent=4)
print("SUCCESS: SHAP values saved as 'shap_outputs.json'")

print("Calling Gemini 1.5 Flash for Insights...")
# 4. Construct the Guardrailed Gemini Prompt
system_instruction = """
You are an AI cognitive wellness system analyzing a user's cognitive risk score.
Analyze the provided risk score and the SHAP feature contributions. 
Provide exactly 3 short, actionable, behavioral recommendations to improve their cognitive health.
Format the output STRICTLY as a JSON object matching this schema:
{"recommendations": ["rec1", "rec2", "rec3"]}
Do not provide medical advice. Do not include markdown blocks like ```json.
"""

prompt = f"""
Risk Score: {predicted_score:.1f} (0-100 scale, higher means higher cognitive burnout risk)
SHAP Contributions (Positive numbers increased the risk, negative numbers mitigated the risk):
{json.dumps(contributions, indent=2)}
"""

# NEW SDK CALL WITH STRICT JSON CONFIGURATION
response = client.models.generate_content(
    model='gemini-3.5-flash',
    contents=prompt,
    config=types.GenerateContentConfig(
        system_instruction=system_instruction,
        response_mime_type="application/json",
    ),
)

print("\n--- FINAL API RESPONSE PAYLOAD FOR FRONTEND ---")
final_output = {
    "status": "success",
    "risk_score": float(predicted_score),
    "shap_contributions": contributions,
    "insights": json.loads(response.text)
}
print(json.dumps(final_output, indent=4))