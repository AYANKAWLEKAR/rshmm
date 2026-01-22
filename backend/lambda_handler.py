"""
AWS Lambda handler for FastAPI application.
This file wraps the FastAPI app with Mangum adapter for Lambda compatibility.
"""
from mangum import Mangum
from main import app

# Create the Lambda handler using Mangum
# lifespan="off" disables FastAPI lifespan events (not needed for Lambda)
handler = Mangum(app, lifespan="off")
