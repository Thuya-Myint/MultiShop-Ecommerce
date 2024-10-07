const mongoose = require("mongoose");
const { configs } = require('./config');

const Options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const connectDB = () => {
    return mongoose.connect(configs.mongodbURL, Options);
}
module.exports = { connectDB };
