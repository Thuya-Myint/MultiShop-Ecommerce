const mongoose = require('mongoose');
const unitModelSchema = new mongoose.Schema(
    {
        unitname: {
            type: String,
            required: true,
            unique: true
        },
        short: {
            type: String,
            required: true,
            unique: true
        }
    },
    { timestamps: true }
);
const Unit = mongoose.model('unit', unitModelSchema);
module.exports = Unit;
