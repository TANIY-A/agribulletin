from bson import ObjectId
from flask import Flask, request, jsonify
from flask_cors import CORS
# from flask_pymongo import PyMongo
# from pymongo import MongoClient
from twilio.rest import Client
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from automated_call import NotificationAll

from config import MONGODB_CONNECTION_STRING
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId


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
user_collection=db['users']

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
    # check if user exists and password is correct
    user_data = db['login'].find_one({'user': email})
    if user_data['user'] == email and user_data['password'] == password:
        access_token = create_access_token(identity=email)
        response = jsonify({'success': True, 'access_token': access_token})
        response.headers.add('Access-Control-Allow-Origin', '*')  # Allow all origins
        return response, 200
    else:
        response = jsonify({'success': False, 'error': 'Invalid email or password'})
        response.headers.add('Access-Control-Allow-Origin', '*')  # Allow all origins
        return response, 401
    


# Save notification
@app.route('/api/save-notification', methods=['POST'])
def save_notification():
    message_text = request.json.get('messageText')
    scheme_name = request.json.get('schemeNameNotification')

    notification_coll.insert_one({'message': message_text, 'scheme_name': scheme_name})
    return jsonify({'message': 'Notification saved and SMS sent successfully' + message_text + scheme_name})
# automated call and sms

@app.route('/api/send-notification', methods=['POST'])
def send_notification():
    # Call the NotificationAll function
    NotificationAll()
    return jsonify({'message': 'Automated call and message sent successfully'})
# Notification view Function
@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    try:
        notifications = list(db.notifications.find())
        for notification in notifications:
            notification['_id'] = str(notification['_id'])
        return jsonify(notifications), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
   
# scheme submit
@app.route('/api/submit-scheme', methods=['POST'])
def submit_scheme():
    scheme_Name = request.json.get('schemename')
    scheme_Description = request.json.get('description')
    scheme_Category = request.json.get('category')
    scheme_Type = request.json.get('type')
    scheme_coll.insert_one({'schemename': scheme_Name,
'description': scheme_Description,
'category': scheme_Category,
'type': scheme_Type,})
    return jsonify({'message': 'Scheme submitted successfully'})



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
        complaints = list(db['complaints'].find())

        for complaint in complaints:
            complaint['_id'] = str(complaint['_id'])

        return jsonify(complaints)
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500
@app.route('/api/complaintList/<complaint_id>', methods=['DELETE'])
def remove_complaint(complaint_id):
    try:
        result = db['complaints'].delete_one({'_id': ObjectId(complaint_id)})
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
    data = request.get_json('newMember')
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
    user_collection.insert_one(member)

    return jsonify({'success': True}), 200 


@app.route('/api/memberview', methods=['GET'])
def get_members():
    members = db.users.find()
    member_list = []
    for member in members:
        member_data = {
            '_id': str(member['_id']),
            'name': member['name'],
            'phoneNumber': member['phoneNumber'],
            'email': member['email'],
            'address': member['address']
        }
        member_list.append(member_data)
    return jsonify(member_list)

@app.route('/api/memberDelete/<member_id>', methods=['DELETE'])
def delete_member(member_id):
    # print(member_id)
    members_collection = db.users
    result = members_collection.delete_one({'_id': ObjectId(member_id)})
    if result.deleted_count == 1:
            return jsonify({'message': 'Member deleted successfully'}), 204
    else:
            return jsonify({'error': 'Member not found'}), 404

@app.route('/api/schemes', methods=['GET'])
def get_schemes():
    title = request.args.get('title')
    category = request.args.get('category')
    type = request.args.get('type')

    filter_query = {}
    if title:
        filter_query['title'] = {'$regex': title, '$options': 'i'}
    if category:
        filter_query['category'] = category
    if type:
        filter_query['type'] = type

    schemes = db['schemes'].find(filter_query)
    scheme_list = []
    for scheme in schemes:
        scheme_list.append({
            '_id': str(scheme['_id']),
            'title': scheme['title']
        })
    return jsonify(scheme_list)


@app.route('/api/schemes/<id>', methods=['GET'])
def get_scheme_by_id(id):
    scheme = db['schemes'].find_one({'_id': ObjectId(id)})
    print(scheme)
    scheme_details = {
        '_id': str(scheme['_id']),
        'title': scheme['title'],
        'details': scheme['details']
    }
    return jsonify(scheme_details)

if __name__ == '__main__':
    app.run(debug=True)
