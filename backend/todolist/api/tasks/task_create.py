from rest_framework import permissions
from rest_framework.views import APIView

from todolist.serializers import TaskSerializer
from ..responses import success_response


class TaskCreateAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return success_response(
            data=serializer.data,
            message="Task created successfully.",
            status_code=201,
        )
