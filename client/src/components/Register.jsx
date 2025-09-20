// client/src/components/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isArtisan, setIsArtisan] = useState(false); // Checkbox ke liye state
  const navigate = useNavigate();
  const { name, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', formData);
      localStorage.setItem('craftconnect_token', res.data.token);
      
      if (isArtisan) {
        // Agar artisan banna hai, toh artisan form page par bhejo
        alert('Account created! Now, please fill your artisan details.');
        navigate('/artisan-application');
      } else {
        // Normal user hai toh dashboard par bhejo
        alert('Registration successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      alert('Error: ' + err.response.data.msg);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        {/* ... name, email, password ke input fields ... */}
        <div>
          <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} required />
        </div>
        <div>
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
        </div>
        <div>
          <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} minLength="6" required />
        </div>

        {/* NAYA: Artisan Checkbox */}
        <div>
          <input
            type="checkbox"
            id="isArtisan"
            checked={isArtisan}
            onChange={(e) => setIsArtisan(e.target.checked)}
          />
          <label htmlFor="isArtisan">Want to become an Artisan?</label>
        </div>
        <input type="submit" value="Register" />
      </form>
    </div>
  );
};

export default Register;