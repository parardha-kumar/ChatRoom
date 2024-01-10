import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/context/AuthContext'; // Adjust the import path as needed
import ProtectedRoute from './ProtectedRoute'; // Adjust the import path as needed
import Home from './components/Home/Home';
import Room from './components/Room/Room';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/chat-room" element={ <Room /> } />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
