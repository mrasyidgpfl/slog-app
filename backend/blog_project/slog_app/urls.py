from django.urls import path
from .views_rpc import RPCView
from .views_profile import ProfileView

urlpatterns = [
    path('api/rpc/', RPCView.as_view(), name='rpc'),
    path('api/profile/', ProfileView.as_view(), name='profile'),
]
