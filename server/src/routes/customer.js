const express = require("express");
const customerRoute = express.Router();
const { signIn, findUser, signUp } = require('../controllers/customer');

customerRoute.post("/new", signUp);
customerRoute.get("/findUser/:name", findUser);
customerRoute.post("/old", signIn);

module.exports = customerRoute;
