def format_error(message: str, error_code: str = None, details: dict = None):
    """
    Format error responses consistently
    """
    error_response = {
        "success": False,
        "message": message
    }
    
    if error_code:
        error_response["error_code"] = error_code
        
    if details:
        error_response["details"] = details
        
    return error_response


def format_success(data=None, message: str = "Request successful"):
    """
    Format success responses consistently
    """
    success_response = {
        "success": True,
        "message": message
    }
    
    if data:
        success_response["data"] = data
        
    return success_response