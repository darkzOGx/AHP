#!/usr/bin/env python3
"""
VPS Input CSV Generator

This script generates a customized input.csv for each VPS based on its assigned
regions and cities. Run this on each VPS with its VPS ID.

Usage:
    python generate_input.py --vps-id vps-1
    python generate_input.py --vps-id vps-2
    ...etc

Each VPS will only scrape cities in its assigned regions, preventing overlap
and maximizing coverage efficiency.
"""

import json
import csv
import argparse
import os
import sys

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_DIR = os.path.join(SCRIPT_DIR, "config")
CITIES_FILE = os.path.join(CONFIG_DIR, "cities.json")
VPS_CONFIG_FILE = os.path.join(CONFIG_DIR, "vps_config.json")
OUTPUT_FILE = os.path.join(SCRIPT_DIR, "input.csv")


def load_cities():
    """Load cities configuration"""
    with open(CITIES_FILE, "r") as f:
        return json.load(f)


def load_vps_config():
    """Load VPS configuration"""
    with open(VPS_CONFIG_FILE, "r") as f:
        return json.load(f)


def get_cities_for_vps(vps_id, cities_config, vps_config):
    """Get list of cities assigned to this VPS"""
    if vps_id not in vps_config["vps_instances"]:
        print(f"ERROR: VPS ID '{vps_id}' not found in configuration")
        print(f"Available VPS IDs: {list(vps_config['vps_instances'].keys())}")
        sys.exit(1)

    vps_settings = vps_config["vps_instances"][vps_id]

    if not vps_settings.get("enabled", True):
        print(f"WARNING: VPS '{vps_id}' is disabled in configuration")

    assigned_states = vps_settings.get("states", [])
    cities_list = []

    # Collect cities from all regions
    for region_name, region_data in cities_config["regions"].items():
        for state_name, state_cities in region_data["states"].items():
            if state_name in assigned_states:
                for city in state_cities:
                    cities_list.append({
                        "city": city,
                        "state": state_name,
                        "region": region_name
                    })

    return cities_list, vps_settings


def generate_input_csv(vps_id):
    """Generate input.csv for the specified VPS"""
    print(f"\n{'='*60}")
    print(f"Generating input.csv for {vps_id}")
    print(f"{'='*60}\n")

    # Load configurations
    cities_config = load_cities()
    vps_config = load_vps_config()

    # Get cities and settings for this VPS
    cities_list, vps_settings = get_cities_for_vps(vps_id, cities_config, vps_config)

    if not cities_list:
        print("ERROR: No cities found for this VPS configuration")
        sys.exit(1)

    # Get account and proxy settings
    account = vps_settings.get("account", {})
    email = account.get("email", "")
    password = account.get("password", "")

    # Get proxy - either from VPS config or from proxy pool
    proxy = vps_settings.get("proxy", "")
    if proxy.startswith("PROXY_"):
        # Use proxy from pool
        proxy_index = int(proxy.split("_")[1]) - 1
        proxy_pool = vps_config.get("proxy_pool", {}).get("proxies", [])
        if proxy_index < len(proxy_pool):
            proxy = proxy_pool[proxy_index]
        else:
            print(f"WARNING: Proxy index {proxy_index} not found in pool, using empty")
            proxy = ""

    threshold = vps_settings.get("threshold", vps_config["default_settings"]["threshold"])

    # Validate credentials
    if not email or email.startswith("ACCOUNT_"):
        print("WARNING: Email not configured! Update config/vps_config.json")
        print(f"         Current value: {email}")
    if not password or password.startswith("ACCOUNT_"):
        print("WARNING: Password not configured! Update config/vps_config.json")

    # Generate CSV
    print(f"VPS Name: {vps_settings.get('name', vps_id)}")
    print(f"Account: {email}")
    print(f"Proxy: {proxy[:30]}..." if len(proxy) > 30 else f"Proxy: {proxy}")
    print(f"Threshold: {threshold}")
    print(f"Cities to scrape: {len(cities_list)}")
    print(f"\nStates covered:")

    states_summary = {}
    for city_info in cities_list:
        state = city_info["state"]
        if state not in states_summary:
            states_summary[state] = 0
        states_summary[state] += 1

    for state, count in sorted(states_summary.items()):
        print(f"  - {state}: {count} cities")

    # Write CSV
    with open(OUTPUT_FILE, "w", newline="") as f:
        writer = csv.writer(f)
        for city_info in cities_list:
            # Format: email, password, city_code, threshold, proxy, change_language
            writer.writerow([
                email,
                password,
                city_info["city"],
                threshold,
                proxy,
                "true"
            ])

    print(f"\n{'='*60}")
    print(f"SUCCESS: Generated {OUTPUT_FILE}")
    print(f"Total rows: {len(cities_list)}")
    print(f"{'='*60}\n")

    # Print sample rows
    print("Sample rows from generated CSV:")
    with open(OUTPUT_FILE, "r") as f:
        reader = csv.reader(f)
        for i, row in enumerate(reader):
            if i >= 3:
                print("  ...")
                break
            # Mask password for display
            display_row = row.copy()
            if len(display_row) > 1:
                display_row[1] = "********"
            print(f"  {display_row}")


def list_vps_configs():
    """List all available VPS configurations"""
    vps_config = load_vps_config()

    print(f"\n{'='*60}")
    print("Available VPS Configurations")
    print(f"{'='*60}\n")

    for vps_id, settings in vps_config["vps_instances"].items():
        status = "ENABLED" if settings.get("enabled", True) else "DISABLED"
        print(f"{vps_id}: {settings.get('name', 'Unnamed')}")
        print(f"  Status: {status}")
        print(f"  States: {', '.join(settings.get('states', []))}")
        print(f"  Account: {settings.get('account', {}).get('email', 'Not configured')}")
        print()


def main():
    parser = argparse.ArgumentParser(
        description="Generate input.csv for VPS scraper",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python generate_input.py --vps-id vps-1     Generate input.csv for VPS 1
    python generate_input.py --list             List all VPS configurations
        """
    )

    parser.add_argument(
        "--vps-id",
        type=str,
        help="VPS identifier (e.g., vps-1, vps-2, etc.)"
    )

    parser.add_argument(
        "--list",
        action="store_true",
        help="List all available VPS configurations"
    )

    args = parser.parse_args()

    if args.list:
        list_vps_configs()
    elif args.vps_id:
        generate_input_csv(args.vps_id)
    else:
        parser.print_help()
        print("\nERROR: Please specify --vps-id or --list")
        sys.exit(1)


if __name__ == "__main__":
    main()
