import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Mock API call - replace with actual API
      const response = await mockLogin(username, password);
      
      if (response.success) {
        const { token, user } = response.data;
        
        // Store token and user
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setToken(token);
        setUser(user);
        
        return { success: true };
      }
      
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  const register = async (userData) => {
    try {
      // Mock API call - replace with actual API
      const response = await mockRegister(userData);
      
      if (response.success) {
        return { success: true };
      }
      
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    localStorage.setItem('user', JSON.stringify({ ...user, ...updates }));
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    updateUser,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock API functions for development
const mockLogin = (username, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === 'demo' && password === 'demo') {
        resolve({
          success: true,
          data: {
            token: 'mock-jwt-token',
            user: {
              id: 1,
              username: 'demo',
              email: 'demo@leoneai.com',
              full_name: 'Demo User',
              country: 'Sierra Leone',
              currency_preference: 'SLL',
              risk_tolerance: 'MODERATE',
              created_at: new Date().toISOString()
            }
          }
        });
      } else {
        resolve({
          success: false,
          error: 'Invalid credentials'
        });
      }
    }, 1000);
  });
};

const mockRegister = (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Registration successful'
      });
    }, 1000);
  });
};