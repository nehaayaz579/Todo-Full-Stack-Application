from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
import traceback


async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Global exception handler for HTTP exceptions
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail if hasattr(exc, 'detail') else "An error occurred",
            "success": False
        }
    )


async def general_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for general exceptions
    """
    # Log the full traceback for debugging
    print(f"Unhandled exception: {exc}")
    traceback.print_exc()
    
    # Return a user-friendly error message
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An internal server error occurred",
            "success": False
        }
    )