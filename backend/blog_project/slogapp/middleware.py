from django.utils.deprecation import MiddlewareMixin
import logging

logger = logging.getLogger(__name__)

class CustomLoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Log request details here
        logger.info(f"Request: {request.method} {request.get_full_path()}")

    def process_response(self, request, response):
        # Log response details here
        logger.info(f"Response: {response.status_code} {response.reason_phrase}")
        return response
