from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient


class AuthAPITests(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_register_api_creates_user_and_returns_tokens(self):
        response = self.client.post(
            "/api/register/",
            {
                "username": "newuser",
                "password": "StrongPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="newuser").exists())
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_register_api_rejects_duplicate_username(self):
        User.objects.create_user(
            username="existing",
            password="StrongPass123!",
        )

        response = self.client.post(
            "/api/register/",
            {
                "username": "Existing",
                "password": "StrongPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)

    def test_login_api_returns_tokens_for_valid_credentials(self):
        User.objects.create_user(
            username="activeuser",
            password="StrongPass123!",
        )

        response = self.client.post(
            "/api/login/",
            {
                "username": "activeuser",
                "password": "StrongPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_api_rejects_invalid_credentials(self):
        response = self.client.post(
            "/api/login/",
            {
                "username": "missing",
                "password": "wrongpass",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(
            response.data["detail"],
            "Invalid username or password.",
        )
