// client/src/components/ArtisanApplication.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ArtisanApplication = () => {
    const [formData, setFormData] = useState({ location: '', aadhaarNumber: '', serviceCategory: '' });
    const navigate = useNavigate();
    const { location, aadhaarNumber, serviceCategory } = formData;

    // Aapke service categories ka dropdown
    const categories = ['Pottery', 'Painting', 'Handicrafts', 'Weaving', 'Jewellery Making', 'Other'];

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('craftconnect_token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.put('http://localhost:5000/api/users/become-artisan', formData, config);
            alert(res.data.msg);
            navigate('/dashboard'); // Form bharne ke baad dashboard par bhejo
        } catch (err) {
            alert('Error: ' + err.response.data.msg);
        }
    };

    return (
        <div>
            <h2>Artisan Application Form</h2>
            <p>Please provide your details to get approved.</p>
            <form onSubmit={onSubmit}>
                <div>
                    <input type="text" placeholder="Your Location (City, State)" name="location" value={location} onChange={onChange} required />
                </div>
                <div>
                    <input type="text" placeholder="Aadhaar Number" name="aadhaarNumber" value={aadhaarNumber} onChange={onChange} required />
                </div>
                <div>
                    <select name="serviceCategory" value={serviceCategory} onChange={onChange} required>
                        <option value="" disabled>-- Select Your Service --</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <input type="submit" value="Submit Application" />
            </form>
        </div>
    );
};

export default ArtisanApplication;