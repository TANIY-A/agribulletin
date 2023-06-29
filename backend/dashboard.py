from flask import Flask, request, jsonify
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/Agribulletin'  # Replace with your MongoDB URI
mongo = PyMongo(app)

@app.route('/api/add_member', methods=['POST'])
def add_member():
    data = request.get_json()
    name = data.get('name')
    phoneNumber = data.get('phoneNumber')
    email = data.get('email')
    address = data.get('address')

    # Perform validation if required

    # Save the member data to the database
    member = {
        'name': name,
        'phoneNumber': phoneNumber,
        'email': email,
        'address': address
    }
    mongo.db.users.insert_one(member)

    return jsonify({'success': True}), 200

if __name__ == '__main__':
    app.run(debug=True)
