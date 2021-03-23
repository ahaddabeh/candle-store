require("dotenv").config({});
const Stripe = require("stripe");
const stripe = Stripe(process.env.SK);
const nodemailer = require("nodemailer");
const store = require('store');
const storeEngine = require("store/src/store-engine");
// const cookieParser = require('cookie-parser')
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
            else {
                result = await stripe.paymentIntents.create({
                    // customer: stripeCustomer.id,
                    payment_method: pm,
                    capture_method: "manual",
                    amount: +orderTotal * 100,
                    currency: "usd",
                    payment_method_types: ["card"]
                });
            }
            return { result, success: true };
        } catch (error) {
            return { error, success: false };
        }
    }



    _save = async (_customer, order, foundProducts) => {
        let customer = { ..._customer };
        try {
            await this.db.sequelize.transaction(async (transaction) => {
                // if this was a foundCustomer and exists in the database, update instead of create
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
            return cartComparison;
        }

        // Check to see if card is valid here.
        let paymentInfo;
        try {
            paymentInfo = this._setPaymentInfo(data);
        } catch (error) {
            return { error, message: "Credit card failed" }
        }

        // Format order info to go into our Order table
        let order = this._setOrderInfo(data);

        // Create paymentMethod here. Card verification will be done here
        const paymentMethod = await this._getPaymentMethod(paymentInfo);
        if (!paymentMethod.success) {
            return paymentMethod.error;
        }

        // Checking to see if payment_intent already exists in local storage
        // console.log("Chceking local storage");
        if (store.get("payment_intent")) {
            data = { ...data, payment_intent: store.get("payment_intent") };
        }

        // Check to see if we have a payment intent in our data object or create a new one
        const paymentIntent = await this._getPaymentIntent(paymentMethod.result.id, data.payment_intent, order.total);
        if (!paymentIntent.success) {
            // Return the error
            return paymentIntent.error;
        }

        // Storing the payment_intent here in case of any mistakes made by the customer later
        store.set("payment_intent", { ...paymentIntent.result });

        // Format address info
        let address = this._setAddress(data);

        // Format shippingAddress info
        let shippingAddress = this._setShippingAddress(data);


        // Find customer if it exists
        const foundCustomer = JSON.parse(JSON.stringify(await this.db.Customer.findByEmail(data.email)));
        let customer = {};
        if (foundCustomer) {
            console.log("The customer is in the database from before")
            customer = this._setCustomerInfo(data, address, shippingAddress, foundCustomer)
        }
        else {
            console.log("Customer not found; must create new customer")
            customer = this._setNewCustomerInfo(data, address, shippingAddress);
        }

        // Creating the customer info for stripe
        const stripeCustomer = await this._getCustomer(customer, shippingAddress, address);

        // const confirmed = await stripe.paymentIntents.confirm(paymentIntent.result.id);
        // const response = await stripe.paymentIntents.capture(paymentIntent.result.id);
        // const stripeChargeId = response.charges.data[0].id;
        // console.log("charge info: ", JSON.parse(JSON.stringify(stripeChargeId)));

        customer = {
            ...customer,
            stripeCustomerId: stripeCustomer.result.id,
            stripePaymentMethodId: paymentMethod.result.id,
        };
        order = {
            ...order,
            stripeCustomerId: stripeCustomer.result.id,
            stripePaymentMethodId: paymentMethod.result.id,
            // stripeChargeId: stripeChargeId,
            invoiceId: Date.now().toString()
        }

        // Sending customer info and order info to the database. If it's successful, payment will be confirmed as well 
        const finalSubmit = await this._save(customer, order, cartComparison.cart_items);
        if (finalSubmit.success) {
            // confirming and capturing after customer and order are added to database
            await stripe.paymentIntents.confirm(paymentIntent.result.id);
            await stripe.paymentIntents.capture(paymentIntent.result.id);
            // removing from local storage since it had to have been successful
            store.clearAll();
            return finalSubmit;
        }
        console.log("Payment failed and should not have been confirmed:");
        return finalSubmit;
    }
}

module.exports = CheckoutService;