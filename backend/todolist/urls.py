from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .api_views import LoginAPI, RegisterAPI, TaskViewSet
from .auth_views import LoginUserView,LogoutUserView,RegisterView

from .views import AboutView,ContactView,DeleteTaskView,HomePageView,TodoListView,ToggleTaskView   

router = DefaultRouter()

router.register(
    r"tasks",
    TaskViewSet,
    basename="tasks"
)

urlpatterns = [

    # AUTH
    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),

    path(
        "login/",
        LoginUserView.as_view(),
        name="login"
    ),

    path(
        "logout/",
        LogoutUserView.as_view(),
        name="logout"
    ),

    # HOME + PAGES
    path(
        "",
        HomePageView.as_view(),
        name="home"
    ),

    path(
        "about/",
        AboutView.as_view(),
        name="about"
    ),

    path(
        "contact/",
        ContactView.as_view(),
        name="contact"
    ),

    # TEMPLATE VIEWS
    path(
        "todolist/",
        TodoListView.as_view(),
        name="todolist"
    ),

    path(
        "todolist/<int:task_id>/toggle/",
        ToggleTaskView.as_view(),
        name="toggle_task"
    ),

    path(
        "todolist/<int:task_id>/delete/",
        DeleteTaskView.as_view(),
        name="delete_task"
    ),

    # API
    path(
        "api/register/",
        RegisterAPI.as_view(),
        name="api_register"
    ),

    path(
        "api/login/",
        LoginAPI.as_view(),
        name="api_login"
    ),

    path(
        "api/auth/register/",
        RegisterAPI.as_view(),
        name="api_auth_register"
    ),

    path(
        "api/auth/login/",
        LoginAPI.as_view(),
        name="api_auth_login"
    ),

    path(
        "api/",
        include(router.urls)
    ),
]
