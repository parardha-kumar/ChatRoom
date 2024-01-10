import React, { useState, Component } from 'react';
import { socket } from '../../Global';

class Room extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            currentMessage: '' // New state property for the current message
        };
    }

    componentDidMount() {
        if (socket) {
            console.log("Socket defined")
            socket.on("msg_recvd", (data) => {
                if (data && data.messages) {
                    this.setState({ messages: data.messages });
                }
            });
            socket.on("update_message", (data) => {
                if (data && data.messages) {
                    this.setState({ messages: data.messages });
                }
            });
        } else {
            console.error('Socket is not initialized');
        }
    }

    componentWillUnmount() {
        socket.off("msg_recvd")
        socket.off("update_message");
    }

    handleNewMessage = (msg) => {
        this.setState(prevState => ({
            messages: [...prevState.messages, { id: Date.now(), text: msg, upvotes: 0, downvotes: 0 }]
        }));
    }

    handleSendMessage = () => {
        const { currentMessage } = this.state;
        if (socket && currentMessage.trim()) {
            socket.emit("message", { msg: currentMessage }, (response) => {
                // Handle the response from the server
            });
            this.setState({ currentMessage: '' }); // Clear the input field after sending
        } else {
            console.error('Socket is not initialized or message is empty');
        }
    };

    handleInputChange = (e) => {
        this.setState({ currentMessage: e.target.value });
    };


    handleUpvote = (messageId) => {
        var request = { 'message_id': messageId };
        console.log("Emitting upvote for message ID:", messageId);
        socket.emit("upvote", request);
    };

    handleDownvote = (messageId) => {
        socket.emit("downvote", { message_id: messageId });
    };

    render() {

        const { messages, currentMessage } = this.state;


        return (
            <>
                <div>
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={this.handleInputChange}
                        placeholder="Type your message here..."
                    />
                    <button onClick={this.handleSendMessage}>Send Message</button>
                </div>

                <div className="chat-room">
                    <h2>Chat Room</h2>
                    <div className="messages">
                        {messages.map(message => (
                            <div key={message.id} className="message">
                                <p>{message.text}</p>
                                <div className="votes">
                                    <button onClick={() => this.handleUpvote(message.id)}>👍 {message.upvotes}</button>
                                    <button onClick={() => this.handleDownvote(message.id)}>👎 {message.downvotes}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )
    }
}

export default Room;