require("dotenv").config({});
const Stripe = require("stripe");
const stripe = Stripe(process.env.SK);
const nodemailer = require("nodemailer");
// const localStorage = require("node-localstorage");
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
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
            shippingAddress: shippingAddress,
            billingAddress: address,
        }
    }

    _setCustomerInfo = (data, address, shippingAddress, foundCustomer) => {
        let customerData = {
            ...foundCustomer,
            billingAddress: address,
            shippingAddress: shippingAddress
        };
        console.log("_setCustomerInfo", customerData);
        const billingAddress = this._sortObjectKeys(address);
        const foundCustomerBillingAddress = this._sortObjectKeys(foundCustomer.billingAddress);
        const mailingAddress = this._sortObjectKeys(shippingAddress);
        const foundCustomerMailingAddress = this._sortObjectKeys(foundCustomer.shippingAddress);


        if (data.first_name !== foundCustomer.firstName) {
            customerData.firstName = data.first_name
        }
        if (data.last_name !== foundCustomer.lastName) {
            customerData.lastName = data.last_name
        }
        if (data.phone !== foundCustomer.phone) {
            customerData.phone = data.phone
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
            cartItems: cartItems,
            status: true,
            cardNumber: lastFourDigits
        }
    }

    _compareCartItemsWithInventory = (cartItems, foundProducts) => {
        // Compare both arrays and see
        let items = [];
        let status = true;
        let message = "Inventory is fine";
        for (let i = 0; i < cartItems.length; i++) {
            for (let j = 0; j < foundProducts.length; j++) {
                if (cartItems[i].id === foundProducts[j].id) {
                    if (cartItems[i].quantity > foundProducts[j].quantityOnHand) {
                        status = false;
                        message = "Not enough in stock for some of the items..."
                        // TODO: Fix up what's returned in the foundProduct part
                        items.push({ ...foundProducts[j], status: status, desiredQuantity: cartItems[i].quantity });
                    }
                    else {
                        items.push({ ...foundProducts[j], quantityOnHand: foundProducts[j].quantityOnHand - cartItems[i].quantity })
                    }
                }
            }
        }
        return { cart_items: items, status, message };
    }

    _captureStripeTransaction = async (customer, address, shippingAddress, paymentInfo, order) => {
        // const stripePaymentMethod = await stripe.paymentMethods.create({
        //     type: 'card',
        //     card: {
        //         number: paymentInfo.card_number,
        //         exp_month: paymentInfo.exp_month,
        //         exp_year: paymentInfo.exp_year,
        //         cvc: paymentInfo.cvc
        //     }
        // });


        // // TODO: check if this customer was found in the database and has a stripe customer id 
        // let stripeCustomer = {};
        // if (customer.stripe_customer_id) {
        //     stripeCustomer = await stripe.customers.update(
        //         customer.stripe_customer_id,
        //         {
        //             name: `${customer.first_name} ${customer.last_name}`,
        //             email: customer.email,
        //             phone: customer.phone,
        //             address: {
        //                 line1: address.address,
        //                 city: address.city,
        //                 state: address.state,
        //                 country: address.country
        //             },
        //             shipping: {
        //                 address: {
        //                     line1: shippingAddress.shipping_address,
        //                     city: shippingAddress.shipping_city,
        //                     country: shippingAddress.shipping_country,
        //                     state: shippingAddress.shipping_state
        //                 },
        //                 name: `${customer.first_name} ${customer.last_name}`
        //             }
        //         }
        //     )
        // }
        // else {
        //     stripeCustomer = await stripe.customers.create({
        //         name: `${customer.first_name} ${customer.last_name}`,
        //         email: customer.email,
        //         phone: customer.phone,
        //         address: {
        //             line1: address.address,
        //             city: address.city,
        //             state: address.state,
        //             country: address.country
        //         },
        //         shipping: {
        //             address: {
        //                 line1: shippingAddress.shipping_address,
        //                 city: shippingAddress.shipping_city,
        //                 country: shippingAddress.shipping_country,
        //                 state: shippingAddress.shipping_state
        //             },
        //             name: `${customer.first_name} ${customer.last_name}`
        //         }

        //     });
        // }

        // await stripe.paymentMethods.attach(stripePaymentMethod.id, { customer: stripeCustomer.id });

        // const stripePaymentIntent = await stripe.paymentIntents.create({
        //     customer: stripeCustomer.id,
        //     payment_method: stripePaymentMethod.id,
        //     capture_method: "manual",
        //     amount: +order.total * 100,
        //     currency: "usd",
        //     payment_method_types: ["card"]
        // });

        const confirmed = await stripe.paymentIntents.confirm(stripePaymentIntent.id);
        const response = await stripe.paymentIntents.capture(stripePaymentIntent.id);

        const stripeChargeId = response.charges.data[0].id;
        console.log("Charge", stripeChargeId);


        return { customer: stripeCustomer, payment_method: stripePaymentMethod, payment_intent: stripePaymentIntent, charge: stripeChargeId };
    };

    // Make stripe payment method function
    _getPaymentMethod = async (paymentInfo) => {
        let result;
        try {
            result = await stripe.paymentMethods.create({
                type: 'card',
                card: {
                    number: paymentInfo.card_number,
                    exp_month: paymentInfo.exp_month,
                    exp_year: paymentInfo.exp_year,
                    cvc: paymentInfo.cvc
                }
            });
            return { result, success: true };
        } catch (error) {
            return { error, success: false };
        }
    }
    _getCustomer = async (customer, shippingAddress, address) => {
        try {
            let result;
            if (customer.stripe_customer_id) {
                result = await stripe.customers.update(
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
                result = await stripe.customers.create({
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
            return { result, success: true };
        } catch (error) {
            return { error, success: false };
        }
    }
    _getPaymentIntent = async (pm, pi, orderTotal) => {
        let result;
        try {
            if (pi) {
                result = pi;
            }
            result = await stripe.paymentIntents.create({
                // customer: stripeCustomer.id,
                payment_method: pm.id,
                capture_method: "manual",
                amount: +orderTotal * 100,
                currency: "usd",
                payment_method_types: ["card"]
            });
            return { result, success: true };
        } catch (error) {
            return { error, success: false };
        }
    }



    _save = async (_customer, order, foundProducts) => {
        let customer = { ..._customer };
        try {
            await this.db.sequelize.transaction(async (transaction) => {
                // TODO: if this was a foundCustomer and exists in the database, update instead of create
                let orderForDb = {};
                if (customer.id && customer.id > 0) {
                    console.log("Updating customer in db")
                    await this.db.Customer.update(customer, { where: { id: customer.id }, transaction });
                    orderForDb = {
                        ...order,
                        customerId: customer.id
                    }
                }
                else {
                    console.log("Creating customer in db")
                    customer = await this.db.Customer.create(customer, { transaction })
                    console.log("Customer in save after created in database:", customer)
                    orderForDb = {
                        ...order,
                        customerId: customer.id
                    }
                }
                await this.db.Order.create(orderForDb, { transaction })
                // Actual customer id (not the stripe customer id) isn't created until it is actually put into the database
                console.log("Attempting to update products");
                await this.db.Product.bulkCreate(foundProducts, { updateOnDuplicate: ["updateAt", "quantityOnHand"], transaction })

                await transaction.afterCommit(async () => {
                    // send email
                    let transporter = nodemailer.createTransport({
                        host: "smtp-mail.outlook.com",
                        secureConnection: false,
                        port: 587,
                        tls: {
                            ciphers: "SSLv3"
                        },
                        auth: {
                            user: process.env.CU,
                            pass: process.env.CP
                            // user: "candlestoreproject23@gmail.com",
                            // pass: ""
                        }
                    });
                    let info = await transporter.sendMail({
                        from: `${process.env.CU}`,
                        to: "candlestoreproject23@gmail.com", // Obviously this is going to be customer.email
                        subject: "Order Confirmation",
                        text: "Thank you for shopping at Lighthouse Candles",
                    })
                    console.log("Message sent: %s", info.messageId)
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
        const foundProducts = JSON.parse(JSON.stringify(await this.db.Product.findAllWhereIdIn(data.cart_items.map(it => it.id))));

        // Make sure we have inventory. Check desired quantity against found products quantity 
        const cartComparison = this._compareCartItemsWithInventory(data.cart_items, foundProducts)
        // if (cartComparison.status === false) {
        //     // TODO: return an object telling which items are not in stock/dont meet inventory
        //     return cartComparison.cart_items.filter(item => {
        //         item.status === false;
        //     });
        // }

        if (!cartComparison.status) {
            // console.log("Cart comparison");
            return cartComparison;
        }

        // TODO: Check to see if card is valid here.
        let paymentInfo;
        try {
            paymentInfo = this._setPaymentInfo(data);
        } catch (error) {
            return { error, message: "Credit card failed" }
        }

        // Format order info to go into our Order table
        let order = this._setOrderInfo(data);
        const paymentMethod = await this._getPaymentMethod(paymentInfo);
        if (!paymentMethod.success) {
            return paymentMethod.error;
        }
        // console.log("Bout to check local storage");
        // if (localStorage.getItem("paymentIntent")) {
        //     console.log("Probably broke here");
        //     data = { ...data, paymentIntent: localStorage.getItem("paymentIntent") };
        // }
        // Check to see if we have a payment intent in our data object or create a new one
        const paymentIntent = await this._getPaymentIntent(paymentMethod, data.paymentIntent, order.total);
        console.log(paymentIntent);
        // localStorage.setItem("paymentIntent", paymentIntent.id);
        if (!paymentIntent.success) {
            // Return the error
            console.log("This motherfucker failed");
            return paymentIntent.error;
        }

        // Format address info
        let address = this._setAddress(data);

        // Format shippingAddress info
        let shippingAddress = this._setShippingAddress(data);


        // Find customer if it exists
        const foundCustomer = JSON.parse(JSON.stringify(await this.db.Customer.findByEmail(data.email)));
        console.log("data email: ", data.email);
        console.log("Found customer:", foundCustomer);
        // const foundCustomer = await this.db.Customer.findOne({ where: { email: data.email } });
        // Update customer info if anything changed
        let customer = {};
        if (foundCustomer) {
            console.log("The customer is in the database from before")
            customer = this._setCustomerInfo(data, address, shippingAddress, foundCustomer)
        }
        else {
            console.log("Customer not found; must create new customer")
            customer = this._setNewCustomerInfo(data, address, shippingAddress);
        }

        const stripeCustomer = await this._getCustomer(customer, shippingAddress, address);

        // Format credit card for stripe


        // Submit payment to stripe
        // let stripePayment = await this._captureStripeTransaction(customer, address, shippingAddress, paymentInfo, order);

        const confirmed = await stripe.paymentIntents.confirm(paymentIntent.id);
        const response = await stripe.paymentIntents.capture(paymentIntent.id);

        const stripeChargeId = response.charges.data[0].id;

        // TODO: if the stripe payment is successful, call the save method and pass the data to it

        // TODO: if the stripe payment fails, then return a response saying it failed

        // TODO: Temporary code
        // console.log(stripePayment);
        customer = {
            ...customer,
            stripeCustomerId: stripeCustomer.customer.id,
            stripePaymentMethodId: paymentMethod.payment_method.id,
        };
        order = {
            ...order,
            stripeCustomerId: stripeC.customer.id,
            stripePaymentMethodId: stripePayment.payment_method.id,
            stripeChargeId: stripeChargeId.charge,
            invoiceId: Date.now().toString()
        }



        // console.log("order: ", order)
        // console.log("customer: ", customer);
        return this._save(customer, order, cartComparison.cart_items);
    }
}

module.exports = CheckoutService;