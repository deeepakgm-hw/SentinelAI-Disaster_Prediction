import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv(r"c:\Users\Aishu\OneDrive\Desktop\disasterguardd\disasterguardd\backend\.env")

account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
client = Client(account_sid, auth_token)

message = client.messages('SM42daaa0b6a5c7fe7d31711ba14edb8ea').fetch()

print(f"Status: {message.status}")
print(f"Error Code: {message.error_code}")
print(f"Error Message: {message.error_message}")
