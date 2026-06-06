import pandas as pd
import numpy as np
import os

# Set random seed for reproducibility
np.random.seed(42)
num_samples = 1000

# Generate realistic, synthetic inputs
# sleep: 4 to 9 hours
sleep = np.random.uniform(4, 9, num_samples)
# stress: scale of 1 to 10
stress = np.random.uniform(1, 10, num_samples)
# focus: scale of 1 to 10
focus = np.random.uniform(1, 10, num_samples)
# screen_time: 2 to 14 hours
screen_time = np.random.uniform(2, 14, num_samples)

# Create a non-linear formula to calculate a realistic base risk score (0-100)
# High stress, high screen time, low sleep, and low focus increase the risk score
base_score = (stress * 4.5) + (screen_time * 2.5) - (sleep * 3.5) - (focus * 2.0) + 40

# Add a little bit of random noise to make it realistic for ML training
noise = np.random.normal(0, 5, num_samples)
final_score = base_score + noise

# Clip the scores strictly between 0 and 100
final_score = np.clip(final_score, 0, 100).astype(int)

# Classify risk level based on the score thresholds
risk_labels = []
for score in final_score:
    if score < 45:
        risk_labels.append("Low")
    elif score < 75:
        risk_labels.append("Moderate")
    else:
        risk_labels.append("High")

# Construct the DataFrame
df = pd.DataFrame({
    'sleep': np.round(sleep, 1),
    'stress': np.round(stress, 1),
    'focus': np.round(focus, 1),
    'screen_time': np.round(screen_time, 1),
    'risk_score': final_score,
    'risk_level': risk_labels
})

# Save to the local directory
os.makedirs('data', exist_ok=True)
df.to_csv('data/synthetic_cognitive_data.csv', index=False)

print(print(f"Successfully generated {num_samples} samples! Dataset saved to 'data/synthetic_cognitive_data.csv'"))
print(df.head())