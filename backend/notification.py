from flask import Flask, jsonify
from pymongo import MongoClient
from bson import ObjectId
from flask_cors import CORS
from config import MONGODB_CONNECTION_STRING
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['MONGO_URI'] = str(MONGODB_CONNECTION_STRING)
mongo_client = MongoClient(app.config['MONGO_URI'])
db = mongo_client.Agribulletin

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
    app.run()
