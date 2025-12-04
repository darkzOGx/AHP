from twilio.rest import Client
import os
import datetime
import getpass

# Twilio configuration
TWILIO_ACCOUNT_SID = 'AC2a7d2ab39979e1badc8f81200577abb3'
TWILIO_AUTH_TOKEN = '0a4be615e77896e892cfbcb0f90a45c0'
TWILIO_PHONE_NUMBER = '+18556223617'
ALERT_PHONE_NUMBERS = ['+16823062220', '+8801531939037']

def send_error_alert(context, error_message):
    """Send SMS alert via Twilio when an error occurs"""
    try:
        # Check if Twilio credentials are configured
        if not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER]):
            print(f"WARNING: Twilio credentials not configured. Skipping SMS alert.")
            return False

        # Initialize Twilio client
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

        # Get Windows username
        username = getpass.getuser()

        # Format the error message
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        message_body = f"[AutoHunter Error Alert]\n\nUser: {username}\nTime: {timestamp}\nContext: {context}\nError: {error_message[:150]}"

        # Send SMS to all numbers
        sent_count = 0
        for phone_number in ALERT_PHONE_NUMBERS:
            try:
                message = client.messages.create(
                    body=message_body,
                    from_=TWILIO_PHONE_NUMBER,
                    to=phone_number
                )
                print(f"INFO: SMS alert sent to {phone_number}. SID: {message.sid}")
                sent_count += 1
            except Exception as send_error:
                print(f"WARNING: Failed to send SMS to {phone_number}: {str(send_error)}")
                continue  # Ensure loop continues even if one number fails

        return sent_count > 0

    except Exception as e:
        print(f"WARNING: Failed to send Twilio SMS alert: {str(e)}")
        return False
