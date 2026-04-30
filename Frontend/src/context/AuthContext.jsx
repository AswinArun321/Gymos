import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. INITIALIZE: Check local storage the very first time the app loads
    const [user, setUser] = useState(() => {
        try {
            // Look in the browser's hard drive for our saved user
            const savedUser = localStorage.getItem('gymos_user');
            // If it exists, turn it back into a JavaScript object. If not, return null.
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("Failed to parse user from local storage", error);
            return null;
        }
    });

    // 2. THE WATCHER: Anytime the 'user' state changes, save it to the hard drive
    useEffect(() => {
        if (user) {
            localStorage.setItem('gymos_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('gymos_user'); // Clean up on logout
        }
    }, [user]);

    // 3. LOGIN FUNCTION
    const login = (userData) => {
        setUser(userData);
    };

    // 4. LOGOUT FUNCTION
    const logout = () => {
        setUser(null);
        localStorage.removeItem('gymos_user'); 
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};