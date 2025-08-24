import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true, error: null };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, user: null, isAuthenticated: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, error: null, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'AUTH_CHECK_COMPLETE':
      return { ...state, loading: false };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        try {
          // Set default auth header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify the token is still valid by making a simple API call
          await api.get('/api/auth/me');
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: JSON.parse(user)
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete api.defaults.headers.common['Authorization'];
          dispatch({ type: 'AUTH_CHECK_COMPLETE' });
        }
      } else {
        dispatch({ type: 'AUTH_CHECK_COMPLETE' });
      }
    };

    checkAuthStatus();
  }, []); // Empty dependency array to run only once

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, data } = response.data;
      
      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: data.user
      });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password, role) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await api.post('/api/auth/register', { name, email, password, role });
      const { token, data } = response.data;
      
      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: data.user
      });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      return { success: false, error: message };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    ...state,
    login,
    register,
    logout,
    clearError
  }), [state, logout, clearError]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};