import pandas as pd
import xgboost as xgb
import shap
import pickle
import json
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load configurations once when the server starts
load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Load the pre-trained model once
with open('model.pkl', 'rb') as f:
    xgb_model = pickle.load(f)

def generate_user_insights(sleep, stress, focus, screen_time):
    """
    Ashutosh: Call this function in your Flask /api/check-in route.
    Pass the user's survey data into it, and return the output to the React frontend.
    """
    # 1. Format the incoming user data
    user_data = pd.DataFrame({'sleep': [sleep], 'stress': [stress], 'focus': [focus], 'screen_time': [screen_time]})
    
    # 2. Predict Risk Score
    predicted_score = float(xgb_model.predict(user_data)[0])
    
    # 3. Calculate SHAP Values for this specific user
    explainer = shap.Explainer(xgb_model)
    shap_values = explainer(user_data)
    contributions = {
        "sleep_impact": float(shap_values.values[0][0]),
        "stress_impact": float(shap_values.values[0][1]),
        "focus_impact": float(shap_values.values[0][2]),
        "screen_time_impact": float(shap_values.values[0][3])
    }
    
    # 4. Generate Personalized Gemini Recommendations
    prompt = f"""
    Risk Score: {predicted_score:.1f}
    SHAP Contributions: {json.dumps(contributions)}
    """
    
    response = client.models.generate_content(
        model='gemini-3.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction="Analyze the risk score and SHAP values. Provide exactly 3 short, actionable, behavioral recommendations to improve cognitive health. Format output STRICTLY as JSON: {'recommendations': ['rec1', 'rec2', 'rec3']}. No medical advice. No markdown formatting.",
            response_mime_type="application/json",
        ),
    )
    
    # 5. Return the dynamic payload
    return {
        "status": "success",
        "risk_score": predicted_score,
        "shap_contributions": contributions,
        "insights": json.loads(response.text)
    }

# Example of how Ashutosh will use it:
# result = generate_user_insights(sleep=4, stress=9, focus=2, screen_time=12)
# print(result)