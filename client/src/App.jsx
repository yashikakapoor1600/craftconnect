import React, { useContext } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';

// Sabhi components ko ek hi jagah import karein
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import ArtisanApplication from './components/ArtisanApplication.jsx';
import ArtisanProfile from './components/ArtisanProfile.jsx';
import AdminDashboard from './components/AdminDashBoard.jsx';
import { UserContext } from './contexts/UserContext.jsx';
import ServiceBookingForm from './components/ServicesBookingForm.jsx';

// Gatekeeper Component: Yeh check karta hai ki user logged in hai ya nahi
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('craftconnect_token');
  const { user } = useContext(UserContext);

  if (!token) {
    // Agar token nahi hai, toh user ko login page par bhej do
    return <Navigate to="/login" />;
  }
  if (adminOnly && (!user || user.isAdmin !== true)) {
    return <Navigate to="/dashboard" />;
  }
  // Agar token hai, toh user ko page dekhne do
  return children;
};


function App() {
  return (
    <div className="App">
      {/* Navigation Bar: Har page par dikhega */}
      <nav style={{ padding: '1rem', backgroundColor: '#282c34', marginBottom: '1rem' }}>
        <Link to="/register" style={{ margin: '0 10px', color: 'white' }}>Register</Link>
        <Link to="/login" style={{ margin: '0 10px', color: 'white' }}>Login</Link>
        <Link to="/dashboard" style={{ margin: '0 10px', color: 'white' }}>Dashboard</Link>
      </nav>
      
      <header className="App-header">
        <h1>Welcome to Craft Connect</h1>
        
        {/* --- YEH SAHI ROUTING KA MAP HAI --- */}
        <Routes>
          {/* Default Route: Main page par aane par register page par bhejo */}
          <Route path="/" element={<Navigate to="/register" />} />

          {/* Public Routes: Inhe koi bhi dekh sakta hai */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes: Inhe sirf logged-in user hi dekh sakta hai */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/artisan-application" 
            element={
              <ProtectedRoute>
                <ArtisanApplication />
              </ProtectedRoute>
            } 
          />
          {/* YEH NAYA ARTISAN PROFILE WALA ROUTE HAI */}
          <Route 
            path="/artisan/:id" 
            element={
              <ProtectedRoute>
                <ArtisanProfile />
              </ProtectedRoute>
            } 
          />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
          />
          <Route
  path="/book-service"
  element={
    <ProtectedRoute>
      <ServiceBookingForm />
    </ProtectedRoute>
  }
/>
        </Routes>
      </header>
    </div>
  );
}

export default App;

