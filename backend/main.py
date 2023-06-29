from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_pymongo import PyMongo
from pymongo import MongoClient
from flask_cors import CORS, cross_origin
from config import MONGODB_CONNECTION_STRING

app = Flask(__name__)
cors = CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['JWT_SECRET_KEY'] = 'mysecretkey123'
jwt = JWTManager(app)

# Connect to MongoDB
client = MongoClient(str(MONGODB_CONNECTION_STRING))
db = client['Agribulletin']
complaints_collection = db['complaints']
users_collection = db['login']
notification_collection = db["notifications"]



# route for generating JWT token
@app.route('/api/token', methods=['POST'])
def generate_token():
    email = request.json.get('user')
    password = request.json.get('password')

    # check if user exists and password is correct
    user = db.login.find_one({'email': email})
    if user and user['password'] == password:
        access_token = create_access_token(identity=email)
        response = jsonify({'success': True, 'access_token': access_token})
        response.headers.add('Access-Control-Allow-Origin', '*')  # Allow all origins
        return response, 200
    else:
        response = jsonify({'success': False, 'error': 'Invalid email or password'})
        response.headers.add('Access-Control-Allow-Origin', '*')  # Allow all origins
        return response, 401
# omplaint form function
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
        complaints = list(db.complaints.find({}, {'_id': 0}))
        return jsonify(complaints)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/api/complaintList/<complaint_id>', methods=['DELETE'])
def remove_complaint(complaint_id):
    try:
        result = db.complaints.delete_one({'id': complaint_id})
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
    db.users.insert_one(member)

    return jsonify({'success': True}), 200 
# view members
@app.route('/api/members', methods=['GET'])
def get_members():
    members = list(db.users.find({}, {'_id': 0}))  # Retrieve all members from the 'users' collection
    return jsonify(members), 200

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
   
if __name__ == '__main__':
    app.run(debug=True)


