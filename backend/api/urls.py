from django.urls import path
from .views import MockSleepDataView

urlpatterns = [
    path('mock-data/', MockSleepDataView.as_view(), name='mock_data'),
]
