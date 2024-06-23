from django.core.management.base import BaseCommand
from slogapp.models import User, Profile, Blog, Comment, Category, BlogLike, CommentLike
import random

class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **kwargs):
        # Clear old data
        BlogLike.objects.all().delete()
        CommentLike.objects.all().delete()
        Comment.objects.all().delete()
        Blog.objects.all().delete()
        Category.objects.all().delete()
        Profile.objects.all().delete()
        User.objects.all().delete()

        self.stdout.write("Deleting old data...")
        self.stdout.write("Creating new data...")

        # Create Users and Profiles
        users = []
        for i in range(1, 11):  # Generate 10 users
            username = f"user_{i}"  # Unique username based on incremental integer
            email = f"user_{i}@example.com"  # Unique email based on incremental integer

            user = User.objects.create_user(
                username=username,
                email=email,
                password='password',
                first_name=f"First_{i}",
                last_name=f"Last_{i}"
            )

            # Check if Profile already exists for the user
            if not Profile.objects.filter(user=user).exists():
                # Automatically create a profile for each user if not already created
                Profile.objects.create(
                    user=user,
                    bio=f"This is the bio for {username}.",
                    image_url=""
                )
            users.append(user)

        # Create Categories
        categories = []
        for i in range(1, 6):  # Generate 5 categories
            category = Category.objects.create(category_name=f"Category_{i}")
            categories.append(category)

        # Create Blogs
        blogs = []
        for _ in range(20):
            blog = Blog.objects.create(
                user=random.choice(users),
                content=f"Content of Blog {_}",
                draft=random.choice([True, False]),
                hidden=random.choice([True, False])
            )
            blog.categories.set(random.sample(categories, k=random.randint(1, 3)))
            blogs.append(blog)

        # Create Comments
        comments = []
        for _ in range(50):
            comment = Comment.objects.create(
                user=random.choice(users),
                blog=random.choice(blogs),
                content=f"Comment {_} on Blog {random.choice(blogs).id}"
            )
            comments.append(comment)

        # Create BlogLikes
        for _ in range(100):
            user = random.choice(users)
            blog = random.choice(blogs)

            # Ensure that the combination of user and blog is unique
            BlogLike.objects.get_or_create(user=user, blog=blog)

        # Create CommentLikes
        for _ in range(100):
            user = random.choice(users)
            comment = random.choice(comments)

            # Ensure that the combination of user and comment is unique
            CommentLike.objects.get_or_create(user=user, comment=comment)

        self.stdout.write(self.style.SUCCESS('Successfully seeded the database'))
