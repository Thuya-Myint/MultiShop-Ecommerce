const express = require('express');
const { placeOrder, allOrder, modifyOrder, deleteOrder } = require('../controllers/order');
const orderRoute = express.Router();
const authToken = require('../utilities/middelware/JWTAuth')

orderRoute.post('/placeOrder/', authToken, placeOrder);
orderRoute.get('/allOrder/', authToken, allOrder);
orderRoute.put('/order/:id', authToken, modifyOrder);
orderRoute.delete('/order/:id', authToken, deleteOrder);
module.exports = orderRoute;
