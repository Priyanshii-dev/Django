from django.conf import settings
from django.http import HttpResponse


class SimpleCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        origin = request.headers.get("Origin")
        allowed_origins = getattr(settings, "CORS_ALLOWED_ORIGINS", [])

        if request.method == "OPTIONS" and origin in allowed_origins:
            response = HttpResponse()
        else:
            response = self.get_response(request)

        if origin in allowed_origins:
            response["Access-Control-Allow-Origin"] = origin
            response["Vary"] = "Origin"
            response["Access-Control-Allow-Headers"] = (
                "authorization, content-type"
            )
            response["Access-Control-Allow-Methods"] = (
                "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            )

        return response
