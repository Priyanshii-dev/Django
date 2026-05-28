from rest_framework.response import Response


def success_response(data, message="Success", status_code=200):
    return Response(
        {
            "success": True,
            "statusCode": status_code,
            "message": message,
            "data": data,
        },
        status=status_code,
    )


def error_response(message="Something went wrong", status_code=400):
    return Response(
        {
            "success": False,
            "statusCode": status_code,
            "message": message,
            "error": True,
        },
        status=status_code,
    )


def get_positive_int(value, default):
    try:
        value = int(value)
    except (TypeError, ValueError):
        return default

    return value if value > 0 else default
