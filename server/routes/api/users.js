const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth'); // Auth middleware ko upar import karein
const User = require('../../models/User');
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            "hamariSuperSecretKey123",
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            "hamariSuperSecretKey123",
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.put('/become-artisan', auth, async (req, res) => {
    const { location, aadhaarNumber, serviceCategory } = req.body;
    if (!location || !aadhaarNumber || !serviceCategory) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    try {
        // 1. User ko uski ID se dhoondo (jo token se mili)
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        // 2. User ka role aur details update karo
        user.role = 'artisan';
        user.artisanInfo = {
            location,
            aadhaarNumber,
            serviceCategory,
            status: 'pending' // Application ka status 'pending' rakho
        };

        // 3. Updated user ko database mein save karo
        await user.save();

        res.json({ msg: 'Application submitted! Waiting for admin approval.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/artisans', auth, async (req, res) => {
    try {
        const artisans = await User.find({
            role: 'artisan',
            'artisanInfo.status': 'approved'
        }).select('-password'); 

        res.json(artisans);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;

