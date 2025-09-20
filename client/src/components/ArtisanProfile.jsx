import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Step 1: useNavigate ko import karein
import axios from 'axios';

const ArtisanProfile = () => {
    const { id } = useParams(); 
    const navigate = useNavigate(); // Step 2: useNavigate ko use karne ke liye initialize karein
    const [artisan, setArtisan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtisanDetails = async () => {
            try {
                const token = localStorage.getItem('craftconnect_token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get(`http://localhost:5000/api/users/artisans`, config);
                const foundArtisan = res.data.find(art => art._id === id);
                setArtisan(foundArtisan);
            } catch (error) {
                console.error("Artisan ki details nahi mil paayin", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtisanDetails();
    }, [id]);

    // Step 3: YEH POORA NAYA FUNCTION HAI (ENGINE)
    // Yeh function tab chalega jab button par click hoga
    const handleBookVisit = async () => {
        try {
            const token = localStorage.getItem('craftconnect_token');
            const config = { headers: { 'x-auth-token': token } };
            
            // Backend ko batane ke liye ki kaunsa artisan book karna hai
            const body = { artisanId: id };

            // Backend ki booking API ko call karo
            await axios.post('http://localhost:5000/api/bookings', body, config);
            
            alert('Booking request sent successfully! You will be redirected to your dashboard.');
            navigate('/dashboard'); // Booking ke baad dashboard par bhej do

        } catch (error) {
            // Agar artisan busy hai, toh server se mila error dikhao
            alert('Error: ' + (error.response ? error.response.data.msg : 'Could not book visit.'));
        }
    };

    if (loading) return <div>Loading Profile...</div>;
    if (!artisan) return <div>Sorry, Artisan not found.</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
            <h2>{artisan.name}'s Profile</h2>
            <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', textAlign: 'left' }}>
                <p><strong>Service Category:</strong> {artisan.artisanInfo.serviceCategory}</p>
                <p><strong>Location:</strong> {artisan.artisanInfo.location}</p>
                <p><strong>Email:</strong> {artisan.email}</p>
            </div>
            <button 
                onClick={handleBookVisit} // Step 4: YAHAN HUMNE ENGINE KO BUTTON SE JODA
                style={{ marginTop: '20px', padding: '12px 25px', fontSize: '1rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
            >
                Book a Visit
            </button>
        </div>
    );
};

export default ArtisanProfile;

