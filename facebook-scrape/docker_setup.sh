#!/bin/bash
# ONE COMMAND DOCKER SETUP - Just run this and forget

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl start docker
    systemctl enable docker
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    apt-get install -y docker-compose-plugin docker-compose
fi

cd /root/AHP/facebook-scrape

# Build and run
echo "Building Docker image (this takes a few minutes first time)..."
docker-compose up --build -d

echo ""
echo "========================================"
echo "SCRAPER IS NOW RUNNING!"
echo "========================================"
echo ""
echo "View logs:     docker-compose logs -f"
echo "Stop:          docker-compose down"
echo "Restart:       docker-compose restart"
echo ""
