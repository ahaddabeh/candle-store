require("dotenv").config({});
const Stripe = require("stripe");
const stripe = Stripe(process.env.SK);

class CheckoutService {
    constructor(db) {
        this.db = db;
    }

    // Helper methods
    _setAddress = (data) => { }
    _setShippingAddress = (data) => { }
    _setCustomerInfo = (data, address, shippingAddress, foundCustomer) => { }
    _setPaymentInfo = (data) => { }
    _setOrderInfo = (data) => { }
    _captureStripeTransaction = (customer, address, shippingAddress, paymentInfo) => { };
    _save = async (customer, order) => {
        try {
            await this.db.sequelize.transaction(async (transaction) => {
                await this.db.Customer.create(customer, { transaction })
                await this.db.Order.create(order, { transaction })
                await this.db.Product.upsert({}, { transaction })
                await transaction.afterCommit(async () => {
                    // send email
                })
            })
            return { success: true, message: "Transaction completed successfully" };
        } catch (error) {
            return { success: false, message: "Transaction failed", error: error };

        }
    }

    checkout = async (data) => {
        // Find customer if it exists
        const foundCustomer = await this.db.Customer.findByEmail(data.email)

        // Look up products from cart items
        // Make sure we have inventory

        // Format address info
        const address = _setAddress(data);
        // Format shippingAddress info
        const shippingAddress = _setShippingAddress(data);
        // Update customer info if anything changed
        const customer = _setCustomerInfo(data, address, shippingAddress, foundCustomer);
        // Format credit card for stripe
        const paymentInfo = _setPaymentInfo(data);
        // Format order info to go into our Order table
        const order = _setOrderInfo(data);
        // Submit payment to stripe

        // if the stripe payment is successful, call the save method and pass the data to it

        // if the stripe payment fails, then return a response saying it failed

        // TODO: Temporary code
        return data;
    }

    _checkout = async (req) => {
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