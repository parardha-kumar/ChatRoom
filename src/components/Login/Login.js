// src/components/Login/login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './../context/AuthContext';

const Login = () => {
    const auth = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(username, password)
            const response = await axios.post('http://localhost:5000/login', { username, password });
            console.log(response.data.message);
            auth.login();
            // Handle successful login here (e.g., redirect, store user session)
        } catch (error) {
            alert(error.response.data.error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
