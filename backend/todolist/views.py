from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404, redirect
from django.views import View
from django.views.generic import TemplateView
from .models import Task
from django.urls import reverse_lazy

LOGIN_URL = "login"
TODOLIST_URL = "todolist"
class HomePageView(View):

    def get(self, request):

        if request.user.is_authenticated:
            return redirect("todolist")

        return redirect("login")


class TodoListView(LoginRequiredMixin, TemplateView):

    login_url = reverse_lazy("login")

    template_name = "todolist.html"
    http_method_names = ["get", "post"]
    def post(self, request):

        title = request.POST.get("task", "").strip()

        if title:

            Task.objects.create(
                task=title,
                user=request.user
            )

            messages.success(
                request,
                "Task added successfully."
            )

        else:

            messages.error(
                request,
                "Please enter a task."
            )

        return redirect("todolist")

    def get_context_data(self, **kwargs):

        context = super().get_context_data(**kwargs)

        tasks = Task.objects.filter(
            user=self.request.user
        ).order_by("is_completed", "-id")

        total_tasks = tasks.count()

        completed_tasks = tasks.filter(
            is_completed=True
        ).count()

        context.update({
            "page": "Todo List",
            "tasks": tasks,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": total_tasks - completed_tasks,
        })

        return context


class ToggleTaskView(LoginRequiredMixin, View):

    login_url = reverse_lazy(LOGIN_URL)

    def post(self, request, task_id):

        task = get_object_or_404(
            Task,
            id=task_id,
            user=request.user
        )

        task.is_completed = not task.is_completed

        task.save(update_fields=["is_completed"])

        return redirect(TODOLIST_URL)


class DeleteTaskView(LoginRequiredMixin, View):

    login_url = reverse_lazy(LOGIN_URL)

    def post(self, request, task_id):

        task = get_object_or_404(
            Task,
            id=task_id,
            user=request.user
        )

        task.delete()

        messages.success(
            request,
            "Task deleted successfully."
        )

        return redirect(TODOLIST_URL)


class ContactView(TemplateView):

    template_name = "contact.html"

    def get_context_data(self, **kwargs):

        context = super().get_context_data(**kwargs)

        context["page"] = "Contact Page"

        return context


class AboutView(TemplateView):

    template_name = "about.html"

    def get_context_data(self, **kwargs):

        context = super().get_context_data(**kwargs)

        context["page"] = "About Page"

        return context
