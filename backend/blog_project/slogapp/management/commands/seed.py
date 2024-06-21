from django.core.management.base import BaseCommand
from slogapp.models import User, Profile, Blog, Category

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        admin = User.objects.create_superuser(username='admin', email='admin@example.com', password='password')
        user = User.objects.create_user(username='user', email='user@example.com', password='password')
        Profile.objects.create(user=admin, bio='Admin bio', image_url='http://example.com/image.png')
        Profile.objects.create(user=user, bio='User bio', image_url='http://example.com/image.png')
        category = Category.objects.create(category_name='Django')
        Blog.objects.create(content='This is a test blog', categories=[category])
