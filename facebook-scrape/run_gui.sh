#!/bin/bash
# Run scraper with visible browser (after desktop is installed)

cd /root/AHP/facebook-scrape

source venv/bin/activate

export INTERNAL_API_SECRET="b137e9844590984a3bbabdbe86e19d3d8378232a09c81523b6e68ff3ae5d7f37"

echo "Starting scraper with visible browser..."
python run_with_coordinator.py --vps-id vps-1 --proxy "sp2h3syb9a:ukA+l4AjzBfGx62t2r@isp.decodo.com:10001"
