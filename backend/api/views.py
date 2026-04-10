from rest_framework.views import APIView
from rest_framework.response import Response

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
