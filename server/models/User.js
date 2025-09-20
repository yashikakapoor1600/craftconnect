
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['customer', 'artisan'],
        default: 'customer'
    },
    artisanInfo: {
        location: { type: String },
        aadhaarNumber: { type: String }, // Isse humesha encrypt karke save karna chahiye
        serviceCategory: { type: String }, // Dropdown se aayega
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);