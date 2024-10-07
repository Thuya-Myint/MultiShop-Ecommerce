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

// List of allowed origins
const allowedOrigins = [
    'https://multishop-ecommerce-1.onrender.com', // Replace with your static site URL
    'http://localhost:3000', // Local development URL (if needed)
];

// CORS options
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

// Middleware setup
app.use(compression());
app.use(cors(corsOptions)); // Use the CORS options here
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
    res.send("Api Start Working!");
});

// MongoDB connection and server start
mongo.connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Connection With MONGO :: Success And Server is Working on Port ${port}`);
    });
}).catch((error) => {
    console.error(`Error in Connecting MONGO :: ${error}`);
});

// Route definitions
app.use('/api/user', userroute);
app.use('/api/customer', customerroute);
app.use('/api/unit', unitroute);
app.use('/api/product', productroute);
app.use('/api/order', orderroute);
app.use('/api/status', statusroute);
app.use('/api/shop/', shoproute);
