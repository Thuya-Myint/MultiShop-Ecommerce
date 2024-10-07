require("dotenv").config();
const compression = require("compression");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;
const mongo = require('./config/mongo');
const userroute = require('./src/routes/userRoute');
const unitroute = require('./src/routes/unitRoute');
const productroute = require('./src/routes/productRoute');
const customerroute = require('./src/routes/customer');
const orderroute = require('./src/routes/order');
const statusroute = require('./src/routes/status');
const shoproute = require('./src/routes/shop');
app.use(compression());
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
    res.send("Api Start Working!");
});
mongo.connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Connection With MONGO :: Success And Server is Woking on Port ${port}`);
    })
}).catch((error) => {
    console.error(`Error in Connecting MONGO :: ${error}`);
});
app.use('/api/user', userroute);
app.use('/api/customer', customerroute);
app.use('/api/unit', unitroute);
app.use('/api/product', productroute);
app.use('/api/order', orderroute);
app.use('/api/status', statusroute);
app.use('/api/shop/', shoproute)
