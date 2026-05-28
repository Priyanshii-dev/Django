from rest_framework import permissions
from rest_framework.views import APIView

from ..responses import success_response
from .task_helpers import get_single_task_for_user


class TaskToggleAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, task_id):
        task = get_single_task_for_user(request.user, task_id)
        task.is_completed = not task.is_completed
        task.save(update_fields=["is_completed"])

        return success_response(
            data={"is_completed": task.is_completed},
            message="Task toggled successfully.",
        )
