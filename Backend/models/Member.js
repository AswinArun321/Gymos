// backend/models/Member.js
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    gym_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Gym',
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    plan: { 
        type: String, 
        enum: ['1-month', '3-month', '6-month', '1-year'],
        required: true 
    },
    status: {
        type: String,
        enum: ['Active', 'Expired', 'Pending'],
        default: 'Active'
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);