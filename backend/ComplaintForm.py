# from flask import Flask, request, jsonify
# from pymongo import MongoClient
# from flask_cors import CORS

# app = Flask(__name__)
# cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

# # Connect to MongoDB
# client = MongoClient('mongodb://localhost:27017')
# db = client['Agribulletin']
# complaints_collection = db['complaints']

# @app.route('/api/complaints', methods=['POST'])
# def save_complaint():
#     try:
#         complaint_data = request.get_json()
#         result = complaints_collection.insert_one(complaint_data)
#         if result.inserted_id:
#             return jsonify({'message': 'Complaint saved successfully'})
#         else:
#             return jsonify({'error': 'Failed to save complaint'}), 500
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from config import MONGODB_CONNECTION_STRING

app = Flask(__name__)
app.config['MONGO_URI'] = MONGODB_CONNECTION_STRING
mongo = PyMongo(app)
CORS(app)

@app.route('/api/complaints', methods=['POST'])
def save_complaint():
    try:
        complaint_data = request.json
        mongo.db.complaints.insert_one(complaint_data)
        return jsonify({'message': 'Complaint saved successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
