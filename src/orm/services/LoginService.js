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
            if (!user) {
                return { status: false, message: "User not found" }
            }
            const comparePasswords = await bcrypt.compare(data.password, user.password);
            if (comparePasswords) {
                const accessToken = jwt.sign({ user: user.username }, process.env.ACCESS_TOKEN_SECRET);
                return { accessToken, status: true, message: "Login successful" };
                // const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
                // return { accessToken, refreshToken, status: true, message: "Login successful" };

            }
        }
        catch (error) {
            return { status: false, message: "Login failed", error };
        }
    }
}

module.exports = LoginService;