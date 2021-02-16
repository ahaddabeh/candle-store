require("dotenv").config({});
const Stripe = require("stripe");
const stripe = Stripe(process.env.SK);

class CheckoutService {
    constructor() {
    }

    checkout = async (req) => {
        const customer = await stripe.customers.create(req.body.customer)
        const paymentMethod = await stripe.paymentMethods.create({ type: 'card', ...req.body.paymentMethod });
        await stripe.paymentMethods.attach(paymentMethod.id, { customer: customer.id })
        const cart = req.body.cartItems;
        const cartTotal = (cartArray) => {
            let count = 0;
            for (let i = 0; i < cartArray.length; i++) {
                if (+cartArray[i].quantity <= 1) {
                    count += +cartArray[i].price;
                }
                else if (+cartArray[i].quantity > 1) {
                    count += +cartArray[i].price * +cartArray[i].quantity;
                }
            }
            return count;
        }
        const paymentIntent = await stripe.paymentIntents.create({
            customer: customer.id,
            payment_method: paymentMethod.id,
            capture_method: "manual",
            amount: cartTotal(cart) * 100,
            currency: 'usd',
            payment_method_types: ['card'],
        });

        const confirmed = await stripe.paymentIntents.confirm(paymentIntent.id);
        const response = await stripe.paymentIntents.capture(paymentIntent.id);
        return { customer, paymentMethod, paymentIntent };
        // console.log(productCount)
        // Need to check if any products are using this category
        // if (productCount > 0) {
        //     return { success: false, msg: `CategoryId ${id} used by ${productCount} product(s)` }
        // }
        // // If no products using the category, delete the category
        // await this.db.Category.destroy({ where: { id: id } })
        // return { success: true, msg: `CategoryId ${id} deleted successfully` }
    }
}

module.exports = CheckoutService;