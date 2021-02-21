"use strict"

module.exports = DataTypes => ({
    ame: {
        allowNull: false,
        type: DataTypes.STRING(20),
        field: "name"
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
        type: DataTypes.STRING(20),
        field: "shipping_address"
    },
    billingAddress: {
        allowNull: false,
        type: DataTypes.STRING(20),
        field: "billing_address"
    }
})