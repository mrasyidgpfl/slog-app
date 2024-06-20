from django.test import TestCase, Client
from django.urls import reverse
from .models import CustomUser
import json

class AuthTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.username = 'testuser'
        self.email = 'testuser@example.com'
        self.password = 'testpass123'
        self.user = CustomUser.objects.create_user(username=self.username, email=self.email, password=self.password)

    def test_rpc_register(self):
        response = self.client.post(reverse('rpc_register'), json.dumps({
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword123'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['success'])

    def test_rpc_login_success(self):
        response = self.client.post(reverse('rpc_login'), json.dumps({
            'username_or_email': self.username,
            'password': self.password
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['success'])

    def test_rpc_login_failure(self):
        response = self.client.post(reverse('rpc_login'), json.dumps({
            'username_or_email': self.username,
            'password': 'wrongpassword'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json()['success'])

    def test_rpc_logout(self):
        self.client.login(username=self.username, password=self.password)
        response = self.client.post(reverse('rpc_logout'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['success'])

    def test_edit_profile(self):
        self.client.login(username=self.username, password=self.password)
        response = self.client.post(reverse('edit_profile'), json.dumps({
            'bio': 'Updated bio',
            'profile_image': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['success'])
        self.user.refresh_from_db()
        self.assertEqual(self.user.profile.bio, 'Updated bio')
