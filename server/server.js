// server/server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db'); // db.js ko import kiya
const cors = require('cors');

connectDB();

const app = express();
app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Backend server chal raha hai!');
});
app.use('/api/users', require('./routes/api/users'));
app.use('/api/bookings', require('./routes/api/bookings'));
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server port ${PORT} par shuru ho gaya hai.`);
});