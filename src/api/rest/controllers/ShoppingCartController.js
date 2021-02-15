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
            // Because of our paranoid setting, we have a deleted_at timestamp. We didn't completely delete the instance, we did a "soft delete"
            const customer = await stripe.customers.create(req.body.customer)
            const paymentMethod = await stripe.paymentMethods.create({ type: 'card', ...req.body.paymentMethod });
            await stripe.paymentMethods.attach(paymentMethod.id, { customer: customer.id })

            const paymentIntent = await stripe.paymentIntents.create({
                customer: customer.id,
                payment_method: paymentMethod.id,
                capture_method: "manual",
                amount: 20 * 100,
                currency: 'usd',
                payment_method_types: ['card'],
            });

            const confirmed = await stripe.paymentIntents.confirm(paymentIntent.id);
            const response = await stripe.paymentIntents.capture(paymentIntent.id);
            res.sendHttpSuccess({ customer, paymentMethod, paymentIntent });

        } catch (error) {
            res.sendHttpError(404, "ShoppingCart controller checkout()", error);
        }
    }
}

module.exports = ShoppingCartController;