from bs4 import BeautifulSoup
from seleniumbase import Driver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.common.exceptions import StaleElementReferenceException, TimeoutException, NoSuchElementException, InvalidSessionIdException, WebDriverException
import re

# Add Firestore imports
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

import os
import time
import random
import json
import requests
import sys
import csv
import datetime
import traceback
import glob
import shutil
import argparse
import threading


VEHICLE_MAKES = [
    "acura", "alfa romeo", "aston martin", "audi", "bentley", "bmw", "buick", "cadillac", 
    "chevrolet", "chrysler", "citroën", "dodge", "ferrari", "fiat", "ford", "genesis", 
    "gmc", "honda", "hyundai", "infiniti", "jaguar", "jeep", "kia", "lamborghini", 
    "land rover", "lexus", "lincoln", "maserati", "mazda", "mclaren", "mercedes-benz", 
    "mini", "mitsubishi", "nissan", "peugeot", "porsche", "ram", "renault", "rolls-royce", 
    "saab", "subaru", "suzuki", "tesla", "toyota", "volkswagen", "volvo",
    "aprilia", "arctic cat", "can-am", "ducati", "harley-davidson", "honda motorcycles", 
    "indian", "kawasaki", "ktm", "polaris", "royal enfield", "suzuki motorcycles", 
    "triumph", "vespa", "yamaha", "freightliner", "hino", "international", "kenworth", 
    "mack", "peterbilt", "volvo trucks", "western star", "freightliner", "isuzu"
]

PRODUCT_TITLE_XPATH = '//div[@aria-hidden="false"]/h1'
PRODUCT_PRICE_XPATH = '//div[@aria-hidden="false"]/span'
PRODUCT_DESCRIPTION_XPATH = '//div[@aria-hidden="false"]/span'
PRODUCT_IMAGE_XPATH = "//img[contains(@alt, 'Product photo of')]"

MILEAGE = "background-position: -21px -63px;"
FUEL_TYPE_AND_TRANSMISSION = "background-position: -42px -63px;"
INTERIOR_EXTERIOR_COLOR = "background-position: -84px -21px;"
CONSUMPTION = "background-position: -84px -63px;"
DEBT = "background-position: -84px -63px;"
TITLE = "background-position: -84px -105px;"
OWNERS = 'background-position: -21px -181px;'
PAID_OFF = 'background-position: 0px 0px;'
CLEAN_TITLE = 'background-position: -63px -105px;'

abs_path = os.path.abspath(__file__)
dir_path = os.path.dirname(abs_path)


def generate_random_profile():
    """Generate a random profile name like 'user_a3f9k2m8'"""
    import string
    chars = string.ascii_lowercase + string.digits
    random_suffix = ''.join(random.choice(chars) for _ in range(8))
    return f"user_{random_suffix}"


def get_or_create_profile():
    """Get existing profile name from file or create a new random one"""
    profile_file = os.path.join(dir_path, "profile_name.txt")

    # Try to read existing profile name
    if os.path.exists(profile_file):
        try:
            with open(profile_file, 'r') as f:
                profile_name = f.read().strip()
                if profile_name:  # Make sure it's not empty
                    print(f"INFO: Using existing profile: {profile_name}")
                    return profile_name
        except Exception as e:
            print(f"WARNING: Could not read profile file: {str(e)}")

    # Generate new random profile name
    profile_name = generate_random_profile()

    # Save it for future runs
    try:
        with open(profile_file, 'w') as f:
            f.write(profile_name)
        print(f"INFO: Generated new random profile: {profile_name}")
    except Exception as e:
        print(f"WARNING: Could not save profile name: {str(e)}")

    return profile_name


def test_proxy(proxy_string):
    """Test if the proxy is working by making a test request"""
    print(f"\n{'='*60}")
    print(f"TESTING PROXY: {proxy_string}")
    print(f"{'='*60}")

    try:
        # Parse proxy string (format: username:password@host:port)
        if '@' in proxy_string:
            auth_part, server_part = proxy_string.split('@')
            username, password = auth_part.split(':')
            host, port = server_part.split(':')

            # Format for requests library
            proxy_url = f"http://{username}:{password}@{host}:{port}"
        else:
            # No authentication
            proxy_url = f"http://{proxy_string}"

        proxies = {
            'http': proxy_url,
            'https': proxy_url
        }

        print(f"INFO: Testing proxy connection...")

        # Make a test request to a reliable endpoint
        response = requests.get(
            'http://httpbin.org/ip',
            proxies=proxies,
            timeout=10
        )

        if response.status_code == 200:
            ip_data = response.json()
            print(f"✓ SUCCESS: Proxy is working!")
            print(f"✓ Your IP through proxy: {ip_data.get('origin', 'Unknown')}")
            print(f"{'='*60}\n")
            return True
        else:
            print(f"✗ FAILED: Proxy returned status code {response.status_code}")
            print(f"{'='*60}\n")
            return False

    except requests.exceptions.ProxyError as e:
        print(f"✗ FAILED: Proxy connection error - {str(e)}")
        print(f"✗ The proxy might be down or credentials are incorrect")
        print(f"{'='*60}\n")
        return False
    except requests.exceptions.Timeout as e:
        print(f"✗ FAILED: Proxy connection timeout - {str(e)}")
        print(f"✗ The proxy is taking too long to respond")
        print(f"{'='*60}\n")
        return False
    except Exception as e:
        print(f"✗ FAILED: Error testing proxy - {str(e)}")
        print(f"{'='*60}\n")
        return False


