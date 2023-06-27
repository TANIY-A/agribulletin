from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
client = MongoClient('mongodb://localhost:27017/')
db = client.Agribulletin

# Fetch all complaints from the database
@app.route('/api/complaints', methods=['GET'])
def get_complaints():
    try:
        complaints = list(db.complaints.find({}, {'_id': 0}))
        return jsonify(complaints)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
