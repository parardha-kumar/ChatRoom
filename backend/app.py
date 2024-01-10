from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, disconnect
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

room_id = "chat-room"

@socketio.on('create_room')
def handle_create_room(request=None):
    print("Creating New Room")
    join_room(room_id)
    socketio.emit('msg_recvd', {'msg': "New Player Joined"}, room = room_id, include_self=False)
    return {'code': json.dumps(0),
            'message': "Socket Connection Successful"}

@socketio.on('message')
def handle_message(request):
    print("New Message")
    print(request)
    print(request.msg)
    socketio.emit('msg_recvd', {'msg': request.msg}, room = room_id, include_self=False)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
