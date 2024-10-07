const Customer = require('../models/customer');
const { encryption, decryption } = require('../helper/commonHelper');
const jwt = require('jsonwebtoken');
const { configs } = require('../../config/config');

const findUser = async (req, res) => {
    try {
        const { name } = req.params;
        const searchUser = await Customer.findOne({ username: name });
        if (!searchUser) return res.status(401).json({ message: "User Not Found!" })
        res.status(201).json(searchUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const signIn = async (req, res) => {
    try {
        //exist or not
        const { username } = req.body;
        const searchUser = await Customer.findOne({ username: username });
        if (!searchUser) return res.status(401).json({ message: "New User, Please Sign Up!" });
        //user exists and check for authentication
        const { password } = req.body;
        const dePassword = decryption(searchUser.password);
        console.log(password, searchUser.password)
        console.log("entered - ", password);
        console.log("fetched - ", dePassword);
        if (password !== dePassword)
            return res.status(403).json({ message: "User Not Authorized!" });

        const token = jwt.sign(
            {
                id: searchUser._id,
                username: searchUser.username,
            },
            configs.secretKey,
            {
                expiresIn: 43200
            }
        );
        return res.status(202).json(token)
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
}
const signUp = async (req, res) => {
    try {
        const { username } = req.body;
        const searchUser = await Customer.findOne({ username: username });
        if (searchUser) return res.status(401).json({ message: "Old User, Please Sign In!" })
        const newUser = await Customer.create({
            username: req.body.username,
            password: encryption(req.body.password),
            imgSrc: req.body.imgSrc
        });
        const token = jwt.sign(
            {
                id: newUser._id,
                username: newUser.username,
            },
            configs.secretKey,
            {
                expiresIn: 43200
            }
        );
        return res.status(202).json(token);
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log(error);
    }
}
module.exports = { signIn, findUser, signUp };
