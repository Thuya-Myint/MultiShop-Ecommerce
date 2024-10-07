const mongoose = require('mongoose');
const statusModelSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)
const Status = mongoose.model('status', statusModelSchema);
module.exports = Status
