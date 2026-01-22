#!/bin/bash

# AWS Lambda Deployment Script
# This script supports both container-based and ZIP-based deployments

set -e

# Configuration
FUNCTION_NAME="${FUNCTION_NAME:-trading-engine-function}"
REGION="${AWS_REGION:-us-east-1}"
IMAGE_URI="${IMAGE_URI:-}"
DEPLOYMENT_TYPE="${DEPLOYMENT_TYPE:-container}"  # 'container' or 'zip'

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment...${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    exit 1
fi

# Check if Docker is installed (for container deployment)
if [ "$DEPLOYMENT_TYPE" = "container" ] && ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed (required for container deployment)${NC}"
    exit 1
fi

# Check if SAM CLI is installed (for SAM deployment)
if command -v sam &> /dev/null; then
    USE_SAM=true
else
    USE_SAM=false
    echo -e "${YELLOW}Warning: SAM CLI not found. Will use AWS CLI directly.${NC}"
fi

if [ "$DEPLOYMENT_TYPE" = "container" ]; then
    echo -e "${GREEN}Deploying using container-based approach...${NC}"
    
    if [ -z "$IMAGE_URI" ]; then
        # Generate ECR repository and image URI
        ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
        REPO_NAME="${FUNCTION_NAME}-repo"
        IMAGE_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}:latest"
        
        echo -e "${YELLOW}Image URI: ${IMAGE_URI}${NC}"
        
        # Create ECR repository if it doesn't exist
        if ! aws ecr describe-repositories --repository-names "$REPO_NAME" --region "$REGION" &> /dev/null; then
            echo -e "${GREEN}Creating ECR repository...${NC}"
            aws ecr create-repository --repository-name "$REPO_NAME" --region "$REGION"
        fi
        
        # Get login token and login to ECR
        echo -e "${GREEN}Logging in to ECR...${NC}"
        aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"
        
        # Build Docker image
        echo -e "${GREEN}Building Docker image...${NC}"
        docker build -t "$REPO_NAME" .
        
        # Tag image
        docker tag "${REPO_NAME}:latest" "$IMAGE_URI"
        
        # Push image to ECR
        echo -e "${GREEN}Pushing image to ECR...${NC}"
        docker push "$IMAGE_URI"
    fi
    
    if [ "$USE_SAM" = true ]; then
        # Use SAM for deployment
        echo -e "${GREEN}Deploying with SAM...${NC}"
        sam build --use-container
        sam deploy --guided --image-uri "$IMAGE_URI"
    else
        # Use AWS CLI directly
        echo -e "${GREEN}Creating/updating Lambda function...${NC}"
        
        # Check if function exists
        if aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" &> /dev/null; then
            # Update function code
            aws lambda update-function-code \
                --function-name "$FUNCTION_NAME" \
                --image-uri "$IMAGE_URI" \
                --region "$REGION"
            
            # Wait for update to complete
            echo -e "${GREEN}Waiting for function update...${NC}"
            aws lambda wait function-updated --function-name "$FUNCTION_NAME" --region "$REGION"
            
            echo -e "${GREEN}Function updated successfully!${NC}"
        else
            echo -e "${RED}Function does not exist. Please create it first using SAM or AWS Console.${NC}"
            exit 1
        fi
    fi

else
    echo -e "${GREEN}Deploying using ZIP-based approach...${NC}"
    echo -e "${YELLOW}Note: Large dependencies like pandas/numpy may require Lambda Layers${NC}"
    
    # Create deployment package
    echo -e "${GREEN}Creating deployment package...${NC}"
    zip -r function.zip . -x "*.git*" -x "*.pyc" -x "__pycache__/*" -x "*.parquet" -x "*.pkl" -x "*.env*"
    
    if [ "$USE_SAM" = true ]; then
        # Use SAM for deployment
        sam build
        sam deploy --guided
    else
        # Use AWS CLI directly
        if aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" &> /dev/null; then
            echo -e "${GREEN}Updating function code...${NC}"
            aws lambda update-function-code \
                --function-name "$FUNCTION_NAME" \
                --zip-file fileb://function.zip \
                --region "$REGION"
            
            echo -e "${GREEN}Function updated successfully!${NC}"
        else
            echo -e "${RED}Function does not exist. Please create it first using SAM or AWS Console.${NC}"
            exit 1
        fi
    fi
    
    # Clean up
    rm -f function.zip
fi

echo -e "${GREEN}Deployment complete!${NC}"
