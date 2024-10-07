const express = require("express");
const userRoute = express.Router();
const { signIn, findUser, signUp, allUser } = require('../controllers/user');
const authToken = require('../utilities/middelware/JWTAuth');
userRoute.post("/new", signUp);
userRoute.get("/findUser/:name", findUser);
userRoute.post("/old", signIn);
userRoute.get('/all', authToken, allUser)

module.exports = userRoute;
