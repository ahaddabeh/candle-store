require("dotenv").config({});
const Stripe = require("stripe");
const stripe = Stripe(process.env.SK);

class CheckoutService {
    constructor(db) {
        this.db = db;
    }

    // Helper methods
    _sortObjectKeys = _obj => Object.keys(_obj).sort().reduce((obj, key) => {
        obj[key] = _obj[key];
        return obj;
    }, {});


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
    _setNewCustomerInfo = (data, address, shippingAddress) => {
        return {
            // Get rid of underscores and camelcase them
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            shipping_address: shippingAddress,
            billing_address: address,
        }
    }

    _setCustomerInfo = (data, address, shippingAddress, foundCustomer) => {
        let customerData = {
            ...foundCustomer
        };
        const billingAddress = this._sortObjectKeys(address);
        const foundCustomerBillingAddress = this._sortObjectKeys(foundCustomer.address);
        const mailingAddress = this._sortObjectKeys(shippingAddress);
        const foundCustomerMailingAddress = this._sortObjectKeys(foundCustomer.shipping_address);


        if (data.first_name !== foundCustomer.first_name) {
            customerData.first_name = data.first_name
        }
        if (data.last_name !== foundCustomer.last_name) {
            customerData.last_name = data.last_name
        }
        if (data.phone !== foundCustomer.phone) {
            customerData.phone = data.phone
        }
        if (JSON.stringify(mailingAddress) !== JSON.stringify(foundCustomerMailingAddress)) {
            customerData.shipping_address = shippingAddress;
        }
        if (JSON.stringify(billingAddress) !== JSON.stringify(foundCustomerBillingAddress)) {
            customerData.billing_address = address;
        }
        return customerData;
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

    _compareCartItemsWithInventory = (cartItems, onHand) => {
        // Compare both arrays and see
        let failed = []
        for (let i = 0; i < cartItems.length; i++) {
            for (let j = 0; j < onHand.length; j++) {
                if (cartItems[i].id === onHand[j].id) {
                    if (cartItems[i].quantity > onHand[j].quantityOnHand) {
                        failed.push(cartItems[i])
                    }
                }
            }
        }
        if (failed.length > 0) {
            return { cart_items: failed, status: false, message: "Not enough in stock for some of the items..." };
        }
        return { cart_items: failed, status: true, message: "Inventory is fine" };
    }

    _captureStripeTransaction = async (customer, address, shippingAddress, paymentInfo, order) => {
        const stripePaymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: paymentInfo.card_number,
                exp_month: paymentInfo.exp_month,
                exp_year: paymentInfo.exp_year,
                cvc: paymentInfo.cvc
            }
        });


        // TODO: check if this customer was found in the database and has a stripe customer id 
        let stripeCustomer = {};
        if (customer.stripe_customer_id) {
            stripeCustomer = await stripe.customers.update(
                customer.stripe_customer_id,
                {
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
                }
            )
        }
        else {
            stripeCustomer = await stripe.customers.create({
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
        }

        await stripe.paymentMethods.attach(stripePaymentMethod.id, { customer: stripeCustomer.id });

        const stripePaymentIntent = await stripe.paymentIntents.create({
            customer: stripeCustomer.id,
            payment_method: stripePaymentMethod.id,
            capture_method: "manual",
            amount: +order.total * 100,
            currency: "usd",
            payment_method_types: ["card"]
        });

        const confirmed = await stripe.paymentIntents.confirm(stripePaymentIntent.id);
        const response = await stripe.paymentIntents.capture(stripePaymentIntent.id);

        const stripeChargeId = response.charges.data[0].id;
        console.log("Charge", stripeChargeId);


        return { customer: stripeCustomer, payment_method: stripePaymentMethod, payment_intent: stripePaymentIntent, charge: stripeChargeId };
    };


    _save = async (customer, order, found) => {
        try {
            await this.db.sequelize.transaction(async (transaction) => {
                // TODO: if this was a foundCustomer and exists in the database, update instead of create
                if (found) {
                    await this.db.Customer.update(customer, { transaction });
                }
                else {
                    await this.db.Customer.create(customer, { transaction })
                }
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

        // If the customer is found, compare the data in the form to what's in the database and update if anything is different
        // Merge the data from the foundCustomer with the new data from the form submission

        // Look up products from cart items
        const foundProducts = await this.db.Product.findAllWhereIdIn(data.cart_items.map(it => it.id))

        // Make sure we have inventory. Check desired quantity against found products quantity 
        this._compareCartItemsWithInventory(data.cart_items, foundProducts)

        // Format address info
        let address = this._setAddress(data);

        // Format shippingAddress info
        let shippingAddress = this._setShippingAddress(data);

        // Find customer if it exists
        const foundCustomer = await this.db.Customer.findByEmail(data.email)

        // Update customer info if anything changed
        // let customer = this._setCustomerInfo(data, address, shippingAddress, foundCustomer);
        let customer = {};
        if (foundCustomer) {
            customer = this._setCustomerInfo(data, address, shippingAddress, foundCustomer)
        }
        else {
            customer = this._setCustomerInfo(data, address, shippingAddress);
        }

        // Format credit card for stripe
        let paymentInfo = this._setPaymentInfo(data);

        // Format order info to go into our Order table
        let order = this._setOrderInfo(data);

        // Submit payment to stripe
        let stripePayment = await this._captureStripeTransaction(customer, address, shippingAddress, paymentInfo, order);
        // if the stripe payment is successful, call the save method and pass the data to it

        // if the stripe payment fails, then return a response saying it failed

        // TODO: Temporary code
        // console.log(stripePayment);
        customer = {
            ...customer,
            stripe_customer_id: stripePayment.customer.id,
            stripe_payment_method_id: stripePayment.payment_method.id,
        };
        order = {
            ...order,
            stripe_customer_id: stripePayment.customer.id,
            stripe_payment_method_id: stripePayment.payment_method.id,
            stripe_charge_id: await stripePayment.charge,
            invoice_id: Date.now().toString()
        }
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