from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from config import MONGODB_CONNECTION_STRING

app = Flask(__name__)
CORS(app)
client = MongoClient(str(MONGODB_CONNECTION_STRING))
db = client.Agribulletin

# Fetch all complaints from the database


if __name__ == '__main__':
    app.run(debug=True)
