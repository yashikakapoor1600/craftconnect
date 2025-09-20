// client/src/components/CustomerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArtisanCard from './ArtisanCard.jsx';
import OrderCard from './OrderCard.jsx'; // Naya component import karein

const CustomerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState([]);
  const [orders, setOrders] = useState([]); // Orders ke liye nayi state
  const [loadingArtisans, setLoadingArtisans] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const token = localStorage.getItem('craftconnect_token');
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/users/artisans', config);
        setArtisans(res.data);
      } catch (error) {
        console.error("Could not fetch artisans", error);
      } finally {
        setLoadingArtisans(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('craftconnect_token');
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/bookings/my-orders', config);
        setOrders(res.data);
      } catch (error) {
        console.error("Could not fetch orders", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchArtisans();
    fetchOrders();
  }, []);

  // LOGOUT KA FUNCTION
  const handleLogout = () => {
    localStorage.removeItem('craftconnect_token');
    alert('You have been logged out.');
    navigate('/login');
  };

  const groupedArtisans = artisans.reduce((acc, artisan) => {
    const category = artisan.artisanInfo.serviceCategory;
    if (!acc[category]) acc[category] = [];
    acc[category].push(artisan);
    return acc;
  }, {});

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: 'auto', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Welcome, {user.name}!</h2>
        {/* LOGOUT KA BUTTON */}
        <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}>
          Logout
        </button>
      </div>

      {/* My Bookings Section */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>My Bookings</h3>
        {loadingOrders ? (
          <p>Loading your bookings...</p>
        ) : orders.length > 0 ? (
          orders.map(order => <OrderCard key={order._id} order={order} />)
        ) : (
          <p>You have not made any bookings yet.</p>
        )}
      </div>

      {/* Browse Artisans Section */}
      <div>
        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Browse & Book Artisans</h3>
        {loadingArtisans ? (
          <p>Loading artisans...</p>
        ) : (
          Object.keys(groupedArtisans).length > 0 ? (
            Object.keys(groupedArtisans).map(category => (
              <div key={category} style={{ marginBottom: '30px' }}>
                <h4 style={{ color: '#0056b3' }}>{category}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {groupedArtisans[category].map(artisan => (
                    <ArtisanCard key={artisan._id} artisan={artisan} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No artisans found at the moment.</p>
          )
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;