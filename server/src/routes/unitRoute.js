const express = require('express');
const { addUnit, allUnit, deleteUnit, updateUnit } = require('../controllers/unit');
const unitRoute = express.Router();
const authToken = require('../utilities/middelware/JWTAuth');

unitRoute.post('/addUnit/', authToken, addUnit);
unitRoute.get('/all', authToken, allUnit);
unitRoute.put('/unit/:id', authToken, updateUnit);
unitRoute.delete('/unit/:id', authToken, deleteUnit);
module.exports = unitRoute;
