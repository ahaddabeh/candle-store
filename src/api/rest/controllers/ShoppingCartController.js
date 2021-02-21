// const BaseController = require("./BaseController");
const { CheckoutService } = require("../../../orm/services");
const OrderController = require("./OrderController")
const CustomerController = require("./CustomerController")
require("dotenv").config({});
const Stripe = require("stripe");
const stripe = Stripe(process.env.SK);

class ShoppingCartController {
    constructor() {
    }

    checkout = async (req, res) => {
        try {
            // let newCustomer = new CustomerController();
            // let newOrder = new OrderController();
            const result = await CheckoutService.checkout(req.body);
            // const customer = result.customer;
            // const order = result.order;
            // newCustomer.create({name: customer.name, email: customer.email, });
            // newOrder.create({write out the object using what you get back from stripe});
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