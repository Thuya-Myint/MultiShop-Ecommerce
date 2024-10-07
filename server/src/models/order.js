const mongoose = require('mongoose');
const orderModelSchema = new mongoose.Schema(
    {
        orderedproduct:
            [{
                productId: {
                    type: String,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                desc: {
                    type: String,
                    required: true
                },
                imgSrcs: {
                    type: [String],
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                size: {
                    type: String,
                    required: true
                },
                color: {
                    type: String,
                    required: true
                },
                priceEach: {
                    type: Number,
                    required: true
                },
                shopId: {
                    type: String,
                    required: true
                }
            }]
        ,
        customername: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);
const Order = mongoose.model('order', orderModelSchema);
module.exports = Order;
