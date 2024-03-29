from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, disconnect
import json

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

# Dummy user data - Replace with database in production
users = {"user1": "pass123", "user2": "pass123", "user3": "pass123"}

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    if username in users:
        return jsonify({'error': 'Username already exists'}), 400

    users[username] = password
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    if username not in users or users[username] != password:
        return jsonify({'error': 'Invalid credentials'}), 401

    return jsonify({'message': 'Logged in successfully'}), 200

room_id = "chat-room"

messages = [
    {"id": 1, "text": "Hello, this is a test server message!", "upvotes": 0, "downvotes": 0},
    {"id": 2, "text": "Another example sercer message here.", "upvotes": 0, "downvotes": 0}
]

@socketio.on('create_room')
def handle_create_room(request=None):
    print("Creating New Room")
    join_room(room_id)
    socketio.emit('msg_recvd', {'messages': messages},include_self=True)
    return {'code': json.dumps(0),
            'message': "Socket Connection Successful"}

@socketio.on('message')
def handle_message(data):
    print("New Message")
    print(data)
    new_message = {"id": len(messages) + 1, "text": data['msg'], "upvotes": 0, "downvotes": 0}
    messages.append(new_message)
    emit('msg_recvd', {'messages': messages}, broadcast=True)

@socketio.on('upvote')
def handle_upvote(data):
    message = next((m for m in messages if m['id'] == data['message_id']), None)
    if message:
        message['upvotes'] += 1
        emit('update_message', {'messages': messages}, broadcast=True)

@socketio.on('downvote')
def handle_downvote(data):
    message = next((m for m in messages if m['id'] == data['message_id']), None)
    if message:
        message['downvotes'] += 1
        emit('update_message', {'messages': messages}, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
