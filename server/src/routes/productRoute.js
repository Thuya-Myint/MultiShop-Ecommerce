const express = require('express');
const { addProduct, getAllProduct, updateProduct, deleteProduct, findProductName, findProductId } = require('../controllers/product');
const productRoute = express.Router();
const authToken = require('../utilities/middelware/JWTAuth');

productRoute.post('/addProduct/', authToken, addProduct);
productRoute.get('/all', getAllProduct);
productRoute.put('/:id', authToken, updateProduct);
productRoute.delete('/:id', authToken, deleteProduct);
productRoute.get('/findProduct', findProductName);
productRoute.get('/findProduct/:id', findProductId)


module.exports = productRoute
