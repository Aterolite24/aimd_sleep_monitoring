from rest_framework.views import APIView
from rest_framework.response import Response
from .models import DailyHealthRecord
import random
from datetime import datetime, timedelta

class LiveHealthDataView(APIView):
    def get(self, request):
        now = datetime.now()
        # Simulated live data
        return Response({
            "timestamp": now.strftime('%H:%M:%S'),
            "heart_rate": random.randint(60, 100),
            "temperature": round(random.uniform(36.0, 37.5), 1),
            "min_spo2": random.randint(95, 100),
            "pulse_rate": random.randint(60, 100),
            "sys_bp": random.randint(110, 130),
            "dia_bp": random.randint(70, 85),
            "movement_intensity": round(random.uniform(0.0, 5.0), 2),
            "sleep_stage": random.choice([0, 1, 2, 3, 4])
        })

class HistoricalHealthDataView(APIView):
    def get(self, request):
        target_date = request.query_params.get('date', None)
        if target_date:
            try:
                record = DailyHealthRecord.objects.get(date=target_date)
                data = {
                    "date": str(record.date),
                    "avg_heart_rate": record.avg_heart_rate,
                    "min_heart_rate": record.min_heart_rate,
                    "max_heart_rate": record.max_heart_rate,
                    "avg_temperature": record.avg_temperature,
                    "min_temperature": record.min_temperature,
                    "max_temperature": record.max_temperature,
                    "min_spo2": record.min_spo2,
                    "avg_pulse_rate": record.avg_pulse_rate,
                    "min_pulse_rate": record.min_pulse_rate,
                    "max_pulse_rate": record.max_pulse_rate,
                    "avg_sys_bp": record.avg_sys_bp,
                    "min_sys_bp": record.min_sys_bp,
                    "max_sys_bp": record.max_sys_bp,
                    "avg_dia_bp": record.avg_dia_bp,
                    "min_dia_bp": record.min_dia_bp,
                    "max_dia_bp": record.max_dia_bp,
                    "avg_movement": record.avg_movement,
                    "min_movement": record.min_movement,
                    "max_movement": record.max_movement,
                    "sleep_architecture": [
                        { "time": "10 PM", "stage": random.choice([0, 1]) },
                        { "time": "11 PM", "stage": random.choice([2, 3]) },
                        { "time": "12 AM", "stage": random.choice([3, 4]) },
                        { "time": "1 AM", "stage": random.choice([1, 2]) },
                        { "time": "2 AM", "stage": random.choice([3, 4]) },
                        { "time": "3 AM", "stage": random.choice([1, 2]) },
                        { "time": "4 AM", "stage": random.choice([2, 3]) },
                        { "time": "5 AM", "stage": random.choice([1, 2]) },
                        { "time": "6 AM", "stage": 0 }
                    ]
                }
            except DailyHealthRecord.DoesNotExist:
                return Response({"error": "No data found for this date."}, status=404)
            return Response(data)
        
        # If no date, return list of dates
        dates = DailyHealthRecord.objects.values_list('date', flat=True).order_by('-date')
        # Return format as array of string dates
        return Response({"available_dates": [str(d) for d in dates]})


class MockSleepDataView(APIView):
    def get(self, request):
        return Response({
            "daily_sleep_score": 85,
            "duration": "8h 12m",
            "heart_rate": {
                "value": 62,
                "status": "Normal"
            },
            "spo2": {
                "value": 98,
                "status": "Healthy"
            },
            "noise_level": {
                "value": 32,
                "status": "Quiet"
            },
            "room_temperature": {
                "value": 24,
                "status": "Optimal"
            },
            "sleep_architecture": [
                { "time": "10 PM", "stage": 1 },
                { "time": "11 PM", "stage": 3 },
                { "time": "12 AM", "stage": 4 },
                { "time": "1 AM", "stage": 2 },
                { "time": "2 AM", "stage": 4 },
                { "time": "3 AM", "stage": 1 },
                { "time": "4 AM", "stage": 3 },
                { "time": "5 AM", "stage": 2 },
                { "time": "6 AM", "stage": 0 }
            ]
        })
