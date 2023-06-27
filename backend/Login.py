from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from pymongo import MongoClient

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017')
db = client['Agribulletin']
users_collection = db['login']

@app.route("/api/login", methods=["POST"])
@cross_origin()
def login_route():
    username = request.json.get("user")
    password = request.json.get("password")
    
    # Check if the username and password match an existing user
    user = users_collection.find_one({"user": username, "password": password})
    if user:
        return jsonify({"success": True})
    else:
        # Check if the username exists in the database
        existing_user = users_collection.find_one({"user": username})
        if existing_user:
            return jsonify({"success": False, "message": "Invalid password."})
        else:
            return jsonify({"success": False, "message": "Invalid username."})

if __name__ == "__main__":
    app.run(debug=True)