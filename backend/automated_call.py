# from operator import call
from twilio.rest import Client
from pymongo import MongoClient
from config import MONGODB_CONNECTION_STRING

# Twilio account SID and auth token
account_sid = "AC7d5a5d71ed13a751651041264ed05e08"
auth_token = "a2b6e3a846bfd02470bd6f1ab7c69dca"

# Recipient phone number
recipient_number = "+919207828545"

# Twilio phone number
twilio_number = "+12312374504"  # Replace with your Twilio phone number

mongo_client = MongoClient(MONGODB_CONNECTION_STRING)
db = mongo_client['Agribulletin']


def NotificationAll():
    client = Client(account_sid, auth_token)
    # Connect to MongoDB
    users_collection = db['users']
    # Fetch the recipient's number from the database
    recipient_number = str(users_collection.find_one()['phoneNumber'])
    # Make a call
    call = client.calls.create(
        twiml='<Response><Say voice="alice">New Notification has arrived</Say></Response>',
        to=recipient_number,
        from_=twilio_number
        )
    #Send a message
    message = client.messages.create(
    body='New notification',
    from_='+12312374504',  # sender phone number
    to=recipient_number
        )
    
NotificationAll()
    
# Print the call SID
# print(call.sid)