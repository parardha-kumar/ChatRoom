from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, disconnect
from pymongo import MongoClient
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

room_id = "chat-room"

messages = []

last_id = 123

# MongoDB setup
mongo_uri = "mongodb://localhost:27017/"  # Replace with your MongoDB URI
client = MongoClient(mongo_uri)
db = client['chat_db']  # Replace 'chat_db' with your database name
messages_collection = db.messages  # Replace 'messages' with your collection name

def save_message(data):
    messages_collection.insert_one(data)

def fetch_messages():
    messages = list(messages_collection.find({}, {'_id': 0}))  # Fetch all messages excluding the '_id' field
    return messages

@socketio.on('connect')
def handle_connect():
    messages = fetch_messages()
    socketio.emit('initial_messages', {'messages': messages})

@socketio.on('create_room')
def handle_create_room(request=None):
    print("Creating New Room")
    join_room(room_id)
    messages = fetch_messages()
    socketio.emit('msg_recvd', {'messages': messages},include_self=True)
    return {'code': json.dumps(0),
            'message': "Socket Connection Successful"}

@socketio.on('message')
def handle_message(data):
    print("New Message")
    print(data)
    global last_id
    new_message = {"id": last_id + 1, "text": data['msg'], "upvotes": 0, "downvotes": 0, "voted": []}
    last_id += 1
    save_message(new_message)
    updated_messages = fetch_messages()
    socketio.emit('msg_recvd', {'messages': updated_messages})

@socketio.on('upvote')
def handle_upvote(data):
    print("Upvote data received:", data)
    message_id = data['message_id']
    user_id = request.sid  # Using the socket ID as a unique identifier for the user

    # Update the message in the database
    _ = messages_collection.find_one_and_update(
        {"id": message_id, "voted": {"$ne": user_id}},
        {"$inc": {"upvotes": 1}, "$push": {"voted": user_id}},
        return_document=True
    )

    updated_messages = fetch_messages()
    socketio.emit('update_message', {'message': updated_messages}, include_self=True)

    # message = next((m for m in messages if m['id'] == data['message_id']), None)
    # if message:
    #     message['upvotes'] += 1
    #     emit('update_message', {'messages': messages}, broadcast=True)

@socketio.on('downvote')
def handle_downvote(data):
    message_id = data['message_id']
    user_id = request.sid

    # Update the message in the database
    _ = messages_collection.find_one_and_update(
        {"id": message_id, "voted": {"$ne": user_id}},
        {"$inc": {"downvotes": 1}, "$push": {"voted": user_id}},
        return_document=True
    )

    updated_messages = fetch_messages()
    socketio.emit('update_message', {'message': updated_messages}, include_self=True)


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
