"use strict"

module.exports = DataTypes => ({
    customerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: "customer_id"
    },
    invoiceId: {
        allowNull: true,
        type: DataTypes.STRING(25),
        field: "invoice_id"
    },
    total: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "total"
    },
    cartItems: {
        allowNull: false,
        type: DataTypes.JSON,
        field: "cart_items"
    },
    status: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        field: "status"
    },
    // stripeChargeId: {
    //     allowNull: false,
    //     type: DataTypes.STRING(25),
    //     field: "stripe_charge_id"
    // },
    stripeCustomerId: {
        allowNull: false,
        type: DataTypes.STRING(25),
        field: "stripe_customer_id"
    },
    stripePaymentMethodId: {
        allowNull: false,
        type: DataTypes.STRING(25),
        field: "stripe_payment_method_id"
    },
    cardNumber: {
        allowNull: false,
        type: DataTypes.STRING(4),
        field: "card_number"
    }

})