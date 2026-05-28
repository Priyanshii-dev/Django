from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Task


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username"]


class TaskSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "task",
            "is_completed",
            "user_id",
            "username",
        ]
        read_only_fields = ["user_id", "username"]

    def validate_task(self, value):

        value = value.strip()
        if not value:
            raise serializers.ValidationError(
                "Task cannot be empty."
            )

        return value


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, trim_whitespace=False)

    class Meta:

        model = User
        fields = ["username", "password"]

    def validate_username(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Username is required."
            )

        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "Username already exists."
            )

        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):

        return User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"]
        )


class LoginSerializer(serializers.Serializer):

    username = serializers.CharField()
    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False
    )

    def validate_username(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Username is required."
            )

        return value
