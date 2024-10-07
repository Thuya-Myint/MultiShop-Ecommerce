const jwt = require('jsonwebtoken');
const { configs } = require('../../../config/config');

const verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({ message: "No Token Provided!" });
    }
    jwt.verify(token, configs.secretKey, (err, decoded) => {
        if (err) {
            console.log(err)
            return res.status(401).send({ message: "Unauthorized!", success: false });
        }
        console.log(`decoded : ${JSON.stringify(decoded)}`)
        req.userId = decoded.id;
        req.username = decoded.username;
        next();
    });
};
module.exports = verifyToken;
