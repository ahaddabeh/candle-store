require("dotenv").config({});
const Stripe = require("stripe");
const stripe = Stripe(process.env.SK);

class CheckoutService {
    constructor(db) {
        this.db = db;
    }

    // Helper methods
    _setAddress = (data) => {
        return {
            address: data.address,
            city: data.city,
            country: data.country,
            state: data.state
        }
    }
    _setShippingAddress = (data) => {
        return {
            shipping_address: data.shipping_address,
            shipping_city: data.shipping_city,
            shipping_country: data.shipping_country,
            shipping_state: data.shipping_state
        }
    }
    // _setCustomerInfo = (data, address, shippingAddress, foundCustomer) => {
    _setCustomerInfo = (data, address, shippingAddress) => {
        return {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            shipping_address: shippingAddress,
            billing_address: address,
        }
    }
    _setPaymentInfo = (data) => {
        return {
            card_number: data.card_number,
            exp_month: data.exp_month,
            exp_year: data.exp_year,
            cvc: data.cvc
        }
    }
    _setOrderInfo = (data) => {
        const cartItems = data.cart_items;
        let total = 0;
        for (let i = 0; i < cartItems.length; i++) {
            if (cartItems[i].quantity <= 1) {
                total += +cartItems[i].price;
            }
            else if (cartItems[i].quantity > 1) {
                total += +cartItems[i].price * +cartItems[i].quantity;
            }
        }
        const lastFourDigits = data.card_number.substring(data.card_number.length - 4);
        return {
            total: total.toString(),
            cart_items: cartItems,
            status: true,
            card_number: lastFourDigits
        }
    }
    _captureStripeTransaction = async (customer, address, shippingAddress, paymentInfo, order) => {
        const StripePaymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: paymentInfo.card_number,
                exp_month: paymentInfo.exp_month,
                exp_year: paymentInfo.exp_year,
                cvc: paymentInfo.cvc
            }
        });

        const StripeCustomer = await stripe.customers.create({
            name: `${customer.first_name} ${customer.last_name}`,
            email: customer.email,
            phone: customer.phone,
            address: {
                line1: address.address,
                city: address.city,
                state: address.state,
                country: address.country
            },
            shipping: {
                address: {
                    line1: shippingAddress.shipping_address,
                    city: shippingAddress.shipping_city,
                    country: shippingAddress.shipping_country,
                    state: shippingAddress.shipping_state
                },
                name: `${customer.first_name} ${customer.last_name}`
            }

        });

        await stripe.paymentMethods.attach(StripePaymentMethod.id, { customer: StripeCustomer.id });

        const StripePaymentIntent = await stripe.paymentIntents.create({
            customer: StripeCustomer.id,
            payment_method: StripePaymentMethod.id,
            capture_method: "manual",
            amount: +order.total * 100,
            currency: "usd",
            payment_method_types: ["card"]
        });

        // const StripeCharge = await stripe.charges.create({
        //     customer: StripeCustomer.id,
        //     amount: +order.total * 100,
        //     payment_method: StripePaymentMethod.id,
        //     currency: "usd",
        // })

        return { customer: StripeCustomer, payment_method: StripePaymentMethod, payment_intent: StripePaymentIntent };
        // return { customer: StripeCustomer, payment_method: StripePaymentMethod, charge: StripeCharge };
    };
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
        // const foundCustomer = await this.db.Customer.findByEmail(data.email)

        // Look up products from cart items
        // Make sure we have inventory

        // Format address info
        const address = this._setAddress(data);
        // Format shippingAddress info
        const shippingAddress = this._setShippingAddress(data);
        // Update customer info if anything changed
        // const customer = this._setCustomerInfo(data, address, shippingAddress, foundCustomer);
        const customer = this._setCustomerInfo(data, address, shippingAddress);
        // Format credit card for stripe
        const paymentInfo = this._setPaymentInfo(data);
        // Format order info to go into our Order table
        const order = this._setOrderInfo(data);
        // Submit payment to stripe
        const stripePayment = this._captureStripeTransaction(customer, address, shippingAddress, paymentInfo, order);
        // if the stripe payment is successful, call the save method and pass the data to it

        // if the stripe payment fails, then return a response saying it failed

        // TODO: Temporary code
        // console.log(stripePayment);
        // customer = {
        //     ...customer,
        //     stripe_customer_id: stripePayment.customer.id,
        //     stripe_payment_method_id: stripePayment.payment_method.id,
        // };
        // order = {
        //     ...order,
        //     stripe_customer_id: stripePayment.customer.id,
        //     stripe_payment_method_id: stripePayment.payment_method.id
        //     // stripe_charge_id: await stripePayment.charge.id
        // }
        console.log("order: ", order)
        console.log("customer: ", customer);
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