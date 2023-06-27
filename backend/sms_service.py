from twilio.rest import Client
from pymongo import MongoClient
from config import MONGODB_CONNECTION_STRING

# Twilio account SID and auth token
account_sid = 'AC7d5a5d71ed13a751651041264ed05e08'
auth_token = 'a23ca706595fb7c7b5ed252cb042c1ce'

# Create a Twilio client
client = Client(account_sid, auth_token)

# Connect to MongoDB
mongo_client = MongoClient(MONGODB_CONNECTION_STRING)
db = mongo_client['Agribulletin']
users_collection = db['users']

# Fetch the receiver's number from the database
receiver_number = users_collection.find_one()['phone_number']

# Send a message
message = client.messages.create(
    body='New notification',
    from_='+12312374504',  # sender phone number
    to=receiver_number
)

# Print the message SID
print('Message SID:', message.sid)
