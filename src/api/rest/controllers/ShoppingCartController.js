// const BaseController = require("./BaseController");
const { CheckoutService } = require("../../../orm/services");
require("dotenv").config({});
const Stripe = require("stripe");
const stripe = Stripe(process.env.SK);

class ShoppingCartController {
    constructor() {
    }

    checkout = async (req, res) => {
        try {
            const result = await CheckoutService.checkout(req.body.customer);
            res.sendHttpSuccess(result);
        } catch (error) {
            res.sendHttpError(404, "ShoppingCart controller checkout()", error);
        }
    }
}

module.exports = ShoppingCartController;