class fbm_scraper():
    def scrap_link(self, link):
        """Simple scraping method that gets publication and profile data"""
        publication_id = link.split("/")[5]
        
        try:
            self.browser.get(link)
            time.sleep(3)
            
            # Store original URL for comparison
            original_url = self.browser.current_url
            
            # Get the full publication page text
# --- PART A: Click the first "See more" if present (optional) ---

            try:
                see_more_xpath = ("//span[normalize-space(.)='See more']/ancestor::div[@role='button'][1] "
                                "| //span[normalize-space(.)='See more']/ancestor::div[1][@role='button']")
                see_more_el = None
                try:
                    see_more_el = WebDriverWait(self.browser, 3).until(
                        EC.presence_of_element_located((By.XPATH, see_more_xpath))
                    )
                    try:
                        see_more_el.click()
                    except Exception:
                        self.browser.execute_script("arguments[0].click();", see_more_el)
                    self.print_and_log("INFO: Clicked 'See more'")
                except TimeoutException:
                    pass
            except Exception as e:
                self.print_and_log(f"WARNING: Unexpected error clicking 'See more': {str(e)}")
            # --- PART A end ---

            try:
                publication_text = self.browser.find_element(By.TAG_NAME, "body").text
                self.print_and_log(f"INFO: Captured {len(publication_text)} characters from publication page")
            except Exception as e:
                self.print_and_log(f"WARNING: Could not capture publication text for {publication_id}: {str(e)}")
                publication_text = ""
            
            # Navigate to seller profile and get text
            dealership_text = ""
            profile_navigation_success = False
            
            try:
                # Try to find and click profile link
                profile_element = None
                profile_xpaths = [
                    "//a[contains(@href, '/marketplace/profile')]",
                    "//a[contains(@href, '/profile.php')]",
                    "//a[contains(@href, '/user/')]",
                    "//a[contains(@aria-label, 'profile')]",
                    "//span[contains(text(), 'Seller information')]/following::a[1]"
                ]
                
                # First try to find profile link without scrolling
                for xpath in profile_xpaths:
                    try:
                        profile_element = self.browser.find_element(By.XPATH, xpath)
                        if profile_element:
                            self.print_and_log(f"INFO: Found profile element using xpath: {xpath}")
                            break
                    except:
                        continue
                
                # If not found, scroll down and try again
                if not profile_element:
                    self.print_and_log(f"INFO: Profile link not visible, scrolling down to find it...")
                    # Scroll down in increments to find profile link
                    for scroll_attempt in range(3):
                        self.browser.execute_script("window.scrollBy(0, 500);")
                        time.sleep(1)
                        
                        for xpath in profile_xpaths:
                            try:
                                profile_element = self.browser.find_element(By.XPATH, xpath)
                                if profile_element:
                                    self.print_and_log(f"INFO: Found profile element after scrolling using xpath: {xpath}")
                                    break
                            except:
                                continue
                        
                        if profile_element:
                            break
                
                if profile_element:
                    # Click the profile link
                    self.print_and_log(f"INFO: Clicking profile link for {publication_id}")
                    self.browser.execute_script("arguments[0].click();", profile_element)
                    
                    # Wait for navigation
                    max_wait_attempts = 10
                    for attempt in range(max_wait_attempts):
                        time.sleep(1)
                        current_url = self.browser.current_url
                        
                        # Check if we successfully navigated to profile
                        profile_indicators = [
                            "/marketplace/profile/",
                            "/profile.php",
                            "/user/",
                            "profile_id=",
                            "id=" in current_url and current_url != original_url
                        ]
                        
                        if any(indicator in current_url or indicator for indicator in profile_indicators):
                            profile_navigation_success = True
                            self.print_and_log(f"SUCCESS: Navigated to profile page: {current_url}")
                            break
                        elif attempt == max_wait_attempts - 1:
                            self.print_and_log(f"WARNING: Failed to navigate to profile after {max_wait_attempts} attempts")
                            break
                    
                    if profile_navigation_success:
                        # Additional wait for profile page to fully load
                        time.sleep(2)
                        
                        # Get the full profile page text
                        try:
                            dealership_text = self.browser.find_element(By.TAG_NAME, "body").text
                            self.print_and_log(f"SUCCESS: Captured {len(dealership_text)} characters from profile page")
                            
                        except Exception as e:
                            self.print_and_log(f"ERROR: Could not capture profile text: {str(e)}")
                            dealership_text = ""
                            profile_navigation_success = False
                    
                else:
                    self.print_and_log(f"WARNING: Could not find profile link for {publication_id}")
                    
            except Exception as e:
                self.print_and_log(f"ERROR: Error accessing profile for {publication_id}: {str(e)}")
            word = "Today's picks"
            index = publication_text.find(word)
            if index != -1:
                publication_text = publication_text[:index]
           
           
            word = "buy and sell groups"
            index = publication_text.find(word)

            if index != -1:
                # Keep only the part AFTER the word
                publication_text = publication_text[index + len(word):].strip()
            
            word = "Joined Facebook"
            index = dealership_text.rfind(word) # Changed from .find() to .rfind()

            if index != -1:
                # Keep only the part AFTER the last occurrence of the word
                dealership_text = dealership_text[index + len(word):].strip()
                    
            # Create data structure
            data = {
                "publication_id": int(publication_id),
                "publicationText": publication_text,
                "dealershipBody": dealership_text,
                "profileNavigationSuccess": profile_navigation_success,
                "images": [],
                "scraped_at": firestore.SERVER_TIMESTAMP,
                "city_code": self.city_code,
                "userId": "r1LfHSvzLZUkLVbrQGov1BAPvh02",
                "publication_link": f"https://www.facebook.com/marketplace/item/{publication_id}/"
            }
            
            # Scrape images if profile navigation was successful
            if profile_navigation_success:
                try:
                    # Navigate back to publication page for image scraping
                    self.browser.get(link)
                    time.sleep(2)
                    image_urls = self.scrap_images(publication_id, download_images=self.download_images)
                    data["images"] = image_urls
                except Exception as e:
                    self.print_and_log(f"WARNING: Error scraping images for {publication_id}: {str(e)}")
            
            self.print_and_log(f"INFO: Successfully processed publication {publication_id}")
            return data
            
        except Exception as e:
            self.print_and_log(f"ERROR: Critical error scraping {publication_id}: {str(e)}")
            return None

    def upload_to_firestore(self, product_id, publication):
        """Upload text data and images to Firestore with deduplication check"""
        if not self.db:
            self.print_and_log("ERROR: Firestore not initialized")
            return False

        try:
            # Convert product_id to string if it's not already
            doc_id = str(product_id)

            # Check if document already exists (deduplication)
            doc_ref = self.db.collection('vehicles_initial').document(doc_id)
            existing_doc = doc_ref.get()

            if existing_doc.exists:
                self.print_and_log(f"SKIP: Publication {doc_id} already exists in Firestore, skipping duplicate")
                return True  # Return True since this isn't an error, just a skip

            # Upload to Firestore vehicles_initial collection
            doc_ref.set(publication)

            image_count = len(publication.get('images', []))
            self.print_and_log(f"SUCCESS: Uploaded text data and {image_count} images for publication {doc_id} to Firestore")
            return True

        except Exception as e:
            self.print_and_log(f"ERROR: Failed to upload to Firestore: {str(e)}")
            return False

    def scrap_images(self, publication_id, download_images=False):
        """Scrape images with error handling"""
        try:
            image_elements = self.browser.find_elements(By.XPATH, PRODUCT_IMAGE_XPATH)
            if not os.path.exists(f"{dir_path}/images/{publication_id}"):
                os.makedirs(f"{dir_path}/images/{publication_id}")
        
            image_counts = 0
            image_urls = []
            for image_element in image_elements:
                try:
                    image_url = image_element.get_attribute("src")
                    if "https://scontent" in image_url:
                        if image_counts >= 3:
                            break
                        
                        if download_images:
                            try:
                                r = requests.get(image_url, stream=True, timeout=10)
                                if r.status_code == 200:
                                    with open(f"{dir_path}/images/{publication_id}/{publication_id}_{image_counts}.png", 'wb') as f:
                                        for chunk in r:
                                            f.write(chunk)
                            except Exception as img_error:
                                self.print_and_log(f"WARNING: Failed to download image {image_counts} for {publication_id}: {str(img_error)}")
                                continue

                        image_urls.append(image_url)
                        image_counts += 1
                except Exception as e:
                    self.print_and_log(f"WARNING: Error processing image element for {publication_id}: {str(e)}")
                    continue

            return image_urls
        except Exception as e:
            self.print_and_log(f"WARNING: Failed to scrape images for {publication_id}: {str(e)}")
            return []

    def random_activity_during_break(self):
        """Perform random Facebook activity to avoid detection"""
        try:
            activities = [
                self.scroll_newsfeed,
                self.visit_profile_page,
                self.check_notifications,
                self.browse_marketplace_randomly
            ]
            
            # Do 2-3 random activities during the break
            for _ in range(random.randint(2, 3)):
                activity = random.choice(activities)
                self.print_and_log(f"INFO: Performing random activity: {activity.__name__}")
                activity()
                time.sleep(random.randint(30, 90))  # Random delay between activities
                
        except Exception as e:
            self.print_and_log(f"WARNING: Error during random activity: {str(e)}")

    def scroll_newsfeed(self):
        """Scroll through Facebook newsfeed"""
        try:
            self.browser.get("https://www.facebook.com")
            time.sleep(3)
            for _ in range(random.randint(3, 6)):
                self.browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(random.randint(2, 5))
        except Exception as e:
            self.print_and_log(f"WARNING: Error scrolling newsfeed: {str(e)}")

    def visit_profile_page(self):
        """Visit own profile page"""
        try:
            self.browser.get("https://www.facebook.com/me")
            time.sleep(random.randint(3, 7))
        except Exception as e:
            self.print_and_log(f"WARNING: Error visiting profile: {str(e)}")

    def check_notifications(self):
        """Check notifications"""
        try:
            self.browser.get("https://www.facebook.com/notifications")
            time.sleep(random.randint(2, 5))
        except Exception as e:
            self.print_and_log(f"WARNING: Error checking notifications: {str(e)}")

    def browse_marketplace_randomly(self):
        """Browse marketplace categories randomly"""
        try:
            categories = ["electronics", "furniture", "clothing", "books", "home"]
            category = random.choice(categories)
            self.browser.get(f"https://www.facebook.com/marketplace/category/{category}")
            time.sleep(random.randint(3, 6))
            
            # Random scroll on marketplace
            for _ in range(random.randint(2, 4)):
                self.browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(random.randint(1, 3))
        except Exception as e:
            self.print_and_log(f"WARNING: Error browsing marketplace: {str(e)}")

    def update_account_settings(self, city_code, email, password):
        """Update scraper settings for new account without creating new browser"""
        self.city_code = city_code
        self.email = email
        self.password = password
        self.url_to_scrap = f"https://www.facebook.com/marketplace/{city_code}/vehicles?sortBy=creation_time_descend&exact=true"
        self.links = {}  # Reset links for new account
        self.successful_scrapes = 0
        self.failed_scrapes = 0
        self.print_and_log(f"INFO: Updated settings for {email} in city {city_code}")

    def cleanup_old_profiles(self, max_age_hours=24):
        """Clean up profile directories older than max_age_hours"""
        try:
            current_time = time.time()
            pattern = f"./profiles/{self.original_profile}_*"
            
            cleaned_count = 0
            for profile_dir in glob.glob(pattern):
                try:
                    # Extract timestamp from directory name
                    parts = profile_dir.split('_')
                    if len(parts) >= 3:  # profile_timestamp_pid
                        timestamp_str = parts[-2]  # Get timestamp part
                        dir_timestamp = int(timestamp_str)
                        
                        # If older than max_age_hours, remove it
                        if (current_time - dir_timestamp) > (max_age_hours * 3600):
                            shutil.rmtree(profile_dir)
                            self.print_and_log(f"INFO: Cleaned up old profile: {profile_dir}")
                            cleaned_count += 1
                except (ValueError, IndexError, OSError) as e:
                    self.print_and_log(f"WARNING: Could not clean profile {profile_dir}: {str(e)}")
                    continue
            
            if cleaned_count > 0:
                self.print_and_log(f"INFO: Cleaned up {cleaned_count} old profiles")
            
        except Exception as e:
            self.print_and_log(f"WARNING: Error during profile cleanup: {str(e)}")

    def print_and_log(self, message):
        """Print message to console and log to file"""
        current_time_ts = round(time.time())
        human_readable_time = datetime.datetime.utcfromtimestamp(current_time_ts).strftime('%Y-%m-%d %H:%M:%S')
        
        # Print to console
        print(f"[{human_readable_time}] {message}")
        
        # Log to file
        try:
            with open("scraper.log", "a", encoding="utf-8") as f:
                f.write(f"[{human_readable_time}] {message}\n")
        except Exception as e:
            print(f"WARNING: Could not write to log file: {str(e)}")
    
    def init_firestore(self):
        """Initialize Firestore database connection"""
        try:
            # Check if Firebase app is already initialized
            if not firebase_admin._apps:
                # Use environment variable for credentials
                if os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'):
                    cred = credentials.ApplicationDefault()
                else:
                    # Use service account key file
                    cred = credentials.Certificate("serviceAccountKey.json")
            
                firebase_admin.initialize_app(cred)
        
            # Initialize Firestore client
            self.db = firestore.client()
            self.print_and_log("INFO: Firestore initialized successfully.")
        
        except Exception as e:
            self.print_and_log(f"ERROR: Failed to initialize Firestore: {str(e)}")
            self.db = None

    def go_to_marketplace(self, city_code):
        """Navigate directly to marketplace without login"""
        try:
            self.print_and_log(f"INFO: Navigating directly to marketplace for city {city_code}")

            # Navigate directly to marketplace URL
            marketplace_url = f"https://www.facebook.com/marketplace/{city_code}/vehicles?sortBy=creation_time_descend&exact=true"
            self.browser.get(marketplace_url)
            time.sleep(3)

            # Check if we successfully loaded marketplace
            current_url = self.browser.current_url
            if "marketplace" in current_url:
                self.print_and_log("SUCCESS: Successfully navigated to marketplace")
                return True
            else:
                self.print_and_log("WARNING: May not have loaded marketplace correctly")
                return False

        except (InvalidSessionIdException, WebDriverException) as e:
            error_message = str(e)
            if "invalid session id" in error_message.lower():
                current_time_ts = round(time.time())
                human_readable_time = datetime.datetime.utcfromtimestamp(current_time_ts).strftime('%Y-%m-%d %H:%M:%S')
                self.print_and_log(f"CRITICAL ERROR: Browser session died at {human_readable_time}")
                self.print_and_log(f"CRITICAL ERROR: Invalid session ID detected. Browser is dead.")
                self.print_and_log(f"CRITICAL ERROR: Stopping script now.")
                sys.exit(1)
            else:
                self.print_and_log(f"ERROR: Failed to navigate to marketplace: {str(e)}")
                return False
        except Exception as e:
            self.print_and_log(f"ERROR: Failed to navigate to marketplace: {str(e)}")
            return False
    
    def execute_scrap_process(self):
        """Execute the main scraping process"""
        try:
            self.print_and_log(f"INFO: Starting scraping process for {self.city_code}")
            
            # Navigate to marketplace directly (no login required)
            success = self.go_to_marketplace(self.city_code)
            if not success:
                self.print_and_log(f"ERROR: Failed to navigate to marketplace for {self.city_code}")
                return
            
            # Scroll and collect links
            self.collect_vehicle_links()
            
            self.print_and_log(f"INFO: Collected {len(self.links)} vehicle links")
            
        except Exception as e:
            self.print_and_log(f"ERROR: Failed to execute scraping process: {str(e)}")
    
    def collect_vehicle_links(self):
        """Collect vehicle links from marketplace"""
        try:
            scroll_count = 0
            max_scrolls = 50  # Increased from 10 to get 5x more listings

            while scroll_count < max_scrolls and len(self.links) < self.threshold:
                # Scroll down
                self.browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)
                
                # Find vehicle links
                vehicle_links = self.browser.find_elements(By.XPATH, "//a[contains(@href, '/marketplace/item/')]")
                
                for link in vehicle_links:
                    try:
                        href = link.get_attribute("href")
                        if href and "/marketplace/item/" in href:
                            product_id = href.split("/")[-2] if href.endswith("/") else href.split("/")[-1]
                            if product_id not in self.links:
                                self.links[product_id] = href
                                
                                if len(self.links) >= self.threshold:
                                    break
                    except Exception as e:
                        continue
                
                scroll_count += 1
                self.print_and_log(f"INFO: Scroll {scroll_count}, collected {len(self.links)} links")
                
        except Exception as e:
            self.print_and_log(f"ERROR: Failed to collect vehicle links: {str(e)}")
    
    def __init__(self, city_code, profile, proxy, threshold=100, headless=False, download_images=False, block_images=True, restart_interval_minutes=180):
        # Initialize Firestore first
        self.init_firestore()

        # Set up attributes (no longer need unique profiles since we're reusing browser)
        self.threshold = threshold
        self.download_images = download_images
        self.city_code = city_code
        self.successful_scrapes = 0
        self.failed_scrapes = 0
        self.met_threshold = False
        self.current_profile = profile
        self.original_profile = profile
        self.proxy = proxy
        self.restart_interval_minutes = restart_interval_minutes
        self.browser_start_time = time.time()
        self.restart_timer = None

        # Store credentials (though not needed for marketplace access)
        self.email = None
        self.password = None

        # Initialize browser only if it doesn't exist
        if not hasattr(self, 'browser') or self.browser is None:
            self.init_browser(profile, proxy, headless, block_images)
        
        # Start browser restart timer
        self.start_restart_timer()

        # Initialize other attributes
        self.checkpoint = []
        self.links = {}
        self.url_to_scrap = f"https://www.facebook.com/marketplace/{city_code}/vehicles?sortBy=creation_time_descend&exact=true"
        
        self.print_and_log(f"{self.city_code} INFO: Starting the scrape of city code with profile: {profile}")
    
    def init_browser(self, profile, proxy, headless, block_images):
        """Initialize browser with proxy support"""
        try:
            # Build Chrome arguments
            chrome_args = "--disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-renderer-backgrounding --disable-features=TranslateUI --disable-ipc-flooding-protection --no-sandbox --disable-dev-shm-usage --disable-extensions --disable-plugins --aggressive-cache-discard --memory-pressure-off --max_old_space_size=4096 --disable-background-networking --disable-background-sync --disable-add-to-shelf --disable-client-side-phishing-detection --disable-datasaver-prompt --disable-default-apps --disable-desktop-notifications --disable-domain-reliability --disable-features=VizDisplayCompositor --disable-hang-monitor --disable-prompt-on-repost --disable-sync --disable-translate --metrics-recording-only --no-first-run --safebrowsing-disable-auto-update --disable-component-update"
            
            # Add proxy arguments if proxy is provided
            if proxy and proxy.strip():
                if '@' in proxy:
                    # Format: username:password@host:port
                    auth_part, server_part = proxy.split('@')
                    username, password = auth_part.split(':')
                    host, port = server_part.split(':')
                    
                    # Add proxy server argument
                    chrome_args += f" --proxy-server=http://{host}:{port}"
                    
                    self.print_and_log(f"INFO: Browser will use proxy: {host}:{port} with authentication")
                else:
                    # Format: host:port (no authentication)
                    chrome_args += f" --proxy-server=http://{proxy}"
                    self.print_and_log(f"INFO: Browser will use proxy: {proxy} (no authentication)")
            else:
                self.print_and_log("INFO: No proxy configured for browser")
            
            self.browser = Driver(
                browser="chrome",
                user_data_dir=f"./profiles/{profile}",
                window_size="1440,900",
                block_images=block_images,
                headless=headless,
                agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                disable_csp=True,
                disable_js=False,
                chromium_arg=chrome_args
            )
            
            # If proxy has authentication, handle it via Chrome extension or other method
            if proxy and '@' in proxy:
                self.setup_proxy_auth(proxy)
            
            self.print_and_log("SUCCESS: Browser initialized successfully")
            
        except Exception as e:
            self.print_and_log(f"ERROR: Failed to initialize browser: {str(e)}")
            self.print_and_log("Retrying browser initialization...")
            # Retry once
            time.sleep(2)
            
            chrome_args = "--disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-renderer-backgrounding --disable-features=TranslateUI --disable-ipc-flooding-protection --no-sandbox --disable-dev-shm-usage --disable-extensions --disable-plugins --aggressive-cache-discard --memory-pressure-off --max_old_space_size=4096 --disable-background-networking --disable-background-sync --disable-add-to-shelf --disable-client-side-phishing-detection --disable-datasaver-prompt --disable-default-apps --disable-desktop-notifications --disable-domain-reliability --disable-features=VizDisplayCompositor --disable-hang-monitor --disable-prompt-on-repost --disable-sync --disable-translate --metrics-recording-only --no-first-run --safebrowsing-disable-auto-update --disable-component-update"
            
            if proxy and proxy.strip():
                if '@' in proxy:
                    auth_part, server_part = proxy.split('@')
                    host, port = server_part.split(':')
                    chrome_args += f" --proxy-server=http://{host}:{port}"
                else:
                    chrome_args += f" --proxy-server=http://{proxy}"
            
            self.browser = Driver(
                browser="chrome",
                user_data_dir=f"./profiles/{profile}",
                window_size="1440,900",
                block_images=block_images,
                headless=headless,
                agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                chromium_arg=chrome_args
            )
            
            if proxy and '@' in proxy:
                self.setup_proxy_auth(proxy)
    
    def setup_proxy_auth(self, proxy):
        """Setup proxy authentication by navigating to a test page and handling auth popup"""
        try:
            auth_part, server_part = proxy.split('@')
            username, password = auth_part.split(':')
            
            self.print_and_log(f"INFO: Setting up proxy authentication for user: {username}")
            
            # Try to navigate to a simple page to trigger proxy auth
            self.browser.get("http://httpbin.org/ip")
            time.sleep(3)
            
            # Check if we can see the response (indicates successful auth)
            try:
                page_text = self.browser.find_element(By.TAG_NAME, "body").text
                if "origin" in page_text.lower():
                    self.print_and_log("SUCCESS: Proxy authentication appears to be working")
                else:
                    self.print_and_log("WARNING: Proxy authentication status unclear")
            except Exception:
                self.print_and_log("WARNING: Could not verify proxy authentication status")
                
        except Exception as e:
            self.print_and_log(f"WARNING: Error setting up proxy authentication: {str(e)}")
    
    def start_restart_timer(self):
        """Start timer for browser restart"""
        if self.restart_timer:
            self.restart_timer.cancel()
        
        restart_seconds = self.restart_interval_minutes * 60
        self.print_and_log(f"INFO: Browser will restart in {self.restart_interval_minutes} minutes ({restart_seconds} seconds)")
        
        self.restart_timer = threading.Timer(restart_seconds, self.restart_browser)
        self.restart_timer.daemon = True
        self.restart_timer.start()
    
    def restart_browser(self):
        """Restart the browser and resume operation"""
        try:
            self.print_and_log(f"INFO: Browser restart triggered after {self.restart_interval_minutes} minutes")
            
            # Store current state
            current_url = None
            try:
                current_url = self.browser.current_url
                self.print_and_log(f"INFO: Current URL before restart: {current_url}")
            except Exception:
                pass
            
            # Close current browser
            try:
                self.browser.quit()
                self.print_and_log("INFO: Browser closed successfully")
            except Exception as e:
                self.print_and_log(f"WARNING: Error closing browser: {str(e)}")
            
            # Wait a moment
            time.sleep(3)
            
            # Reinitialize browser with same settings
            self.print_and_log("INFO: Reinitializing browser...")
            self.init_browser(self.current_profile, self.proxy, False, True)  # headless=False, block_images=True
            
            # Update start time
            self.browser_start_time = time.time()
            
            # Resume at marketplace if we were there
            if current_url and "marketplace" in current_url:
                try:
                    self.print_and_log("INFO: Resuming at marketplace...")
                    self.go_to_marketplace(self.city_code)
                except Exception as e:
                    self.print_and_log(f"WARNING: Error resuming at marketplace: {str(e)}")
            
            # Start next restart timer
            self.start_restart_timer()
            
            self.print_and_log("SUCCESS: Browser restart completed successfully")
            
        except Exception as e:
            self.print_and_log(f"ERROR: Critical error during browser restart: {str(e)}")
            self.print_and_log("CRITICAL: Script may need manual intervention")
    
    def update_restart_interval(self, new_interval_minutes):
        """Update the restart interval and reset timer"""
        self.restart_interval_minutes = new_interval_minutes
        self.print_and_log(f"INFO: Browser restart interval updated to {new_interval_minutes} minutes")
        self.start_restart_timer()


