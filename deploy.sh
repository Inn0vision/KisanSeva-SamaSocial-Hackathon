#!/bin/bash
# EC2 Deployment Script for KisanSeva

echo "Starting KisanSeva Deployment..."

# Ensure we have a .env file
if [ ! -f .env ]; then
    echo "ERROR: .env file is missing. Please create it and add GOOGLE_API_KEY."
    exit 1
fi

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-compose-plugin
fi

# Check for Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

echo "Building and starting containers..."
sudo docker-compose down
sudo docker-compose build
sudo docker-compose up -d

echo "Deployment complete! Application is running on port 80."
