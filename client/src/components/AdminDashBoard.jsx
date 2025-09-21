import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('craftconnect_token');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/users/artisan-applications', config);
        setApplications(res.data);
      } catch (err) {
        alert('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [token]);

  const handleUpdateStatus = async (id, action) => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      const url = `http://localhost:5000/api/users/${action}-artisan/${id}`;
      await axios.put(url, {}, config);
      alert(`Artisan ${action}ed successfully`);
      setApplications(applications.filter(app => app._id !== id));
    } catch (err) {
      alert('Operation failed');
    }
  };

  if (loading) return <div>Loading artisan applications...</div>;

  if (applications.length === 0) return <div>No pending artisan applications.</div>;

  return (
    <div>
      <h2>Pending Artisan Applications</h2>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ margin: 'auto', width: '80%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Location</th>
            <th>Service Category</th>
            <th>Aadhaar Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app._id}>
              <td>{app.name}</td>
              <td>{app.email}</td>
              <td>{app.artisanInfo.location}</td>
              <td>{app.artisanInfo.serviceCategory}</td>
              <td>{app.artisanInfo.aadhaarNumber}</td>
              <td>
                <button onClick={() => handleUpdateStatus(app._id, 'approve')}>Approve</button>
                <button onClick={() => handleUpdateStatus(app._id, 'reject')} style={{ marginLeft: '10px' }}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
