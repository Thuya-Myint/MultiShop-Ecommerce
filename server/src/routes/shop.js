const express = require('express');
const shopRoute = express.Router();
const { findShop, addNewShop, allShop, editShop, deleteShop } = require('../controllers/shop');
const authToken = require('../utilities/middelware/JWTAuth');

shopRoute.get('/shop/all', authToken, allShop);
shopRoute.get('/findWithName/:shopName', authToken, findShop);
shopRoute.post('/shop/add', authToken, addNewShop);
shopRoute.put('/shop/edit/:id', authToken, editShop);
shopRoute.delete('/shop/delete/:id', authToken, deleteShop);

module.exports = shopRoute
