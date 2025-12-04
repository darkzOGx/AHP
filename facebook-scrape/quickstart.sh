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

# Create .env
cat > .env << 'EOF'
VPS_ID=vps-1
INTERNAL_API_SECRET=b137e9844590984a3bbabdbe86e19d3d8378232a09c81523b6e68ff3ae5d7f37
COORDINATOR_URL=https://www.autohunterpro.com/api/scraper
PROXY=sp2h3syb9a:ukA+l4AjzBfGx62t2r@isp.decodo.com:10001
EOF

# Export and run
export INTERNAL_API_SECRET="b137e9844590984a3bbabdbe86e19d3d8378232a09c81523b6e68ff3ae5d7f37"

echo "Starting scraper..."
python run_with_coordinator.py --vps-id vps-1 --proxy "sp2h3syb9a:ukA+l4AjzBfGx62t2r@isp.decodo.com:10001"
