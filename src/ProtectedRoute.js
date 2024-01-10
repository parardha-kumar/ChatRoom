import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './components/context/AuthContext'; // Adjust the path as needed

const ProtectedRoute = ({ children, ...rest }) => {
    const { isLoggedIn } = useAuth();

    return (
        <Route
            {...rest}
            render={({ location }) =>
                isLoggedIn ? (
                    children
                ) : (
                    <Navigate to="/login" state={{ from: location }} />
                )
            }
        />
    );
};

export default ProtectedRoute;
