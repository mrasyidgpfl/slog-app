from django.urls import path
from . import views

urlpatterns = [
    path('rpc_login/', views.rpc_login, name='rpc_login'),
    path('rpc_logout/', views.rpc_logout, name='rpc_logout'),
    # Add more paths as needed for your application
]
