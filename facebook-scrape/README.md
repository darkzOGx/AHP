# Facebook Marketplace Scraper - Optimized Multi-VPS System

This is an optimized scraping system for Facebook Marketplace vehicles with:
- **Coordinator-based job management** - No duplicate scraping across VPS instances
- **350 cities across 30 states** - Comprehensive US coverage
- **Deduplication** - Skip already-scraped listings
- **Smart cooldowns** - Automatic 4-hour cooldown per city
- **Centralized monitoring** - Track all VPS instances from one dashboard

## Quick Start

### Option 1: Coordinator Mode (Recommended)

Run with dynamic job assignment from the coordinator:

```bash
# Set environment variables
export INTERNAL_API_SECRET="your-api-secret-from-env-file"

# Run with coordinator
python run_with_coordinator.py --vps-id vps-1 --proxy "user:pass@host:port"
```

### Option 2: Static CSV Mode (Legacy)

Generate a static input.csv for a specific VPS:

```bash
# Generate input.csv for VPS-1
python generate_input.py --vps-id vps-1

# Run the scraper
python index.py --proxy "user:pass@host:port"
```

## VPS Configuration

Each VPS is assigned specific states to prevent overlap:

| VPS ID | Name | States |
|--------|------|--------|
| vps-1 | West Coast Primary | California, Nevada, Oregon |
| vps-2 | West Coast Secondary | Arizona, Washington, Colorado, Utah |
| vps-3 | Texas & Southwest | Texas, New Mexico, Oklahoma |
| vps-4 | Midwest | Illinois, Ohio, Michigan, Indiana, Wisconsin |
| vps-5 | Southeast & Florida | Florida, Georgia, NC, SC, Tennessee |

## Setup New VPS

### Automated Setup

```bash
chmod +x setup_vps.sh
./setup_vps.sh --vps-id vps-1 --api-secret "YOUR_SECRET" --proxy "user:pass@host:port"
```

### Manual Setup

1. Install dependencies:
```bash
sudo apt update && sudo apt install -y python3 python3-pip python3-venv
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
```

2. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. Configure environment:
```bash
export INTERNAL_API_SECRET="your-api-secret"
```

4. Run scraper:
```bash
python run_with_coordinator.py --vps-id vps-1 --proxy "user:pass@host:port"
```

## Running as a Service

The setup script creates a systemd service for auto-restart:

```bash
# Start the service
sudo systemctl start fb-scraper

# Enable auto-start on boot
sudo systemctl enable fb-scraper

# Check status
sudo systemctl status fb-scraper

# View logs
journalctl -u fb-scraper -f
```

## Coordinator API

The coordinator manages job assignments and tracking:

### Get Job
```bash
curl -X POST https://www.autohunterpro.com/api/scraper/get-job \
  -H "Content-Type: application/json" \
  -H "x-api-secret: YOUR_SECRET" \
  -d '{"vpsId": "vps-1"}'
```

### Report Status
```bash
curl -X POST https://www.autohunterpro.com/api/scraper/report-status \
  -H "Content-Type: application/json" \
  -H "x-api-secret: YOUR_SECRET" \
  -d '{
    "vpsId": "vps-1",
    "jobId": "vps-1_los-angeles",
    "status": "completed",
    "listingsFound": 150,
    "newListingsAdded": 120,
    "duplicatesSkipped": 30,
    "scrapeDuration": 300
  }'
```

### Health Check
```bash
curl https://www.autohunterpro.com/api/scraper/health \
  -H "x-api-secret: YOUR_SECRET"
```

## Configuration Files

### config/cities.json
Contains 350 cities organized by region and state.

### config/vps_config.json
VPS assignment configuration:
- Which states each VPS handles
- Proxy pool configuration
- Default scraper settings

## Proxy Configuration

Proxies are configured in `config/vps_config.json`:

```json
{
  "proxy_pool": {
    "proxies": [
      "user:pass@host:10001",
      "user:pass@host:10002",
      ...
    ]
  }
}
```

Or pass directly via command line:
```bash
python run_with_coordinator.py --vps-id vps-1 --proxy "user:pass@host:port"
```

## Monitoring

### Firestore Collections

- `vehicles_initial` - Scraped vehicle listings
- `scraper_jobs` - Job assignments and status
- `scraper_logs` - Scraper activity logs

### Metrics Available

- Total listings found per city/VPS
- New vs duplicate listings
- Scrape duration
- Error rates
- Last activity timestamps

## Optimization Settings

The scraper is optimized for maximum coverage:

| Setting | Value | Description |
|---------|-------|-------------|
| max_scrolls | 50 | Scrolls per city (5x increase) |
| threshold | 500 | Max listings per city |
| break_interval | 15 profiles | Time between breaks |
| break_duration | 2 minutes | Break length (was 5 min) |
| cooldown | 4 hours | Time before re-scraping city |

## Reducing VPS Count

With the coordinator system, you can reduce from 20 VPS to 5-7:

1. Each VPS handles multiple states efficiently
2. No duplicate work between VPS instances
3. Smart cooldowns prevent unnecessary re-scraping
4. Higher scroll count means more listings per visit

### Recommended Setup

| VPS Count | Coverage | Cost |
|-----------|----------|------|
| 5 VPS | Full US (30 states) | $25/month |
| 7 VPS | Full US + redundancy | $35/month |
| 10 VPS | Full US + faster cycles | $50/month |

## Troubleshooting

### No jobs available
- All cities are on 4-hour cooldown
- Wait or check `scraper_jobs` collection

### Proxy issues
- Test proxy: `python -c "from index import test_proxy; test_proxy('user:pass@host:port')"`
- Ensure correct format: `username:password@host:port`

### Browser crashes
- Check Chrome version matches ChromeDriver
- Increase restart interval if memory issues

### Authentication errors
- Verify INTERNAL_API_SECRET is set correctly
- Check API endpoint is accessible

## Files Overview

```
facebook-scrape/
├── index.py                 # Main scraper class
├── run_with_coordinator.py  # Coordinator-integrated runner
├── coordinator_client.py    # API client for coordinator
├── generate_input.py        # Static CSV generator
├── setup_vps.sh            # VPS setup script
├── requirements.txt         # Python dependencies
├── config/
│   ├── cities.json         # 350 cities by region/state
│   └── vps_config.json     # VPS assignments and settings
└── serviceAccountKey.json   # Firebase credentials (DO NOT COMMIT)
```
