import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout/Layout';
import Home from '../pages/Home/Home';
import Dashboard from '../pages/Dashboard/Dashboard';
import Signals from '../pages/Signals/Signals';
import Portfolio from '../pages/Portfolio/Portfolio';
import Markets from '../pages/Markets/Markets';
import Learn from '../pages/Learn/Learn';
import Settings from '../pages/Settings/Settings';
import Login from '../pages/Auth/Login/Login';
import Register from '../pages/Auth/Register/Register';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'signals',
        element: <Signals />
      },
      {
        path: 'portfolio',
        element: <Portfolio />
      },
      {
        path: 'markets',
        element: <Markets />
      },
      {
        path: 'learn',
        element: <Learn />
      },
      {
        path: 'settings',
        element: <Settings />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
]);

// Route guard for protected routes
export const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    window.location.href = '/login';
    return null;
  }
  
  return children;
};

// Public route (redirect if already logged in)
export const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (token && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
    window.location.href = '/dashboard';
    return null;
  }
  
  return children;
};