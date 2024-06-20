from django.urls import path
from .views import rpc_register, rpc_login, rpc_logout, profile_detail, change_password

urlpatterns = [
    path('rpc_register', rpc_register, name='rpc_register'),
    path('rpc_login', rpc_login, name='rpc_login'),
    path('rpc_logout', rpc_logout, name='rpc_logout'),
    path('profile', profile_detail, name='profile_detail'),
    path('change_password/', change_password, name='change_password'),
]
