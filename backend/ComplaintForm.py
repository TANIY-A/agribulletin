from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from config import MONGODB_CONNECTION_STRING

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Connect to MongoDB
client = MongoClient(str(MONGODB_CONNECTION_STRING))
db = client['Agribulletin']
complaints_collection = db['complaints']

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
    
# @app.route('/api/complaintList', methods=['GET'])
# def get_complaints():
#     try:

#         complaints = list(db.complaints.find({}, {'_id': 0}))
#         return jsonify(complaints)
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)
@app.route('/api/complaintList', methods=['GET'])
def get_complaints():
    try:
        complaints = list(db.complaints.find({}, {'_id': 0}))
        return jsonify(complaints)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
   
if __name__ == '__main__':
    app.run(debug=True)
