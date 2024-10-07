const express = require('express');
const { addStatus, getAllStatus, getAStatus, updateStatus, deleteStatus, findWithStatus, findWithColor } = require('../controllers/status');
const statusRoute = express.Router();
const authToken = require('../utilities/middelware/JWTAuth')

statusRoute.post('/status/add', addStatus);
statusRoute.get('/status/allStatus', getAllStatus);
statusRoute.get('/status/findStatus/:id', getAStatus);
statusRoute.put('/status/updateStatus/:id', updateStatus);
statusRoute.delete('/status/deleteStatus/:id', deleteStatus);
statusRoute.get('/status/findWithStatus/:status', findWithStatus);
statusRoute.get('/status/findWithColor/:color', findWithColor);

module.exports = statusRoute;
