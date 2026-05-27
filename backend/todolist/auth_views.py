from django.contrib import messages
from django.views import View
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect, render
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.urls import reverse_lazy

LOGIN_URL = "login"
TODOLIST_URL = "todolist"
REGISTER_URL = "register"

class RegisterView(View):

    template_name = "register.html"

    def dispatch(self, request, *args, **kwargs):

        if request.user.is_authenticated:
            return redirect(TODOLIST_URL)
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        return render(request, self.template_name)

    def post(self, request):

        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")

        if not username or not password:

            messages.error(
                request,
                "Username and password are required."
            )

            return redirect(REGISTER_URL)

        if User.objects.filter(username__iexact=username).exists():

            messages.error(
                request,
                "Username already exists."
            )

            return redirect(REGISTER_URL)

        user = User.objects.create_user(
            username=username,
            password=password
        )

        login(request, user)

        messages.success(
            request,
            "Account created successfully."
        )

        return redirect(TODOLIST_URL)


class LoginUserView(View):

    template_name = "login.html"

    def dispatch(self, request, *args, **kwargs):

        if request.user.is_authenticated:
            return redirect(TODOLIST_URL)

        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        return render(request, self.template_name)

    def post(self, request):

        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")

        if not username or not password:

            messages.error(
                request,
                "Username and password are required."
            )

            return redirect(LOGIN_URL)

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is None:

            messages.error(
                request,
                "Invalid username or password."
            )

            return redirect(LOGIN_URL)
        login(request, user)
        return redirect(TODOLIST_URL)


class LogoutUserView(LoginRequiredMixin, View):

    login_url = reverse_lazy(LOGIN_URL)
    http_method_names = ["post"]
    def post(self, request):
        logout(request)
        return redirect(LOGIN_URL)