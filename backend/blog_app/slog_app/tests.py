from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
import json 

class AuthTests(TestCase):
    def setUp(self):
        # Create a test user
        self.username = 'testuser'
        self.password = 'testpassword'
        self.user = User.objects.create_user(username=self.username, password=self.password)
        self.client = Client()

    def test_rpc_login_success(self):
        response = self.client.post(
            reverse('rpc_login'),
            data=json.dumps({'username': self.username, 'password': self.password}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['success'], True)
        self.assertEqual(response.json()['message'], 'Logged in successfully')

    def test_rpc_login_failure(self):
        response = self.client.post(
            reverse('rpc_login'),
            data=json.dumps({'username': self.username, 'password': 'wrongpassword'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['success'], False)
        self.assertEqual(response.json()['message'], 'Invalid credentials')

    def test_rpc_login_invalid_json(self):
        response = self.client.post(
            reverse('rpc_login'),
            data='invalid json',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['success'], False)
        self.assertEqual(response.json()['message'], 'Invalid JSON format')

    def test_rpc_login_get_not_allowed(self):
        response = self.client.get(reverse('rpc_login'))
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()['success'], False)
        self.assertEqual(response.json()['message'], 'Only POST requests are allowed')

    def test_rpc_logout(self):
        self.client.login(username=self.username, password=self.password)
        response = self.client.post(reverse('rpc_logout'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['success'], True)
        self.assertEqual(response.json()['message'], 'Logged out successfully')
