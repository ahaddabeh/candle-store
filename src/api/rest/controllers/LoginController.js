// const BaseController = require("./BaseController");
const { LoginService } = require("../../../orm/services");

class ShoppingCartController {
    constructor() {
    }

    checkout = async (req, res) => {
        try {
            const result = await LoginService.login(req.body.customer);
            res.sendHttpSuccess(result);
        } catch (error) {
            res.sendHttpError(404, "ShoppingCart controller checkout()", error);
        }
    }
}

module.exports = ShoppingCartController;