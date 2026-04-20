from django.urls import path
from .views import MockSleepDataView, LiveHealthDataView, HistoricalHealthDataView

urlpatterns = [
    path('mock-data/', MockSleepDataView.as_view(), name='mock_data'),
    path('live/', LiveHealthDataView.as_view(), name='live-data'),
    path('historical/', HistoricalHealthDataView.as_view(), name='historical-data'),
]
