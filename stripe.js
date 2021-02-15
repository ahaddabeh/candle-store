require("dotenv").config({});
const Stripe = require("stripe");
const stripe = Stripe(process.env.SK);

const run = async () => {
    const customer = await stripe.customers.create({
        name: 'Alaa Haddabeh',
        email: 'testing@example.com',
        description: 'My First Test Customer (created for API docs)',
    });
    /*
    {
  "id": "cus_IwJvPgRjAE7HWs",
  "object": "customer",
  "address": null,
  "balance": 0,
  "created": 1613234882,
  "currency": "usd",
  "default_source": null,
  "delinquent": false,
  "description": "My First Test Customer (created for API docs)",
  "discount": null,
  "email": null,
  "invoice_prefix": "36C0CA2",
  "invoice_settings": {
    "custom_fields": null,
    "default_payment_method": null,
    "footer": null
  },
  "livemode": false,
  "metadata": {},
  "name": null,
  "next_invoice_sequence": 1,
  "phone": null,
  "preferred_locales": [],
  "shipping": null,
  "tax_exempt": "none"
}
    */

    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
            number: '4242424242424242',
            exp_month: 2,
            exp_year: 2022,
            cvc: '314',
        },
    });

    /*
{
  "id": "pm_1IKRHr2eZvKYlo2CkuWaDL9A",
  "object": "payment_method",
  "billing_details": {
    "address": {
      "city": null,
      "country": null,
      "line1": null,
      "line2": null,
      "postal_code": null,
      "state": null
    },
    "email": null,
    "name": null,
    "phone": null
  },
  "card": {
    "brand": "visa",
    "checks": {
      "address_line1_check": null,
      "address_postal_code_check": null,
      "cvc_check": "pass"
    },
    "country": "US",
    "exp_month": 8,
    "exp_year": 2022,
    "fingerprint": "Xt5EWLLDS7FJjR1c",
    "funding": "credit",
    "generated_from": null,
    "last4": "4242",
    "networks": {
      "available": [
        "visa"
      ],
      "preferred": null
    },
    "three_d_secure_usage": {
      "supported": true
    },
    "wallet": null
  },
  "created": 1613234883,
  "customer": null,
  "livemode": false,
  "metadata": {},
  "type": "card"
}
    */

    await stripe.paymentMethods.attach(paymentMethod.id, { customer: customer.id })

    const paymentIntent = await stripe.paymentIntents.create({
        customer: customer.id,
        payment_method: paymentMethod.id,
        capture_method: "manual",
        amount: 20 * 100,
        currency: 'usd',
        payment_method_types: ['card'],
    });
    // This is gonna be the payment intent response object
    /*
    {
  "id": "pi_1DlITH2eZvKYlo2CuM28qGnc",
  "object": "payment_intent",
  "amount": 2000,
  "amount_capturable": 0,
  "amount_received": 0,
  "application": null,
  "application_fee_amount": null,
  "canceled_at": null,
  "cancellation_reason": null,
  "capture_method": "automatic",
  "charges": {
    "object": "list",
    "data": [],
    "has_more": false,
    "url": "/v1/charges?payment_intent=pi_1DlITH2eZvKYlo2CuM28qGnc"
  },
  "client_secret": "pi_1DlITH2eZvKYlo2CuM28qGnc_secret_OAnP5wnZF5uCNLqRiBqishuug",
  "confirmation_method": "automatic",
  "created": 1545754171,
  "currency": "usd",
  "customer": null,
  "description": null,
  "invoice": null,
  "last_payment_error": null,
  "livemode": false,
  "metadata": {
    "order_id": "673567adsfsadfadsf"
  },
  "next_action": null,
  "on_behalf_of": null,
  "payment_method": null,
  "payment_method_options": {},
  "payment_method_types": [
    "card"
  ],
  "receipt_email": null,
  "review": null,
  "setup_future_usage": null,
  "shipping": null,
  "statement_descriptor": null,
  "statement_descriptor_suffix": null,
  "status": "requires_payment_method",
  "transfer_data": null,
  "transfer_group": null
}
    */

    // process credit card payment and all the stuff from above
    const confirmed = await stripe.paymentIntents.confirm(paymentIntent.id);
    console.log(confirmed);
    const response = await stripe.paymentIntents.capture(paymentIntent.id);
    console.log(response);
}

run();