import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/layout/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Portfolio from './pages/Portfolio/Portfolio';
import Markets from './pages/Markets/Markets';
import Signals from './pages/Signals/Signals';
import Learn from './pages/Learn/Learn';
import Settings from './pages/Settings/Settings';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminTrades from './pages/Admin/Trades';
import ProTrading from './pages/Trading/ProTrading';
import Landing from './pages/Landing/Landing';
import Subscription from './pages/Subscription/Subscription';
import './App.css';

// Layout component with Sidebar
const MainLayout = ({ children }) => {
  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
};

// Auth layout without Sidebar
const AuthLayout = ({ children }) => {
  return <div className="auth-layout">{children}</div>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Auth Routes (No Sidebar, No Protection) */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />
          <Route
            path="/register"
            element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            }
          />

          {/* Main App Routes (With Sidebar, Protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Portfolio />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/markets"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Markets />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/signals"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Signals />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Learn />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trading"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ProTrading />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Subscription />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes (With Sidebar, Protected) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AdminDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AdminUsers />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/trades"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AdminTrades />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
