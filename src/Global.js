import React, { Component } from "react";
import socketIOClient from "socket.io-client";

var socket;
var endpoint = 'http://localhost:5000';

/* Create a new chat room */
function initiate_socket_connection() {
    socket = socketIOClient(endpoint, { query: {}, transports: ['websocket'], upgrade: false });
    console.log("Initiating");
    socket.on('connect', () => {
      console.log("Socket Connected");
      console.log("create_room emit")
      socket.emit("create_room", {}, (response) => {
        console.log('Server Response:', response);
        if (response.code === "0") {
          console.log("Room Created Successfully!");
        }
        else {
          console.log(response.code + " Error Creating Chat Room");
        }
      });
      console.log("create_room emit exit")
    })
  
    socket.on('connect_error', (error) => {
      console.error('Connection Error:', error);
    });
  }

class Global extends Component {

	render() {
	    return (
	      <>
	      </>
	    );
	}
}

export {
	Global,
	socket,
	endpoint,
    initiate_socket_connection
};