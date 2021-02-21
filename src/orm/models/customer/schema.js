"use strict"

module.exports = DataTypes => ({
    firstName: {
        allowNull: false,
        type: DataTypes.STRING(20),
        field: "first_name"
    },
    lastName: {
        allowNull: false,
        type: DataTypes.STRING(20),
        field: "last_name"
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING(20),
        field: "email"
    },
    phone: {
        allowNull: false,
        type: DataTypes.STRING(20),
        field: "phone"
    },
    shippingAddress: {
        allowNull: false,
        type: DataTypes.JSON,
        field: "shipping_address"
    },
    billingAddress: {
        allowNull: false,
        type: DataTypes.JSON,
        field: "billing_address"
    },
    stripeCustomerId: {
        allowNull: false,
        type: DataTypes.STRING(25),
        field: "stripe_customer_id"
    },
    stripePaymentMethodId: {
        allowNull: false,
        type: DataTypes.STRING(25),
        field: "stripe_payment_method_id"
    }
})