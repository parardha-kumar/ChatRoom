import React, { useState, Component } from 'react';
import { socket } from '../../Global';

class Room extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [
                // Dummy data (Pull from DB)
                { id: 1, text: "Hello, this is a test message!", upvotes: 0, downvotes: 0 },
                { id: 2, text: "Another example message here.", upvotes: 0, downvotes: 0 }
            ],
            currentMessage: '' // New state property for the current message
        };
    }
    
    componentDidMount(){
        if (socket) {
            console.log("Socket defined")
            socket.on("msg_recvd", (data) =>{
                console.log("New Message Rcvd!" + data['msg'])
                this.handleNewMessage(data['msg']);
            });
        } else {
            console.error('Socket is not initialized');
        }
    }

    componentWillUnmount(){
        socket.off("msg_recvd")
    }

    // handleSendMessage = () => {
    //     // Emit a socket event when the button is clicked
    //     if (socket) {
    //         socket.emit("message", {msg: "Hello, Server!" }, (response) => {
    //         });
    //     } else {
    //         console.error('Socket is not initialized');
    //     }
    // };

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
        this.setState(prevState => ({
            messages: prevState.messages.map(message => 
                message.id === messageId ? { ...message, upvotes: message.upvotes + 1 } : message
            )
        }));
    };

    handleDownvote = (messageId) => {
        this.setState(prevState => ({
            messages: prevState.messages.map(message => 
                message.id === messageId ? { ...message, downvotes: message.downvotes + 1 } : message
            )
        }));
    };

    render() {

        const { messages } = this.state;

        
        return (
            <>
                <div>
                <input 
                        type="text" 
                        value={this.state.currentMessage} 
                        onChange={this.handleInputChange} 
                        placeholder="Type your message here..."
                    />
                    <button onClick={this.handleSendMessage}>Send Message </button>
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