import './App.css';

import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Global, socket, initiate_socket_connection } from './Global';

import Home from './components/Home/Home';
import Room from './components/Room/Room';

class App extends Component {
  componentDidMount() {
    initiate_socket_connection();
  }

  componentWillUnmount() {
    if (socket) {
      socket.off('connect');
      socket.off('connect_error');
    }
  }
  
  render() {
    return (
      //add your component to this by Route path = "/{component name}"
      <BrowserRouter>
        <div>
          <Global />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat-room" element={<Room />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
