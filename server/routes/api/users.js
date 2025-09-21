import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import auth from '../../middleware/auth.js';
import User from '../../models/User.js';
import admin from '../../middleware/admin.js';
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

router.get('/artisan-applications',auth,admin,async(req,res)=>{
    try {
    const pendingApplications = await User.find({ "artisanInfo.status": "pending" }).select('-password');
    res.json(pendingApplications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// router.put('/approve-artisan/:id',auth,admin,async(req,res)=>{
//     console.log('Approve artisan route called with id:', req.params.id);
//     try{
//         const user = await User.findById(req.params.id);
//         if(!user || user.role !== 'artisan'){
//             return res.status(404).json({msg: 'Arstian Not Found'});
//         }
//         user.artisanInfo.status = 'approved';
//         await user.save();
//         res.json({msg: 'Artisan Approved!',user});
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });
router.put('/approve-artisan/:id', auth, admin, async (req, res) => {
  try {
    console.log('Approve artisan started for ID:', req.params.id);
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'artisan') {
      console.log('User not found or not artisan');
      return res.status(404).json({ msg: 'Artisan Not Found' });
    }
    user.artisanInfo.status = 'approved';
    await user.save();
    console.log('Artisan approved:', user);
    res.json({ msg: 'Artisan Approved!', user });
  } catch (err) {
    console.error('Error approving artisan:', err);
    res.status(500).send('Server Error');
  }
});


router.put('/reject-artisan/:id',auth,admin,async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user || user.role !== 'artisan'){
            return res.status(404).json({msg: 'Artisan not Found'});
        }
        user.artisanInfo.status = 'rejected';
        await user.save();
        res.json({msg: 'Artisan Rejected!',user});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})
export default router;

