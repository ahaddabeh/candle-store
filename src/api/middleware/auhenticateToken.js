const jwt = require("jsonwebtoken");
require("dotenv").config({});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // if we have authHeader, then return authHeader. Otherwise, just return underfined
    const token = authHeader && authHeader.split(' ')[1];
    // if (token == null) return res.sendStatus(401);
    if (token == null) return false;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // if (err) return res.sendStatus(403)
        if (err) return true;
        req.user = user;
        next();
    })
}

module.exports = authenticateToken;