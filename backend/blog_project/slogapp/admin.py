from django.contrib import admin
from .models import User, Profile, Category, Blog, BlogCategory, Comment, Like

admin.site.register(User)
admin.site.register(Profile)
admin.site.register(Category)
admin.site.register(Blog)
admin.site.register(BlogCategory)
admin.site.register(Comment)
admin.site.register(Like)
