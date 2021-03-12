// const BaseController = require("./BaseController");
const { LoginService } = require("../../../orm/services");

class LoginController {
    constructor() {
    }

    login = async (req, res) => {
        try {
            const result = await LoginService.login(req.body);
            res.sendHttpSuccess(result);
        } catch (error) {
            res.sendHttpError(404, "LoginController login()", error);
        }
    }
}

module.exports = LoginController;