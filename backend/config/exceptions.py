import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import PermissionDenied, ValidationError as DjangoValidationError
from django.http import Http404

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Standardized, secure exception handler.
    Prevents leaking internal stack traces and server internals.
    """
    response = exception_handler(exc, context)

    if response is not None:
        # Standardize DRF error response
        custom_data = {
            'success': False,
            'errors': response.data if isinstance(response.data, (dict, list)) else {'detail': str(response.data)},
            'status_code': response.status_code,
        }
        response.data = custom_data
        return response

    # Handle Django-specific exceptions not caught by DRF
    if isinstance(exc, DjangoValidationError):
        return Response({
            'success': False,
            'errors': {'validation_error': exc.messages if hasattr(exc, 'messages') else str(exc)},
            'status_code': status.HTTP_400_BAD_REQUEST,
        }, status=status.HTTP_400_BAD_REQUEST)

    if isinstance(exc, (Http404, PermissionDenied)):
        return None

    # Unhandled server exceptions: Log internally, return generic error to client
    logger.error("Unhandled Server Exception in API view: %s", exc, exc_info=True)
    return Response({
        'success': False,
        'errors': {'detail': 'An unexpected error occurred. Please contact support if the issue persists.'},
        'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
