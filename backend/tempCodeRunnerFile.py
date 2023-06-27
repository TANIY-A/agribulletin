from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from config import MONGODB_CONNECTION_STRING

app = Flask(__name__)
app.config['MONGO_URI'] = str(MONGODB_CONNECTION_STRING)
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
