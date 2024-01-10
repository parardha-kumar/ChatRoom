import React, { Component } from 'react';
import { socket } from '../../Global';

class Room extends Component {
    componentDidMount(){
        if (socket) {
            console.log("Socket defined")
            socket.on("msg_recvd", (data) =>{
                console.log("New Message Rcvd!" + data['msg'])
            });
        } else {
            console.error('Socket is not initialized');
        }
    }

    componentWillUnmount(){
        socket.off("msg_recvd")
    }

    handleSendMessage = () => {
        // Emit a socket event when the button is clicked
        if (socket) {
            socket.emit("message", {msg: "Hello, Server!" }, (response) => {
            });
        } else {
            console.error('Socket is not initialized');
        }
    };

    render() {
        return (
            <>
                <div>
                    Routing to Room
                    <button onClick={this.handleSendMessage}>Send Message </button>
                </div>
            </>
        )
    }
}

export default Room;