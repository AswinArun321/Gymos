import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            setUser(JSON.parse(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            // Extract role directly from response data
            const { token, user, role } = response.data; 
            
            const fullUserData = { ...user, role };
            
            localStorage.setItem('token', token || ''); // Fallback if no JWT yet
            localStorage.setItem('user', JSON.stringify(fullUserData));
            
            setUser(fullUserData);
            if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            return { success: true, role: role }; 
        } catch (error) {
            return { success: false, message: error.response?.data?.error || 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};