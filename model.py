import os
import random
import csv
import pandas as pd
import sys, django
from datetime import date, timedelta
sys.path.append('./backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from api.models import DailyHealthRecord
DailyHealthRecord.objects.all().delete()

folder_name = "csv_series"
random.seed()

if not os.path.exists(folder_name):
    os.makedirs(folder_name)

headers = ["ID", "Duration", "Sleep Score", "Sleep Apnea", "Insomnia"]
table_data = []

NUM_SAMPLES = 500
print(f"Generating synthetic sleep data for {NUM_SAMPLES} nights...")

for i in range(NUM_SAMPLES):
    file_name = f"{str(i).zfill(5)}.csv"
    file_path = os.path.join(folder_name, file_name)

    minutes = int(480 + ((random.random() - 0.5) * 120))
    apnea = False
    apnea_now = False
    insomnia = False
    movement_total = 0

    data_rows = []
    spo2_drops = 0
    pr_spikes = 0
    for minute in range(minutes):
        minSpO2 = 97 + (random.random() - 0.5) * 2
        pr = 77 + (random.random() - 0.5) * 15
        bph = 120 + int((random.random() - 0.5) * 10)
        bpl = 80 + int((random.random() - 0.5) * 6)
        movement = 1

        if apnea_now or (apnea and random.random() < 0.002) or (random.random() < 0.00002):
            minSpO2 = minSpO2 - random.random() * 25
            apnea = True
            bph += random.random() * 10
            bpl += random.random() * 6
            if apnea_now and random.random() < 0.2:
                apnea_now = False
            else:
                apnea_now = True

        if random.random() < 0.02:
            movement += random.random() * 2

        if random.random() < 0.001 or (movement > 1 and random.random() < 0.3):
            pr += random.random() * 25

        movement_total += movement
        if minSpO2 < 92:
            spo2_drops += 1
        if pr > 100:
            pr_spikes += 1

        data_rows.append({
            "Time": f"{str(int(minute/60)).zfill(2)}:{str(minute%60).zfill(2)}",
            "MinSpO2": round(minSpO2, 1),
            "PulseRate": int(pr),
            "BloodPressure": f"{int(bph)}/{int(bpl)}",
            "Systolic": int(bph),
            "Diastolic": int(bpl),
            "MovementIntensity": round(movement, 2)
        })

    df = pd.DataFrame(data_rows)
    df['PR_std_5m'] = df['PulseRate'].rolling(window=5, min_periods=1, center=True).std().fillna(0)
    df['Mov_sum_5m'] = df['MovementIntensity'].rolling(window=5, min_periods=1, center=True).sum()
    df['Mov_max_15m'] = df['MovementIntensity'].rolling(window=15, min_periods=1, center=True).max()
    df['SpO2_std_5m'] = df['MinSpO2'].rolling(window=5, min_periods=1, center=True).std().fillna(0)
    df['Night_Progress'] = df.index / len(df)

    stages = []
    stages_json = []
    for idx, row in df.iterrows():
        if row['MovementIntensity'] > 1.5 or row['Mov_sum_5m'] > 5.0:
            stages.append('Awake')
            stage_code = 0
        elif row['Mov_max_15m'] <= 1.0 and row['PR_std_5m'] < 2.0 and row['Night_Progress'] < 0.5:
            stages.append('Deep Sleep')
            stage_code = 3
        elif row['MovementIntensity'] <= 1.0 and (row['PR_std_5m'] > 4.0 or row['SpO2_std_5m'] > 1.0) and row['Night_Progress'] > 0.4:
            stages.append('REM')
            stage_code = 1
        else:
            stages.append('Light Sleep')
            stage_code = 2
        
        # Sample data points every 10 min for frontend chart to avoid massive JSONs
        if idx % 10 == 0:
             stages_json.append({"time": row['Time'], "stage": stage_code})

    df['SleepStage'] = stages

    # DB Save using the aggregated dataframe metrics
    d = date.today() - timedelta(days=i)
    if i <= 30: # Only save the last 30 days to DB for history viewing
         DailyHealthRecord.objects.create(
             date=d,
             avg_heart_rate=df['PulseRate'].mean(),
             min_heart_rate=df['PulseRate'].min(),
             max_heart_rate=df['PulseRate'].max(),
             avg_temperature=36.5,
             min_temperature=36.0,
             max_temperature=37.0,
             min_spo2=df['MinSpO2'].min(),
             avg_pulse_rate=df['PulseRate'].mean(),
             min_pulse_rate=df['PulseRate'].min(),
             max_pulse_rate=df['PulseRate'].max(),
             avg_sys_bp=df['Systolic'].mean(),
             min_sys_bp=df['Systolic'].min(),
             max_sys_bp=df['Systolic'].max(),
             avg_dia_bp=df['Diastolic'].mean(),
             min_dia_bp=df['Diastolic'].min(),
             max_dia_bp=df['Diastolic'].max(),
             avg_movement=df['MovementIntensity'].mean(),
             min_movement=df['MovementIntensity'].min(),
             max_movement=df['MovementIntensity'].max(),
             sleep_architecture=stages_json,
             spo2_drops=spo2_drops,
             pr_spikes=pr_spikes,
             total_movement=movement_total,
             total_duration=minutes
         )

    df = df[['Time', 'MinSpO2', 'PulseRate', 'BloodPressure', 'MovementIntensity', 'SleepStage']]
    df.to_csv(file_path, index=False)

    if movement_total > (minutes + random.random() * 45):
        insomnia = True
    score = 80 - (apnea + insomnia + (minutes < 375)) * 10 + random.random() * 15
    table_data.append({"ID": f"{str(i).zfill(5)}", "Duration": minutes, "Sleep Score": round(score, 1), "Sleep Apnea": int(apnea), "Insomnia": int(insomnia)})

with open(os.path.join(folder_name, "master.csv"), "w", newline='') as f:
    writer = csv.DictWriter(f, fieldnames=headers)
    writer.writeheader()
    writer.writerows(table_data)
print("Data generation complete! DB populated.")


import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, r2_score
import warnings
warnings.filterwarnings('ignore')

FOLDER_NAME = "csv_series"
MAX_DATA = 500  # Limit the number of files to load for training (Change this to 1000+ for better performance)

# Extracting features for models

def engineer_minute_features(df):
    """Adds rolling temporal features required to predict Sleep Stages."""
    df[['Systolic', 'Diastolic']] = df['BloodPressure'].str.split('/', expand=True).astype(float)
    df['PR_std_5m'] = df['PulseRate'].rolling(window=5, min_periods=1, center=True).std().fillna(0)
    df['Mov_sum_5m'] = df['MovementIntensity'].rolling(window=5, min_periods=1, center=True).sum()
    df['Mov_max_15m'] = df['MovementIntensity'].rolling(window=15, min_periods=1, center=True).max()
    df['SpO2_std_5m'] = df['MinSpO2'].rolling(window=5, min_periods=1, center=True).std().fillna(0)
    df['Night_Progress'] = df.index / len(df)
    return df

def extract_night_features(df):
    """Extracts summary statistics of the entire night to predict Diseases & Score."""
    df[['Systolic', 'Diastolic']] = df['BloodPressure'].str.split('/', expand=True).astype(float)
    features = {
        'Duration': len(df),
        'SpO2_min': df['MinSpO2'].min(),
        'SpO2_drops': (df['MinSpO2'] < 92).sum(), # High drops = Apnea
        'PR_mean': df['PulseRate'].mean(),
        'PR_spikes': (df['PulseRate'] > 100).sum(),
        'Sys_max': df['Systolic'].max(),
        'Mov_total': df['MovementIntensity'].sum(), # High movement = Insomnia
    }
    return features

# Loading data

master_df = pd.read_csv(os.path.join(FOLDER_NAME, "master.csv"))
night_features_list = []
minute_data_list = []

# Load a subset of files to train the models
for i in range(min(MAX_DATA, len(master_df))):
    file_id = str(int(master_df.iloc[i]['ID'])).zfill(5)
    file_path = os.path.join(FOLDER_NAME, f"{file_id}.csv")
    # print(file_id)

    if os.path.exists(file_path):
        df = pd.read_csv(file_path)

        # Aggregate Night Features
        feats = extract_night_features(df)
        night_features_list.append(feats)

        # Collect Minute-by-Minute Data for Stage Staging Model
        df = engineer_minute_features(df)
        minute_data_list.append(df)


# Training

# A. Train Sleep Staging Model (Minute Level)
all_minutes_df = pd.concat(minute_data_list, ignore_index=True)
stage_features = ['MinSpO2', 'PulseRate', 'MovementIntensity', 'Systolic', 'Diastolic',
                  'PR_std_5m', 'Mov_sum_5m', 'Mov_max_15m', 'SpO2_std_5m', 'Night_Progress']

X_stage = all_minutes_df[stage_features]
y_stage = all_minutes_df['SleepStage']

X_tr_st, X_te_st, y_tr_st, y_te_st = train_test_split(X_stage, y_stage, test_size=0.2, random_state=42)
stager_model = RandomForestClassifier(n_estimators=50, max_depth=10, random_state=42)
stager_model.fit(X_tr_st, y_tr_st)
print(f"Stage Model Accuracy: {accuracy_score(y_te_st, stager_model.predict(X_te_st))*100:.1f}%")

# B. Train Disease & Score Models (Night Level)
X_night = pd.DataFrame(night_features_list)
y_score = master_df.head(len(X_night))['Sleep Score']
y_apnea = master_df.head(len(X_night))['Sleep Apnea']
y_insom = master_df.head(len(X_night))['Insomnia']

score_model = RandomForestRegressor(n_estimators=50, random_state=42)
score_model.fit(X_night, y_score)

apnea_model = RandomForestClassifier(n_estimators=50, random_state=42)
apnea_model.fit(X_night, y_apnea)

insom_model = RandomForestClassifier(n_estimators=50, random_state=42)
insom_model.fit(X_night, y_insom)

print("Models trained")

# Dashboard function

def analyze_sleep_recording(filepath):
    """Processes a raw CSV file and outputs a comprehensive Sleep Report."""
    print(f"\nAnalyzing Wearable Data: {filepath}")

    # Read & Preprocess
    df_raw = pd.read_csv(filepath)
    df_minutes = engineer_minute_features(df_raw.copy())
    night_feats = pd.DataFrame([extract_night_features(df_raw)])

    # 1. Predict Overarching Metrics
    pred_score = score_model.predict(night_feats)[0]
    pred_apnea = apnea_model.predict(night_feats)[0]
    pred_insom = insom_model.predict(night_feats)[0]

    # 2. Predict Sleep Stages for every minute
    pred_stages = stager_model.predict(df_minutes[stage_features])

    # 3. Calculate Sleep Efficiency % (Total Time Asleep / Total Time in Bed)
    total_minutes = len(pred_stages)
    awake_minutes = np.sum(pred_stages == 'Awake')
    sleep_efficiency = ((total_minutes - awake_minutes) / total_minutes) * 100

    # Dashboard Output
    print("\n" + "="*50)
    print("      🌙 COMPREHENSIVE OVERNIGHT SLEEP REPORT 🌙")
    print("="*50)

    print(f"⭐ Sleep Quality Score: {pred_score:.1f} / 100")
    # print(f"🔋 Sleep Efficiency:    {sleep_efficiency:.1f}% " + ("(Optimal)" if sleep_efficiency > 85 else "(Low)"))
    print(f"⏱️ Total Duration:      {total_minutes // 60}h {total_minutes % 60}m")

    print("\n--- 🏥 Medical Screening ---")
    if pred_apnea == 1:
        print("🚨 Sleep Apnea Risk: HIGH. Frequent SpO2 drops detected.")
    else:
        print("✅ Sleep Apnea Risk: Low. Breathing remained stable.")

    if pred_insom == 1:
        print("🚨 Insomnia Risk: HIGH. Excessive movement and restlessness detected.")
    else:
        print("✅ Insomnia Risk: Low. Restfulness normal.")

    print("\n--- 🧠 Sleep Architecture (Stages) ---")
    # Group continuous stages together to form readable intervals
    current_stage = pred_stages[0]
    start_time = df_raw['Time'].iloc[0]
    duration = 0

    for i in range(total_minutes):
        if pred_stages[i] == current_stage:
            duration += 1
        else:
            if duration >= 5: # Only show blocks longer than 5 mins
                print(f"[{start_time} - {df_raw['Time'].iloc[i-1]}] : {current_stage.ljust(12)} ({duration} mins)")
            current_stage = pred_stages[i]
            start_time = df_raw['Time'].iloc[i]
            duration = 1

    print(f"[{start_time} - {df_raw['Time'].iloc[-1]}] : {current_stage.ljust(12)} ({duration} mins)")
    print("="*50 + "\n")

# Test the analyzer on the first synthetic patient
analyze_sleep_recording('csv_series/00000.csv')



