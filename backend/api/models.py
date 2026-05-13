from django.db import models

class DailyHealthRecord(models.Model):
    date = models.DateField(unique=True)
    avg_heart_rate = models.FloatField()
    min_heart_rate = models.FloatField()
    max_heart_rate = models.FloatField()
    
    avg_temperature = models.FloatField()
    min_temperature = models.FloatField()
    max_temperature = models.FloatField()
    
    min_spo2 = models.FloatField()
    
    avg_pulse_rate = models.FloatField()
    min_pulse_rate = models.FloatField()
    max_pulse_rate = models.FloatField()
    
    avg_sys_bp = models.IntegerField()
    min_sys_bp = models.IntegerField()
    max_sys_bp = models.IntegerField()
    
    avg_dia_bp = models.IntegerField()
    min_dia_bp = models.IntegerField()
    max_dia_bp = models.IntegerField()
    
    avg_movement = models.FloatField()
    min_movement = models.FloatField()
    max_movement = models.FloatField()
    
    sleep_architecture = models.JSONField(null=True, blank=True)
    
    # ML Predictors Tracking
    spo2_drops = models.IntegerField(default=0)
    pr_spikes = models.IntegerField(default=0)
    total_movement = models.FloatField(default=0.0)
    total_duration = models.IntegerField(default=480)
    
    # ML Results
    sleep_score = models.FloatField(null=True, blank=True)
    apnea_risk = models.BooleanField(null=True, blank=True)
    insomnia_risk = models.BooleanField(null=True, blank=True)
    
    def __str__(self):
        return str(self.date)
