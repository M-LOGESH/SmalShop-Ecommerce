from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # If the response is not None, it means DRF handled it.
    if response is not None:
        # Standardize the error response format
        custom_data = {
            'status': 'error',
            'status_code': response.status_code,
            'errors': response.data
        }
        response.data = custom_data
    else:
        # Fallback for unhandled exceptions (Server Errors)
        return Response({
            'status': 'error',
            'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
            'message': 'An unexpected server error occurred.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
