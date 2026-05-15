import os
from twilio.rest import Client
import logging
from twilio.base.exceptions import TwilioRestException
from dotenv import load_dotenv

# Load environment variables explicitly
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def send_sms_alert(phone: str, message: str) -> dict:
    """
    Sends an SMS alert using Twilio.
    """
    try:
        account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        from_phone = os.getenv("TWILIO_PHONE_NUMBER")

        # Validate credentials exist
        if not account_sid or not auth_token or not from_phone:
            error_msg = "Twilio credentials are not fully configured in environment variables."
            logger.error(error_msg)
            return {"success": False, "error": error_msg}

        # Format phone numbers (ensure they have a + sign)
        if not phone.startswith("+"):
            phone = "+" + phone.lstrip("0")
        
        if not from_phone.startswith("+"):
            from_phone = "+" + from_phone.lstrip("0")

        # Initialize client
        logger.info(f"Connecting to Twilio with Account SID: {account_sid[:5]}...")
        client = Client(account_sid, auth_token)
        logger.info("Successfully connected to Twilio API.")

        # Truncate message to prevent multiple SMS segments (Twilio limits to 160 chars, or 70 if unicode)
        # Using a conservative limit of 160 chars. For unicode, this might still be 2-3 segments,
        # but prevents 10+ segments from large payloads.
        if len(message) > 160:
            logger.warning(f"SMS length ({len(message)}) exceeds limit. Truncating.")
            message = message[:157] + "..."

        # Send message
        msg = client.messages.create(
            body=message,
            from_=from_phone,
            to=phone
        )

        logger.info(f"SMS sent successfully to {phone}. SID: {msg.sid}")
        return {
            "success": True,
            "sid": msg.sid,
            "message": "SMS alert sent successfully."
        }

    except TwilioRestException as e:
        if e.code == 21608:
            error_msg = "Twilio Trial Account Limitation: The 'To' phone number is not verified. Please verify it in your Twilio Console."
        else:
            error_msg = f"Twilio API Error: {e.msg}"
        logger.error(f"Twilio API Error sending SMS to {phone}: {error_msg} (Code: {e.code})")
        return {
            "success": False,
            "error": error_msg
        }
    except Exception as e:
        logger.error(f"Failed to send SMS to {phone}: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }
