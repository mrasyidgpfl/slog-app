from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from slogapp.models import User, Profile, Blog, Comment, BlogLike, CommentLike, Category
from slogapp.serializers import UserSerializer, ProfileSerializer, BlogSerializer, CommentSerializer, BlogLikeSerializer, CommentLikeSerializer, CategorySerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APIClient
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.models import AnonymousUser
from django.shortcuts import get_object_or_404
from django.utils import timezone

class RegisterViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')

    def test_register_user(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword',
            'role': 'user'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

class ProfileViewTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword', role='user')
        self.profile = Profile.objects.create(user=self.user, bio='Test bio', image_url='test.jpg')
        self.client = APIClient()
        self.profile_url = reverse('profile-detail', kwargs={'pk': self.user.id})

    def test_get_profile(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['bio'], 'Test bio')

    def test_update_profile(self):
        updated_data = {
            'bio': 'Updated bio',
            'image_url': 'updated.jpg'
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.put(self.profile_url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Profile.objects.get(user=self.user).bio, 'Updated bio')

class BlogListCreateViewTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword', role='user')
        self.blog = Blog.objects.create(user=self.user, content='Test content', draft=False, hidden=False)
        self.client = APIClient()
        self.blog_list_url = reverse('blog-list')

    def test_get_blog_list(self):
        response = self.client.get(self.blog_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_blog(self):
        data = {
            'user_id': self.user.id,
            'content': 'New blog content',
            'draft': False,
            'hidden': False
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.blog_list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Blog.objects.count(), 2)

class BlogDetailViewTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword', role='user')
        self.blog = Blog.objects.create(user=self.user, content='Test content', draft=False, hidden=False)
        self.client = APIClient()
        self.blog_detail_url = reverse('blog-detail', kwargs={'pk': self.blog.id})

    def test_get_blog_detail(self):
        response = self.client.get(self.blog_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['content'], 'Test content')

    def test_update_blog(self):
        updated_data = {
            'content': 'Updated content',
            'draft': True,
            'hidden': True
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.put(self.blog_detail_url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Blog.objects.get(id=self.blog.id).content, 'Updated content')

class CommentCreateViewTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword', role='user')
        self.blog = Blog.objects.create(user=self.user, content='Test content', draft=False, hidden=False)
        self.client = APIClient()
        self.comment_create_url = reverse('comment-create')

    def test_create_comment(self):
        data = {
            'blog': self.blog.id,
            'user': self.user.id,
            'content': 'Test comment'
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.comment_create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)

class CommentDetailViewTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword', role='user')
        self.blog = Blog.objects.create(user=self.user, content='Test content', draft=False, hidden=False)
        self.comment = Comment.objects.create(blog=self.blog, user=self.user, content='Test comment')
        self.client = APIClient()
        self.comment_detail_url = reverse('comment-detail', kwargs={'pk': self.comment.id, 'blog_id': self.blog.id})

    def test_get_comment_detail(self):
        response = self.client.get(self.comment_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['content'], 'Test comment')

    def test_update_comment(self):
        updated_data = {
            'content': 'Updated comment'
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.put(self.comment_detail_url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Comment.objects.get(id=self.comment.id).content, 'Updated comment')

class BlogLikeCreateViewTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword', role='user')
        self.blog = Blog.objects.create(user=self.user, content='Test content', draft=False, hidden=False)
        self.client = APIClient()
        self.blog_like_create_url = reverse('blog-like-create')

    def test_create_blog_like(self):
        data = {
            'user_id': self.user.id,
            'blog_id': self.blog.id
        }
        response = self.client.post(self.blog_like_create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BlogLike.objects.count(), 1)

class CommentLikeCreateViewTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword', role='user')
        self.blog = Blog.objects.create(user=self.user, content='Test content', draft=False, hidden=False)
        self.comment = Comment.objects.create(blog=self.blog, user=self.user, content='Test comment')
        self.client = APIClient()
        self.comment_like_create_url = reverse('comment-like-create')

    def test_create_comment_like(self):
        data = {
            'user_id': self.user.id,
            'comment_id': self.comment.id
        }
        response = self.client.post(self.comment_like_create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CommentLike.objects.count(), 1)

class BlogLikeDeleteViewTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword', role='user')
        self.blog = Blog.objects.create(user=self.user, content='Test content', draft=False, hidden=False)
        self.blog_like = BlogLike.objects.create(user=self.user, blog=self.blog)
        self.client = APIClient()
        self.blog_like_delete_url = reverse('blog-like-delete', kwargs={'pk': self.blog_like.id})

    def test_delete_blog_like(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.blog_like_delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(BlogLike.objects.count(), 0)

class CommentLikeDeleteViewTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword', role='user')
        self.blog = Blog.objects.create(user=self.user, content='Test content', draft=False, hidden=False)
        self.comment = Comment.objects.create(blog=self.blog, user=self.user, content='Test comment')
        self.comment_like = CommentLike.objects.create(user=self.user, comment=self.comment)
        self.client = APIClient()
        self.comment_like_delete_url = reverse('comment-like-delete', kwargs={'pk': self.comment_like.id})

    def test_delete_comment_like(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.comment_like_delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CommentLike.objects.count(), 0)
