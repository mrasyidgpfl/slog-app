from django.core.management.base import BaseCommand
from django.utils import timezone
from slogapp.models import User, Profile, Blog, Category, BlogCategory, Comment, Like
from django.db import transaction
from random import randint

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        # Create users with unique email addresses
        with transaction.atomic():
            for i in range(10):
                username = f'user_{i}'
                email = f'{username}@example.com'  # Adjust domain as necessary
                password = 'password'
                
                # Ensure email uniqueness
                while User.objects.filter(email=email).exists():
                    username += '_duplicate'  # Append to avoid duplicates
                    email = f'{username}@example.com'

                user = User.objects.create(username=username, email=email, password=password)

                # Create profile for each user
                if not Profile.objects.filter(user=user).exists():
                    Profile.objects.create(user=user, bio=f'Bio for {username}', image_url='http://example.com/image.png')

        self.stdout.write(self.style.SUCCESS('Successfully seeded users and profiles.'))

        # Create categories
        categories = []
        for i in range(10):
            category = Category.objects.create(
                category_name=f'Category {i}'
            )
            categories.append(category)

        # Create blogs with categories
        for i in range(10):
            user = User.objects.get(username=f'user_{i}')  # Assign blogs to users based on username
            blog = Blog.objects.create(
                user=user,  # Associate each blog with a user
                content=f'This is blog number {i}',
                created_datetime=timezone.now(),
                updated_datetime=timezone.now(),
                draft=False
            )
            # Assign 2 random categories to each blog
            random_categories = [categories[randint(0, 9)], categories[randint(0, 9)]]
            for category in random_categories:
                BlogCategory.objects.create(blog=blog, category=category)

        self.stdout.write(self.style.SUCCESS('Successfully seeded blogs and categories.'))

        # Create comments
        for i in range(10):
            user = User.objects.get(username=f'user_{i}')
            blog = Blog.objects.get(pk=i + 1)  # Assuming blogs are created with IDs 1-10
            Comment.objects.create(
                post=blog,
                user=user,
                content=f'Comment {i} on blog {blog.id}'
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded comments.'))

        # Create likes
        for i in range(10):
            user = User.objects.get(username=f'user_{i}')
            blog = Blog.objects.get(pk=i + 1)  # Assuming blogs are created with IDs 1-10
            Like.objects.create(
                user=user,
                blog=blog
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded likes.'))
