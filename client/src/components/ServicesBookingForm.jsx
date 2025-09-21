// client/src/components/ServiceBookingForm.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ServiceBookingForm = () => {
  const [artisans, setArtisans] = useState([]);
  const [selectedArtisan, setSelectedArtisan] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem('craftconnect_token');

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/users/artisans', config);
        setArtisans(res.data);
      } catch {
        alert('Failed to load artisans.');
      } finally {
        setLoading(false);
      }
    };
    fetchArtisans();
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedArtisan) {
      alert('Please select an artisan.');
      return;
    }
    if (!bookingDate) {
      alert('Please select a booking date.');
      return;
    }
    try {
      const config = { headers: { 'x-auth-token': token } };
      const body = {
        artisanId: selectedArtisan,
        serviceCategory,
        bookingDate,
      };
      await axios.post('http://localhost:5000/api/bookings', body, config);
      alert('Booking successful!');
      navigate('/dashboard');
    } catch (err) {
      alert('Booking failed.');
    }
  };

  if (loading) return <div>Loading services...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Book a Service</h2>
      <form onSubmit={onSubmit}>
        <label>Choose an artisan:</label>
        <select value={selectedArtisan} onChange={(e) => setSelectedArtisan(e.target.value)} required>
          <option value="">-- Select an artisan --</option>
          {artisans.map((artisan) => (
            <option key={artisan._id} value={artisan._id}>
              {artisan.name} - {artisan.artisanInfo.serviceCategory}
            </option>
          ))}
        </select>
        <br /><br />
        <label>Booking Date:</label>
        <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required />
        <br /><br />
        <input type="submit" value="Book Now" />
      </form>
    </div>
  );
};

export default ServiceBookingForm;
