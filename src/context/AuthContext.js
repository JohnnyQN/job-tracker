import React from 'react';
import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                return jwtDecode(token);
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem('token');
                return null;
            }
        }
        return null;
    });

    useEffect(() => {
        const checkTokenExpiration = () => {
            const token = localStorage.getItem('token');
            if (!token) return false;

            try {
                const decoded = jwtDecode(token);
                return decoded.exp * 1000 > Date.now();
            } catch (error) {
                return false;
            }
        };

        if (user && !checkTokenExpiration()) {
            console.warn("⚠️ Token expired, logging out...");
            logout();
        }
    }, [user]); // Only runs when `user` changes

    const login = (token) => {
        console.log("🔑 Storing token:", token);
        localStorage.setItem('token', token);
        setUser(jwtDecode(token));
    };

    const logout = () => {
        console.log("🚪 Logging out...");
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login'; 
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
