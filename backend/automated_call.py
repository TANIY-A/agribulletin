from twilio.rest import Client
from pymongo import MongoClient
from config import MONGODB_CONNECTION_STRING

# Twilio account SID and auth token
account_sid = "AC7d5a5d71ed13a751651041264ed05e08"
auth_token = "a23ca706595fb7c7b5ed252cb042c1ce"

# Twilio phone number
twilio_number = "+919207828545"  # Replace with your Twilio phone number

# Create a Twilio client
client = Client(account_sid, auth_token)

# Connect to MongoDB
mongo_client = MongoClient(MONGODB_CONNECTION_STRING)
db = mongo_client['Agribulletin']
users_collection = db['users']

# Fetch the recipient's number from the database
recipient_number = users_collection.find_one()['phone_number']

# Make a call
call = client.calls.create(
    twiml='<Response><Say voice="alice">New Notification has arrived</Say></Response>',
    to=recipient_number,
    from_=twilio_number
)

# Print the call SID
print(call.sid)
