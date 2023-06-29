from flask import Flask, request, jsonify
from flask_cors import CORS
# from flask_pymongo import PyMongo
# from pymongo import MongoClient
from twilio.rest import Client
from flask_jwt_extended import JWTManager, create_access_token, jwt_required

from config import MONGODB_CONNECTION_STRING

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi



app = Flask(__name__)
# app.config['MONGO_URI'] = "mongodb+srv://admin:<password>@cluster0.xlj6ew8.mongodb.net/?retryWrites=true&w=majority"
# mongo = PyMongo(app)

app.config['JWT_SECRET_KEY'] = 'mysecretkey123'
jwt = JWTManager(app)

# Create a new client and connect to the server
client = MongoClient(MONGODB_CONNECTION_STRING, server_api=ServerApi('1'))


CORS(app)

# Connect to MongoDB
# client = MongoClient('mongodb://localhost:27017/')
database_name = 'Agribulletin'
db = client[database_name]
notification_coll = db['notifications']
scheme_coll = db['schemes']
complaints_collection = db['complaints']

# Twilio account SID and auth token
account_sid = "AC7d5a5d71ed13a751651041264ed05e08"
auth_token = "a23ca706595fb7c7b5ed252cb042c1ce"
twilio_number = "+919745064634"  # Replace with your Twilio phone number

# Create a Twilio client
twilio_client = Client(account_sid, auth_token)



# route for generating JWT token
@app.route('/api/token', methods=['POST'])
def generate_token():
    email = request.json.get('email')
    password = request.json.get('password')
    
    # print(email)
    # print(password)

    # print(type(email))
    # print(type(password))


    # check if user exists and password is correct
    user_data = db['login'].find_one({'user': email})
    # print(user_data)
    # print(user_data['user'] == email)
    # print(type(user_data['user']))
    


    if user_data['user'] == email and user_data['password'] == password:
        access_token = create_access_token(identity=email)
        response = jsonify({'success': True, 'access_token': access_token})
        response.headers.add('Access-Control-Allow-Origin', '*')  # Allow all origins
        return response, 200
    else:
        response = jsonify({'success': False, 'error': 'Invalid email or password'})
        response.headers.add('Access-Control-Allow-Origin', '*')  # Allow all origins
        return response, 401
    



@app.route('/api/save-notification', methods=['POST'])
def save_notification():
    message_text = request.json.get('messageText')
    # Store the messageText in MongoDB collection
    # notification_coll.insert_one({'message': message_text})

    # # Send SMS notification to recipient
    # recipient_number = '+919207828545'  # Replace with recipient's phone number
    # message_body = f'New notification: {message_text}'
    # twilio_client.messages.create(
    #     body=message_body,
    #     from_=twilio_number,
    #     to=recipient_number
    # )

    return jsonify({'message': 'Notification saved and SMS sent successfully' + message_text})


# @app.route('/api/notifications', methods=['GET'])
# def get_notifications():
#     notifications = list(notification_coll.find())
#     formatted_notifications = [
#         {
#             'id': str(notification['_id']),
#             'title': notification['title'],
#             'text': notification['text'],
#             'date': notification['date']
#         }
#         for notification in notifications
#     ]
#     return jsonify(formatted_notifications)

# Notification Function
@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    try:
        notifications = list(db.notifications.find())
        for notification in notifications:
            notification['_id'] = str(notification['_id'])
        return jsonify(notifications), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
   


@app.route('/api/submit-scheme', methods=['POST'])
def submit_scheme():
    file = request.files['file']
    scheme_coll.insert_one({'file': file.read()})
    return jsonify({'message': 'Scheme submitted successfully'})



@app.route('/api/complaints', methods=['POST'])
def save_complaint():
    try:
        complaint_data = request.get_json()
        result = complaints_collection.insert_one(complaint_data)
        if result.inserted_id:
            return jsonify({'message': 'Complaint saved successfully'})
        else:
            return jsonify({'error': 'Failed to save complaint'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
# ComplaintList function 
@app.route('/api/complaintList', methods=['GET'])
def get_complaints():
    try:
        complaints = list(db['complaints'].find({}))
        return jsonify(complaints)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/api/complaintList/<complaint_id>', methods=['DELETE'])
def remove_complaint(complaint_id):
    try:
        result = db['complaints'].delete_one({'id': complaint_id})
        if result.deleted_count > 0:
            print(f"Complaint with id {complaint_id} removed successfully")
            return jsonify({'success': True, 'message': 'Complaint removed successfully'})
        else:
            print(f"Complaint with id {complaint_id} not found")
            return jsonify({'success': False, 'message': 'Complaint not found'})
    except Exception as e:
        print(f"Error removing complaint with id {complaint_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500






#Add Members function
@app.route('/api/add_member', methods=['POST'])
def add_member():
    data = request.get_json()
    name = data.get('name')
    phoneNumber = data.get('phoneNumber')
    email = data.get('email')
    address = data.get('address')

    member = {
        'name': name,
        'phoneNumber': phoneNumber,
        'email': email,
        'address': address
    }
    db['users'].insert_one(member)

    return jsonify({'success': True}), 200 


# view members
@app.route('/api/members', methods=['GET'])
def get_members():
    members = list(db.users.find({}, {'_id': 0}))  # Retrieve all members from the 'users' collection
    return jsonify(members), 200




if __name__ == '__main__':
    app.run()