# Main execution loop - reuse the same browser
if __name__ == "__main__":
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description='Facebook Marketplace Scraper')
    parser.add_argument('--proxy', type=str, help='Proxy in format: username:password@host:port (e.g., sptnbq06y8:70Gw3nPqraNL3v_duv@isp.decodo.com:10002)')
    parser.add_argument('--restart-interval', type=int, default=180, help='Browser restart interval in minutes (default: 180 minutes = 3 hours)')
    parser.add_argument('--allow-images', action='store_true', help='Allow images to load in browser (default: images are blocked)')
    args = parser.parse_args()

    # Store CLI proxy if provided and strip any quotes
    cli_proxy = args.proxy.strip('\'"') if args.proxy else None
    restart_interval = args.restart_interval
    
    if cli_proxy:
        print(f"INFO: Using proxy from command-line: {cli_proxy}")

        # Test the proxy before proceeding
        if not test_proxy(cli_proxy):
            print("WARNING: Proxy test failed. Proceeding anyway, but you may encounter issues.")
            response = input("Do you want to continue? (y/n): ").lower()
            if response != 'y':
                print("Exiting...")
                sys.exit(1)
    
    print(f"INFO: Browser restart interval set to {restart_interval} minutes")

    headless = False  # Set to True for headless mode (no GUI)
    save_html = False

    # Handle image loading setting
    block_images = not args.allow_images  # If allow_images is True, block_images should be False
    if args.allow_images:
        print("INFO: Images will be loaded in browser")
    else:
        print("INFO: Images will be blocked for faster performance")

    # Create browser instance once and reuse it
    worker = None
    
    while True:
        with open(f"{dir_path}/input.csv", "r") as f:
            reader = csv.reader(f)
            lines = list(reader)

        if not os.path.exists(f"{dir_path}/publications"):
            os.makedirs(f"{dir_path}/publications")

        count = 1
        for line in lines:
            try:
                email, password, city_code, threshold, proxy, change_language = line
            except:
                current_time_ts = round(time.time())
                human_readable_time = datetime.datetime.utcfromtimestamp(current_time_ts).strftime('%Y-%m-%d %H:%M:%S')
                with open("errors.log", "a") as f:
                    f.write(f"[{human_readable_time}] ERROR: Could not get any data from input.csv in line {count}.\n")
                count += 1
                continue
            count += 1
            threshold = int(threshold.strip())
            city_code = city_code.strip()
            email = email.strip()
            profile = get_or_create_profile()  # Use random profile instead of email-based
            change_language = bool(change_language.capitalize())

            # Use CLI proxy if provided, otherwise use CSV proxy
            active_proxy = cli_proxy if cli_proxy else proxy
            print(f"INFO: Active proxy for this session: {active_proxy if active_proxy else 'None'}")

            # Create worker only if it doesn't exist (reuse browser)
            if worker is None:
                print(f"INFO: Creating new browser instance for first account")
                worker = fbm_scraper(city_code, profile, active_proxy, threshold, headless, block_images=block_images, restart_interval_minutes=restart_interval)
            else:
                # Update settings for new account but keep same browser
                print(f"INFO: Reusing browser for {email}")
                worker.update_account_settings(city_code, email, password)
                # Update restart interval if it changed
                if worker.restart_interval_minutes != restart_interval:
                    worker.update_restart_interval(restart_interval)
            
            # No login required - go directly to marketplace
            worker.execute_scrap_process()

            # Track statistics and profile counter
            profile_counter = 0

            for product_id, link in worker.links.items():
                try:
                    # Scrape publication and profile data
                    publication = worker.scrap_link(link)    
                    
                    if publication is None:
                        worker.print_and_log(f"ERROR: Failed to scrape publication {product_id}, skipping...")
                        worker.failed_scrapes += 1
                        continue
                    
                    # Upload all data to Firebase without any verification
                    success = worker.upload_to_firestore(publication["publication_id"], publication)
                    
                    if success:
                        worker.successful_scrapes += 1
                        profile_counter += 1
                        worker.print_and_log(f"SUCCESS: Processed publication {product_id} (Profile #{profile_counter})")
                    else:
                        worker.failed_scrapes += 1
                        worker.print_and_log(f"ERROR: Failed to upload publication {product_id}")
                    
                    # Take 2-minute break with random activity every 15 profiles (optimized from 5min/10 profiles)
                    if profile_counter % 15 == 0 and profile_counter > 0:
                        worker.print_and_log(f"INFO: Processed {profile_counter} profiles. Taking 2-minute break with random activity...")

                        # Split the break into smaller chunks with activity
                        break_chunks = 2  # Split 2 minutes into 2 chunks
                        chunk_time = 60 // break_chunks  # 30 seconds per chunk

                        for chunk in range(break_chunks):
                            worker.print_and_log(f"INFO: Break chunk {chunk + 1}/{break_chunks} - doing random activity...")
                            worker.random_activity_during_break()
                            time.sleep(chunk_time)

                        worker.print_and_log(f"INFO: Break complete. Resuming scraping...")
                    
                    time.sleep(0.5)
                    
                except Exception as e:
                    worker.print_and_log(f"ERROR: Unexpected error processing publication {product_id}: {str(e)}")
                    worker.print_and_log(f"Full traceback: {traceback.format_exc()}")
                    worker.failed_scrapes += 1
                    continue
            
            # Print final statistics for this account
            total_processed = worker.successful_scrapes + worker.failed_scrapes
            success_rate = (worker.successful_scrapes / total_processed * 100) if total_processed > 0 else 0
            worker.print_and_log(f"SUMMARY for {email}: Processed {total_processed} publications")
            worker.print_and_log(f"SUMMARY: {worker.successful_scrapes} successful, {worker.failed_scrapes} failed")
            worker.print_and_log(f"SUMMARY: Success rate: {success_rate:.2f}%")
            
            # Reset counters for next account (but keep browser open)
            worker.successful_scrapes = 0
            worker.failed_scrapes = 0
        
        # Do NOT close browser at end of CSV cycle - reuse it for next cycle
        print("INFO: Finished processing all accounts in CSV. Starting next cycle with same browser...")
        time.sleep(5)  # Brief pause before next cycle