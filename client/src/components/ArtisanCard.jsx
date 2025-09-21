import React from 'react';
import { Link } from 'react-router-dom'; // Step 1: Link ko import karein

const ArtisanCard = ({ artisan }) => {
  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    margin: '10px',
    width: '250px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    color: '#333',
    textAlign: 'left',
    textDecoration: 'none', // Link ka underline hatane ke liye
    cursor: 'pointer',       // Mouse ko pointer banane ke liye
    transition: 'transform 0.2s', // Hover effect ke liye
  };

  const nameStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#0056b3',
    margin: '0 0 8px 0',
  };
  const detailStyle = {
      margin: '4px 0',
      fontSize: '0.9rem'
  }
  return (
    // Step 2: Poore div ko Link component se wrap karein
    // Yeh artisan ki unique ID ka istemaal karke uske profile page ka link banata hai
    <Link to={`/artisan/${artisan._id}`} style={cardStyle}>
      <p style={nameStyle}>{artisan.name}</p>
      <p style={detailStyle}><strong>Service:</strong> {artisan.artisanInfo.serviceCategory}</p>
      <p style={detailStyle}><strong>Location:</strong> {artisan.artisanInfo.location}</p>
    </Link>
  );
};

export default ArtisanCard;

