import sys, os, django
import warnings
warnings.filterwarnings('ignore')

sys.path.append('./backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from api.models import DailyHealthRecord

# Import model.py directly instead of parsing .ipynb
print("Bootstrapping Scikit-Learn logic from model.py...")
import importlib.util
spec = importlib.util.spec_from_file_location("model", "./model.py")
model_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(model_module)

score_model = model_module.score_model
apnea_model = model_module.apnea_model
insom_model = model_module.insom_model

print("Model training complete. Running Database evaluations...")
import pandas as pd
for rec in DailyHealthRecord.objects.all():
    features = pd.DataFrame([{
        'Duration': rec.total_duration,
        'SpO2_min': rec.min_spo2,
        'SpO2_drops': rec.spo2_drops,
        'PR_mean': rec.avg_pulse_rate,
        'PR_spikes': rec.pr_spikes,
        'Sys_max': rec.max_sys_bp,
        'Mov_total': rec.total_movement
    }])
    rec.sleep_score = score_model.predict(features)[0]
    rec.apnea_risk = bool(apnea_model.predict(features)[0])
    rec.insomnia_risk = bool(insom_model.predict(features)[0])
    rec.save()

print("ML Diagnostics successfully injected into SQLite via Scikit-Learn evaluation pipeline.")
