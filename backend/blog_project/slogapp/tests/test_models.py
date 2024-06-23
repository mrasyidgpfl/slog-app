from django.test import TestCase
from django.contrib.auth import get_user_model
from slogapp.models import User, Profile, Category, Blog, BlogCategory, Comment, BlogLike, CommentLike

class ModelsTestCase(TestCase):

    def setUp(self):
        # Create some test data before each test method runs
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='password',
            role='user'
        )
        self.category = Category.objects.create(category_name='Test Category')
        self.blog = Blog.objects.create(
            user=self.user,
            content='Test Blog Content',
            draft=False,
            hidden=False
        )
        self.comment = Comment.objects.create(
            user=self.user,
            blog=self.blog,
            content='Test Comment'
        )

    def test_user_creation(self):
        user_count = User.objects.count()
        self.assertEqual(user_count, 1)  # Check if the user was created successfully

    def test_profile_creation(self):
        profile_count = Profile.objects.count()
        self.assertEqual(profile_count, 1)  # Check if the profile was created for the user

    def test_category_creation(self):
        category_count = Category.objects.count()
        self.assertEqual(category_count, 1)  # Check if the category was created successfully

    def test_blog_creation(self):
        blog_count = Blog.objects.count()
        self.assertEqual(blog_count, 1)  # Check if the blog was created successfully

    def test_comment_creation(self):
        comment_count = Comment.objects.count()
        self.assertEqual(comment_count, 1)  # Check if the comment was created successfully

    def test_blog_like_creation(self):
        # Create a blog like
        blog_like = BlogLike.objects.create(
            user=self.user,
            blog=self.blog
        )
        blog_like_count = BlogLike.objects.count()
        self.assertEqual(blog_like_count, 1)  # Check if the blog like was created successfully

    def test_comment_like_creation(self):
        # Create a comment like
        comment_like = CommentLike.objects.create(
            user=self.user,
            comment=self.comment
        )
        comment_like_count = CommentLike.objects.count()
        self.assertEqual(comment_like_count, 1)  # Check if the comment like was created successfully

    def test_signal_user_profile_creation(self):
        # Check if a profile was created when a new user is created
        profile = Profile.objects.get(user=self.user)
        self.assertEqual(profile.user.username, 'testuser')  # Check if the profile is associated with the correct user

    def test_signal_user_profile_update(self):
        # Update the user and check if the profile is saved
        self.user.username = 'updateduser'
        self.user.save()
        profile = Profile.objects.get(user=self.user)
        self.assertEqual(profile.user.username, 'updateduser')  # Check if the profile was updated with the new username
