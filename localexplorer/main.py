from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from bson.objectid import ObjectId
import datetime

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb+srv://gaozihann:G4oVz8cPgwBY8wsz@cluster0.57j3msm.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0"
app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"  # Change this in production

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

@app.route('/test_mongo_connection', methods=['GET'])
def test_mongo_connection():
    try:
        mongo.db.command('ping')
        return jsonify({'message': 'MongoDB connection successful'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# User registration
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if 'username' in data and 'password' in data:
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user_id = mongo.db.users.insert_one({
            'username': data['username'],
            'password': hashed_password
        }).inserted_id
        print(user_id, "user created!")
        return jsonify({'id': str(user_id)}), 201
    else:
        return jsonify({'error': 'Invalid data'}), 400

# User login
@app.route('/login', methods=['GET'])
def login():
    auth = request.authorization
    if not auth or not auth.username or not auth.password:
        return jsonify({'error': 'Missing credentials'}), 401

    user = mongo.db.users.find_one({'username': auth.username})
    if user and bcrypt.check_password_hash(user['password'], auth.password):
        access_token = create_access_token(identity=auth.username)
        return jsonify({'token': access_token}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# Get user profile
@app.route('/users/<username>', methods=['GET'])
@jwt_required()
def get_user(username):
    current_user = get_jwt_identity()
    if current_user != username:
        return jsonify({'error': 'Unauthorized access'}), 401

    user = mongo.db.users.find_one({'username': username})
    if user:
        return jsonify({
            'username': user['username'],
            'firstName': user.get('firstName', ''),
            'lastName': user.get('lastName', ''),
            'address': user.get('address', ''),
        }), 200
    else:
        return jsonify({'error': 'User not found'}), 404

# Update user profile
@app.route('/users/<username>', methods=['PUT'])
@jwt_required()
def update_user(username):
    current_user = get_jwt_identity()
    if current_user != username:
        return jsonify({'error': 'Unauthorized access'}), 401

    data = request.get_json()
    update_data = {key: value for key, value in data.items() if key in [
        'firstName', 'lastName', 'address'
    ]}
    mongo.db.users.update_one({'username': username}, {'$set': update_data})
    return jsonify({'message': 'User updated successfully'}), 200

# Add a post (post)
@app.route('/activities', methods=['POST'])
@jwt_required()
def add_post():
    data = request.get_json()
    token = get_jwt_identity()
    post_id = mongo.db.activities.insert_one({
        'username': token,
        'subject': data['subject'],
        'content': data['content'],
        'date': data['date'],
        'likes': [],
        'comments': []
    }).inserted_id
    return jsonify({'id': str(post_id)}), 201

# Get all posts
@app.route('/activities', methods=['GET'])
@jwt_required()
def get_posts():
    activities = mongo.db.activities.find()
    result = []
    for activity in activities:
        result.append({
            'id': str(activity['_id']),
            'username': activity['username'],
            'subject': activity['subject'],
            'content': activity['content'],
            'date': activity['date'],
            'likes': activity.get('likes', []),
            'comments': activity.get('comments', [])
        })
    return jsonify(result), 200

# Update a post (post)
@app.route('/activities/<id>', methods=['PUT'])
@jwt_required()
def update_post(id):
    token = get_jwt_identity()
    data = request.get_json()
    update_data = {key: value for key, value in data.items() if key in [
        'subject', 'content'
    ]}
    result = mongo.db.activities.update_one({'_id': ObjectId(id), 'username': token}, {'$set': update_data})
    if result.matched_count > 0:
        return jsonify({'message': 'Post updated successfully'}), 200
    else:
        return jsonify({'error': 'Post not found'}), 404

# Delete an post
@app.route('/activities/<id>', methods=['DELETE'])
@jwt_required()
def delete_post(id):
    token = get_jwt_identity()
    result = mongo.db.activities.delete_one({'_id': ObjectId(id), 'username': token})
    if result.deleted_count > 0:
        return jsonify({'message': 'Post deleted successfully'}), 200
    else:
        return jsonify({'error': 'Post not found'}), 404

# Add a like to a post
@app.route('/activities/<id>/like', methods=['POST'])
@jwt_required()
def add_like(id):
    token = get_jwt_identity()
    activity = mongo.db.activities.find_one({'_id': ObjectId(id)})
    if activity:
        if token not in activity.get('likes', []):
            mongo.db.activities.update_one({'_id': ObjectId(id)}, {'$push': {'likes': token}})
            return jsonify({'message': 'Like added successfully'}), 200
        else:
            return jsonify({'error': 'User already liked this post'}), 400
    else:
        return jsonify({'error': 'Post not found'}), 404

# Add a comment to a post
@app.route('/activities/<id>/comment', methods=['POST'])
@jwt_required()
def add_comment(id):
    token = get_jwt_identity()
    data = request.get_json()
    comment = {
        'username': token,
        'content': data['content'],
        'date': datetime.datetime.utcnow()
    }
    result = mongo.db.activities.update_one({'_id': ObjectId(id)}, {'$push': {'comments': comment}})
    if result.matched_count > 0:
        return jsonify({'message': 'Comment added successfully'}), 200
    else:
        return jsonify({'error': 'Post not found'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)