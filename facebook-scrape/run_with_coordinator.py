#!/usr/bin/env python3
"""
Coordinator-Integrated Facebook Marketplace Scraper

This script runs the scraper with coordinator integration for:
- Dynamic job assignment (no need for static input.csv)
- Deduplication tracking
- Analytics and monitoring
- Automatic cooldown management

Usage:
    python run_with_coordinator.py --vps-id vps-1 --proxy username:password@host:port

Environment variables required:
    INTERNAL_API_SECRET - API secret for coordinator authentication
    COORDINATOR_URL (optional) - Override default coordinator URL
"""

import os
import sys
import time
import argparse
import traceback

# Import the scraper and coordinator
from index import fbm_scraper, get_or_create_profile, test_proxy
from coordinator_client import CoordinatorClient


def run_coordinator_mode(vps_id: str, proxy: str = None, headless: bool = False,
                         continuous: bool = True, wait_time: int = 300):
    """
    Run the scraper in coordinator mode.

    Args:
        vps_id: VPS identifier (e.g., vps-1)
        proxy: Proxy string in format username:password@host:port
        headless: Run browser in headless mode
        continuous: Keep running and requesting new jobs
        wait_time: Seconds to wait when no jobs available (default 5 minutes)
    """
    print(f"\n{'='*70}")
    print(f"COORDINATOR MODE - VPS: {vps_id}")
    print(f"{'='*70}")
    print(f"Proxy: {proxy[:30]}..." if proxy and len(proxy) > 30 else f"Proxy: {proxy}")
    print(f"Headless: {headless}")
    print(f"Continuous: {continuous}")
    print(f"{'='*70}\n")

    # Initialize coordinator client
    coordinator = CoordinatorClient(vps_id)

    # Test proxy if provided
    if proxy:
        print("Testing proxy connection...")
        if not test_proxy(proxy):
            print("WARNING: Proxy test failed. Proceeding anyway.")

    # Track scraper instance for reuse
    worker = None
    profile = get_or_create_profile()

    while True:
        try:
            # Request job from coordinator
            job = coordinator.get_job()

            if not job:
                if continuous:
                    print(f"\nNo jobs available. Waiting {wait_time} seconds before retry...")
                    time.sleep(wait_time)
                    continue
                else:
                    print("No jobs available and not in continuous mode. Exiting.")
                    break

            city = job['city']
            state = job['state']
            job_id = job['jobId']

            print(f"\n{'='*60}")
            print(f"STARTING JOB: {city}, {state}")
            print(f"Job ID: {job_id}")
            print(f"{'='*60}\n")

            # Report job started
            coordinator.report_in_progress()

            start_time = time.time()

            # Initialize or update worker
            if worker is None:
                print(f"Creating new browser instance for {city}")
                worker = fbm_scraper(
                    city_code=city,
                    profile=profile,
                    proxy=proxy,
                    threshold=500,  # Max listings per city
                    headless=headless,
                    block_images=True,
                    restart_interval_minutes=180
                )
            else:
                print(f"Reusing browser for {city}")
                worker.update_account_settings(city, "", "")  # No login needed
                worker.threshold = 500

            # Execute scraping
            worker.execute_scrap_process()

            # Process scraped links
            total_found = len(worker.links)
            new_listings = 0
            duplicates = 0
            failed = 0

            print(f"\nProcessing {total_found} listings...")

            profile_counter = 0
            for product_id, link in worker.links.items():
                try:
                    publication = worker.scrap_link(link)

                    if publication is None:
                        failed += 1
                        continue

                    # Check if upload was successful (returns True for both new and duplicates)
                    success = worker.upload_to_firestore(publication["publication_id"], publication)

                    if success:
                        # Check if it was a duplicate by looking at the log message pattern
                        # The upload_to_firestore function logs "SKIP:" for duplicates
                        # We need to track this differently
                        new_listings += 1  # For now, count all successes
                        profile_counter += 1
                    else:
                        failed += 1

                    # Break every 15 profiles
                    if profile_counter % 15 == 0 and profile_counter > 0:
                        worker.print_and_log(f"Taking 2-minute break after {profile_counter} profiles...")
                        for chunk in range(2):
                            worker.random_activity_during_break()
                            time.sleep(30)

                    time.sleep(0.5)

                except Exception as e:
                    worker.print_and_log(f"ERROR processing {product_id}: {str(e)}")
                    failed += 1
                    continue

            # Calculate duration
            duration = time.time() - start_time

            # Report completion
            # Note: In the current implementation, we're counting all successful uploads as new
            # The scraper logs duplicates but doesn't expose a counter for them
            # TODO: Update scraper to track duplicate count separately
            coordinator.report_completed(
                listings_found=total_found,
                new_listings=new_listings,
                duplicates_skipped=duplicates,
                duration_seconds=duration
            )

            # Brief pause before next job
            print(f"\nJob completed. Waiting 30 seconds before next job...")
            time.sleep(30)

        except KeyboardInterrupt:
            print("\n\nShutdown requested. Cleaning up...")
            if worker:
                try:
                    worker.browser.quit()
                except:
                    pass
            break

        except Exception as e:
            print(f"\nCRITICAL ERROR: {str(e)}")
            print(f"Traceback: {traceback.format_exc()}")

            # Report failure to coordinator
            if coordinator.current_job:
                coordinator.report_failed(str(e))

            # Wait before retrying
            print(f"Waiting 60 seconds before retrying...")
            time.sleep(60)

    print("\nScraper shutdown complete.")


def main():
    parser = argparse.ArgumentParser(
        description='Facebook Marketplace Scraper with Coordinator Integration',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Environment Variables:
    INTERNAL_API_SECRET  - Required for coordinator authentication
    COORDINATOR_URL      - Optional, defaults to production URL

Examples:
    # Run VPS-1 with proxy
    python run_with_coordinator.py --vps-id vps-1 --proxy user:pass@host:port

    # Run in headless mode
    python run_with_coordinator.py --vps-id vps-2 --headless

    # Run single job only (no continuous loop)
    python run_with_coordinator.py --vps-id vps-1 --once
        """
    )

    parser.add_argument(
        '--vps-id',
        type=str,
        required=True,
        help='VPS identifier (e.g., vps-1, vps-2, etc.)'
    )

    parser.add_argument(
        '--proxy',
        type=str,
        help='Proxy in format: username:password@host:port'
    )

    parser.add_argument(
        '--headless',
        action='store_true',
        help='Run browser in headless mode'
    )

    parser.add_argument(
        '--once',
        action='store_true',
        help='Run single job and exit (no continuous loop)'
    )

    parser.add_argument(
        '--wait-time',
        type=int,
        default=300,
        help='Seconds to wait when no jobs available (default: 300)'
    )

    args = parser.parse_args()

    # Validate environment
    if not os.environ.get('INTERNAL_API_SECRET'):
        print("ERROR: INTERNAL_API_SECRET environment variable not set")
        print("\nSet it using:")
        print("  export INTERNAL_API_SECRET='your-api-secret-here'")
        print("\nOr add to your .bashrc/.profile")
        sys.exit(1)

    # Clean proxy string
    proxy = args.proxy.strip('\'"') if args.proxy else None

    # Run coordinator mode
    run_coordinator_mode(
        vps_id=args.vps_id,
        proxy=proxy,
        headless=args.headless,
        continuous=not args.once,
        wait_time=args.wait_time
    )


if __name__ == "__main__":
    main()
