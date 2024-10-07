const User = require('../models/user');
const { encryption, decryption } = require('../helper/commonHelper');
const jwt = require('jsonwebtoken');
const { configs } = require('../../config/config');
const allUser = async (req, res) => {
    try {
        const allusers = await User.find({});
        const filteredList = allusers.map(user => ({
            id: user._id,
            shopName: user.shopName,
            shopAddress: user.shopAddress,
            shopPhoneNumber: user.shopPhoneNumber,
            shopLogo: user.shopLogo
        }))
        res.status(202).json(filteredList);
    } catch (error) {
        console.log(error);
        res.status(505).json({ message: error.message })
    }
}
const findUser = async (req, res) => {
    try {
        const { name } = req.params;
        const searchUser = await User.findOne({ username: name });
        if (!searchUser) return res.status(401).json({ message: "User Not Found!" })
        res.status(201).json(searchUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const signIn = async (req, res) => {
    try {
        //exist or not
        const { username, role } = req.body;
        const searchUser = await User.findOne({ username: username, role: role });
        console.log(searchUser)
        if (!searchUser) return res.status(401).json({ message: "New User, Please Sign Up!" });
        //user exists and check for authentication
        const { password } = req.body;
        const dePassword = decryption(searchUser.password);
        // console.log(password, searchUser.password)
        // console.log("entered - ", password);
        // console.log("fetched - ", dePassword);
        if (password !== dePassword)
            return res.status(403).json({ message: "User Not Authorized!" });

        const token = jwt.sign(
            {
                id: searchUser._id,
                username: searchUser.username,
                role: searchUser.role
            },
            configs.secretKey,
            {
                expiresIn: 43200
            }
        );
        return res.status(202).json(token)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const signUp = async (req, res) => {
    try {
        const { username, role } = req.body;
        const searchUser = await User.findOne({ username: username, role: role });
        if (searchUser) return res.status(401).json({ message: "Old User, Please Sign In!" })
        const newUser = await User.create({
            ...req.body,
            password: encryption(req.body.password),

        });
        const token = jwt.sign(
            {
                id: newUser._id,
                username: newUser.username,
                role: role
            },
            configs.secretKey,
            {
                expiresIn: 43200
            }
        );
        return res.status(202).json(token);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
module.exports = { signIn, findUser, signUp, allUser };
