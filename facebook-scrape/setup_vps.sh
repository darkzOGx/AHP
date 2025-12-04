#!/bin/bash
# VPS Setup Script for Facebook Marketplace Scraper
#
# This script sets up a new VPS instance for scraping.
# Run this on each VPS after initial system setup.
#
# Usage: ./setup_vps.sh --vps-id vps-1 --api-secret YOUR_SECRET --proxy "user:pass@host:port"

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}VPS Setup for Facebook Marketplace Scraper${NC}"
echo -e "${GREEN}========================================${NC}"

# Parse arguments
VPS_ID=""
API_SECRET=""
PROXY=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --vps-id)
            VPS_ID="$2"
            shift 2
            ;;
        --api-secret)
            API_SECRET="$2"
            shift 2
            ;;
        --proxy)
            PROXY="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Validate required arguments
if [ -z "$VPS_ID" ]; then
    echo -e "${RED}ERROR: --vps-id is required${NC}"
    echo "Usage: ./setup_vps.sh --vps-id vps-1 --api-secret YOUR_SECRET --proxy 'user:pass@host:port'"
    exit 1
fi

if [ -z "$API_SECRET" ]; then
    echo -e "${RED}ERROR: --api-secret is required${NC}"
    echo "Get your API secret from the .env.local file (INTERNAL_API_SECRET)"
    exit 1
fi

echo -e "\n${YELLOW}VPS ID: ${VPS_ID}${NC}"
echo -e "${YELLOW}Proxy: ${PROXY:-'Not configured'}${NC}"

# Step 1: Update system
echo -e "\n${GREEN}Step 1: Updating system...${NC}"
sudo apt-get update && sudo apt-get upgrade -y

# Step 2: Install Python and dependencies
echo -e "\n${GREEN}Step 2: Installing Python and dependencies...${NC}"
sudo apt-get install -y python3 python3-pip python3-venv git wget unzip

# Step 3: Install Chrome
echo -e "\n${GREEN}Step 3: Installing Google Chrome...${NC}"
if ! command -v google-chrome &> /dev/null; then
    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
    sudo dpkg -i google-chrome-stable_current_amd64.deb || sudo apt-get -f install -y
    rm google-chrome-stable_current_amd64.deb
    echo -e "${GREEN}Chrome installed successfully${NC}"
else
    echo -e "${YELLOW}Chrome already installed${NC}"
fi

# Step 4: Create virtual environment
echo -e "\n${GREEN}Step 4: Setting up Python virtual environment...${NC}"
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate

# Step 5: Install Python requirements
echo -e "\n${GREEN}Step 5: Installing Python requirements...${NC}"
pip install --upgrade pip
pip install -r requirements.txt

# Step 6: Create environment file
echo -e "\n${GREEN}Step 6: Creating environment configuration...${NC}"
cat > .env << EOF
# VPS Configuration
VPS_ID=${VPS_ID}
INTERNAL_API_SECRET=${API_SECRET}
COORDINATOR_URL=https://www.autohunterpro.com/api/scraper

# Proxy (optional)
PROXY=${PROXY}
EOF

echo -e "${GREEN}Environment file created: .env${NC}"

# Step 7: Create systemd service for auto-restart
echo -e "\n${GREEN}Step 7: Creating systemd service...${NC}"
SCRIPT_DIR=$(pwd)
cat > /tmp/fb-scraper.service << EOF
[Unit]
Description=Facebook Marketplace Scraper - ${VPS_ID}
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=${SCRIPT_DIR}
Environment="PATH=${SCRIPT_DIR}/venv/bin:/usr/local/bin:/usr/bin:/bin"
EnvironmentFile=${SCRIPT_DIR}/.env
ExecStart=${SCRIPT_DIR}/venv/bin/python run_with_coordinator.py --vps-id ${VPS_ID} ${PROXY:+--proxy "$PROXY"}
Restart=always
RestartSec=60

[Install]
WantedBy=multi-user.target
EOF

sudo mv /tmp/fb-scraper.service /etc/systemd/system/fb-scraper.service
sudo systemctl daemon-reload

echo -e "${GREEN}Systemd service created: fb-scraper${NC}"

# Step 8: Setup log rotation
echo -e "\n${GREEN}Step 8: Setting up log rotation...${NC}"
cat > /tmp/fb-scraper-logrotate << EOF
${SCRIPT_DIR}/scraper.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    copytruncate
}
EOF

sudo mv /tmp/fb-scraper-logrotate /etc/logrotate.d/fb-scraper

# Step 9: Test the setup
echo -e "\n${GREEN}Step 9: Testing setup...${NC}"
export INTERNAL_API_SECRET="${API_SECRET}"

# Test coordinator connection
python -c "
from coordinator_client import CoordinatorClient
client = CoordinatorClient('${VPS_ID}')
health = client.check_health()
print(f'Coordinator health: {health}')
" && echo -e "${GREEN}Coordinator connection successful${NC}" || echo -e "${YELLOW}Warning: Coordinator connection failed${NC}"

# Final instructions
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\nTo start the scraper:"
echo -e "  ${YELLOW}sudo systemctl start fb-scraper${NC}"
echo -e "\nTo enable auto-start on boot:"
echo -e "  ${YELLOW}sudo systemctl enable fb-scraper${NC}"
echo -e "\nTo check status:"
echo -e "  ${YELLOW}sudo systemctl status fb-scraper${NC}"
echo -e "\nTo view logs:"
echo -e "  ${YELLOW}tail -f scraper.log${NC}"
echo -e "  ${YELLOW}journalctl -u fb-scraper -f${NC}"
echo -e "\nTo run manually (for testing):"
echo -e "  ${YELLOW}source venv/bin/activate${NC}"
echo -e "  ${YELLOW}export INTERNAL_API_SECRET='${API_SECRET}'${NC}"
echo -e "  ${YELLOW}python run_with_coordinator.py --vps-id ${VPS_ID}${PROXY:+ --proxy '$PROXY'}${NC}"
