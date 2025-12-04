#!/usr/bin/env python3
"""
Coordinator Client for Facebook Marketplace Scraper

This module handles communication with the AutoHunterPro coordinator API
for job assignment and status reporting.
"""

import os
import requests
import json
from typing import Optional, Dict, Any

# Configuration
COORDINATOR_BASE_URL = os.environ.get(
    'COORDINATOR_URL',
    'https://autohunter-2iqlxn8os-hbaselabdelfa-7414s-projects.vercel.app/api/scraper'
)
API_SECRET = os.environ.get('INTERNAL_API_SECRET', '')


class CoordinatorClient:
    """Client for communicating with the scraper coordinator API"""

    def __init__(self, vps_id: str, api_secret: Optional[str] = None):
        self.vps_id = vps_id
        self.api_secret = api_secret or API_SECRET
        self.base_url = COORDINATOR_BASE_URL
        self.current_job = None

        if not self.api_secret:
            print("WARNING: No API secret configured. Set INTERNAL_API_SECRET environment variable.")

    def _make_request(self, endpoint: str, method: str = 'POST', data: Optional[Dict] = None) -> Dict[str, Any]:
        """Make a request to the coordinator API"""
        url = f"{self.base_url}/{endpoint}"
        headers = {
            'Content-Type': 'application/json',
            'x-api-secret': self.api_secret
        }

        try:
            if method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            else:
                response = requests.get(url, headers=headers, timeout=30)

            response.raise_for_status()
            return response.json()

        except requests.exceptions.RequestException as e:
            print(f"ERROR: Coordinator request failed: {e}")
            return {'error': str(e), 'success': False}

    def get_job(self) -> Optional[Dict[str, Any]]:
        """
        Request a job from the coordinator.

        Returns:
            Job details including city and state, or None if no jobs available
        """
        print(f"\n{'='*60}")
        print(f"Requesting job from coordinator for VPS: {self.vps_id}")
        print(f"{'='*60}")

        result = self._make_request('get-job', 'POST', {'vpsId': self.vps_id})

        if result.get('success') and result.get('job'):
            self.current_job = result['job']
            job = result['job']
            print(f"JOB ASSIGNED:")
            print(f"  City: {job.get('city')}")
            print(f"  State: {job.get('state')}")
            print(f"  Job ID: {job.get('jobId')}")
            print(f"  Is New: {job.get('isNewJob', False)}")
            return job
        elif result.get('success') and result.get('job') is None:
            print(f"No jobs available: {result.get('message', 'All cities on cooldown')}")
            return None
        else:
            print(f"ERROR getting job: {result.get('error', 'Unknown error')}")
            return None

    def report_in_progress(self) -> bool:
        """Report that scraping has started for current job"""
        if not self.current_job:
            print("WARNING: No current job to report progress for")
            return False

        result = self._make_request('report-status', 'POST', {
            'vpsId': self.vps_id,
            'jobId': self.current_job['jobId'],
            'status': 'in_progress'
        })

        if result.get('success'):
            print(f"Reported IN_PROGRESS for job {self.current_job['jobId']}")
            return True

        print(f"ERROR reporting in_progress: {result.get('error')}")
        return False

    def report_completed(self, listings_found: int, new_listings: int, duplicates_skipped: int, duration_seconds: float) -> bool:
        """
        Report successful job completion.

        Args:
            listings_found: Total listings scraped
            new_listings: New listings added to Firestore
            duplicates_skipped: Duplicate listings skipped
            duration_seconds: How long the scrape took
        """
        if not self.current_job:
            print("WARNING: No current job to report completion for")
            return False

        result = self._make_request('report-status', 'POST', {
            'vpsId': self.vps_id,
            'jobId': self.current_job['jobId'],
            'status': 'completed',
            'listingsFound': listings_found,
            'newListingsAdded': new_listings,
            'duplicatesSkipped': duplicates_skipped,
            'scrapeDuration': int(duration_seconds)
        })

        if result.get('success'):
            print(f"\n{'='*60}")
            print(f"JOB COMPLETED: {self.current_job['city']}, {self.current_job['state']}")
            print(f"  Listings found: {listings_found}")
            print(f"  New listings: {new_listings}")
            print(f"  Duplicates skipped: {duplicates_skipped}")
            print(f"  Duration: {int(duration_seconds)}s")
            print(f"{'='*60}\n")
            self.current_job = None
            return True

        print(f"ERROR reporting completed: {result.get('error')}")
        return False

    def report_failed(self, error_message: str) -> bool:
        """Report job failure"""
        if not self.current_job:
            print("WARNING: No current job to report failure for")
            return False

        result = self._make_request('report-status', 'POST', {
            'vpsId': self.vps_id,
            'jobId': self.current_job['jobId'],
            'status': 'failed',
            'errorMessage': error_message
        })

        if result.get('success'):
            print(f"Reported FAILED for job {self.current_job['jobId']}: {error_message}")
            self.current_job = None
            return True

        print(f"ERROR reporting failure: {result.get('error')}")
        return False

    def check_health(self) -> Dict[str, Any]:
        """Check coordinator health and get stats"""
        return self._make_request('health', 'GET')


def main():
    """Test the coordinator client"""
    import argparse

    parser = argparse.ArgumentParser(description='Test Coordinator Client')
    parser.add_argument('--vps-id', type=str, required=True, help='VPS ID (e.g., vps-1)')
    parser.add_argument('--action', type=str, default='get-job',
                        choices=['get-job', 'health', 'test-cycle'],
                        help='Action to perform')
    args = parser.parse_args()

    client = CoordinatorClient(args.vps_id)

    if args.action == 'get-job':
        job = client.get_job()
        if job:
            print(f"\nReceived job: {json.dumps(job, indent=2)}")
        else:
            print("\nNo job available")

    elif args.action == 'health':
        health = client.check_health()
        print(f"\nHealth check: {json.dumps(health, indent=2)}")

    elif args.action == 'test-cycle':
        # Test a full job cycle
        job = client.get_job()
        if job:
            client.report_in_progress()
            print("\nSimulating scraping...")
            import time
            time.sleep(2)
            client.report_completed(
                listings_found=50,
                new_listings=30,
                duplicates_skipped=20,
                duration_seconds=120
            )


if __name__ == "__main__":
    main()
