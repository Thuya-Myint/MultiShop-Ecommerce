const mongoose = require('mongoose');
const shopModelSchema = new mongoose.Schema(
    {
        shopName: {
            type: String,
            required: true
        },
        shopAddress: {
            type: String,
            required: true,
        },
        shopPhoneNumber: {
            type: String,
            required: true,
        },
        shopLogo: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
)
const Shop = mongoose.model('shop', shopModelSchema);
module.exports = Shop;
