const { CheckoutService } = require("../../../orm/services");
require("dotenv").config({});
const Stripe = require("stripe");
const stripe = Stripe(process.env.SK);

class ShoppingCartController {
    constructor() {
        // Calling the constructor on the BaseController
    }

    checkout = async (req, res) => {
        try {
            const result = await CheckoutService.checkout(req);
            res.sendHttpSuccess(result);
        } catch (error) {
            res.sendHttpError(404, "ShoppingCart controller checkout()", error);
        }
    }
    //     try {
    //         // Because of our paranoid setting, we have a deleted_at timestamp. We didn't completely delete the instance, we did a "soft delete"

    //         res.sendHttpSuccess({ customer, paymentMethod, paymentIntent });

    // }
}

module.exports = ShoppingCartController;