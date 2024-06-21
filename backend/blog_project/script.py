# script.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog_project.settings')
django.setup()

from slogapp.models import User

active_users = User.objects.filter(is_active=True).count()
print(f'Active users: {active_users}')
