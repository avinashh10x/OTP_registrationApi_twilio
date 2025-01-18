// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    verified: {
        type: Boolean,
        default: false, // Default to false until verified
    },
},
    { timestamps: true });

module.exports = mongoose.model('User', userSchema);

