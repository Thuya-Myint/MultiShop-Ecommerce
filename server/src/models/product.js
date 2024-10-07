const mongoose = require('mongoose');
const productModelSchema = new mongoose.Schema(
    {
        productname: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true,
        },
        size: {
            type: [String],
            required: true
        },
        unitname: {
            type: String,
            required: true
        },
        imgSrcs: {
            type: [String],
            required: true
        },
        initialstock: {
            type: Number,
            required: true
        },
        color: {
            type: [String],
            required: true
        },
        shopId: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);
const Product = mongoose.model('product', productModelSchema);
module.exports = Product;
