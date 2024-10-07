const mongoose = require('mongoose');
const userModelSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        imgSrc: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['shop admin', 'super admin'],
            required: true
        },
        shopName: {
            type: String,
            required: false
        },
        shopAddress: {
            type: String,
            required: false,
        },
        shopPhoneNumber: {
            type: String,
            required: false,
        },
        shopLogo: {
            type: String,
            required: false
        },
    },
    { timestamps: true }
);
const User = mongoose.model('user', userModelSchema)
module.exports = User;
