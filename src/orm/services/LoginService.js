const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config({});
class LoginService {
    constructor(db) {
        this.db = db
    }

    login = async (data) => {
        try {
            const user = await this.db.Admin.findOne({ where: { username: data.username } });
            // TODO: Implement JSON webtokens into this
            console.log("This is the found username", user);
            if (user === null) {
                return { status: false, message: "User not found" }
            }

            const comparePasswords = await bcrypt.compare(data.password, user.password);
            console.log("result of bcrypt comparison: ", comparePasswords);
            if (comparePasswords) {
                // const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                return { status: true, message: "Login successful" }
                // We're gonna need an authenticateToken middleware function later 
            }
        }
        catch (error) {
            return { status: false, message: "Login failed", error }
        }
    }
}

module.exports = LoginService;