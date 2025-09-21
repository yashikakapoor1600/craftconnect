// // client/src/components/Login.jsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const navigate = useNavigate();
//   const { email, password } = formData;

//   const onChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/users/login', formData);
//       localStorage.setItem('craftconnect_token', res.data.token);

//       const config = { headers: { 'x-auth-token': res.data.token } };
//       const userRes = await axios.get('http://localhost:5000/api/users/me', config);
//       localStorage.setItem('isAdmin', userRes.data.isAdmin ? 'true' : 'false');
//       alert('Aap successfully login ho gaye hain!');
//       if(userRes.data.isAdmin){
//         navigate('/admin-dashboard');
//       }
//       else {
//         navigate('/dashboard'); // Login ke baad dashboard par bhejo
//       }
//     } catch (err) {
//       console.error(err.response.data);
//       alert('Error: ' + err.response.data.msg);
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={onSubmit}>
//         <div>
//           <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
//         </div>
//         <div>
//           <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} minLength="6" required />
//         </div>
//         <input type="submit" value="Login" />
//       </form>
//     </div>
//   );
// };

// export default Login;

// client/src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Login request
      const res = await axios.post('http://localhost:5000/api/users/login', formData);
      localStorage.setItem('craftconnect_token', res.data.token);

      // Fetch user profile using token to get admin status
      const config = { headers: { 'x-auth-token': res.data.token } };
      const userRes = await axios.get('http://localhost:5000/api/users/me', config);
      localStorage.setItem('isAdmin', userRes.data.isAdmin ? 'true' : 'false');

      alert('Aap successfully login ho gaye hain!');

      // Redirect based on admin status
      if (userRes.data.isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err.response?.data);
      alert('Error: ' + (err.response?.data.msg || 'An error occurred'));
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
        </div>
        <div>
          <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} minLength="6" required />
        </div>
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default Login;
