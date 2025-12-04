#!/bin/bash
# Quick start script for VPS

cd /root/AHP/facebook-scrape

# Create venv if missing
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate and install deps
source venv/bin/activate
pip install -r requirements.txt

# Create .env with all required variables
# NOTE: You must fill in FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY from your Vercel dashboard
cat > .env << 'EOF'
VPS_ID=vps-1
INTERNAL_API_SECRET=b137e9844590984a3bbabdbe86e19d3d8378232a09c81523b6e68ff3ae5d7f37
COORDINATOR_URL=https://autohunter-bt33o8ags-hbaselabdelfa-7414s-projects.vercel.app/api/scraper
PROXY=sp2h3syb9a:ukA+l4AjzBfGx62t2r@isp.decodo.com:10001
FIREBASE_PROJECT_ID=autohunter-pro
FIREBASE_CLIENT_EMAIL=YOUR_FIREBASE_CLIENT_EMAIL_HERE
FIREBASE_PRIVATE_KEY=YOUR_FIREBASE_PRIVATE_KEY_HERE
EOF

# Load .env file
set -a
source .env
set +a

echo "Starting scraper..."
python run_with_coordinator.py --vps-id vps-1 --proxy "sp2h3syb9a:ukA+l4AjzBfGx62t2r@isp.decodo.com:10001"
