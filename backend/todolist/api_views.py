from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Task
from .serializers import LoginSerializer, RegisterSerializer, TaskSerializer
from rest_framework import generics


def get_tokens_for_user(user):

    refresh = RefreshToken.for_user(user)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class RegisterAPI(generics.CreateAPIView):

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            get_tokens_for_user(user),
            status=status.HTTP_201_CREATED
        )


class LoginAPI(APIView):

    permission_classes = [permissions.AllowAny]

    def post(self, request):

        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            request=request,
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"]
        )

        if user is None:
            return Response(
                {"detail": "Invalid username or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        return Response(
            get_tokens_for_user(user),
            status=status.HTTP_200_OK
        )



class TaskViewSet(viewsets.ModelViewSet):

    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):

        return Task.objects.filter(
            user=self.request.user
        ).order_by("is_completed", "-id")

    def perform_create(self, serializer):

        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def toggle(self, request, pk=None):

        task = self.get_object()
        task.is_completed = not task.is_completed
        task.save(update_fields=["is_completed"])

        return Response(
            {
                "message": "Task toggled successfully",
                "is_completed": task.is_completed
            },
            status=status.HTTP_200_OK
        )
