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
        type: DataTypes.STRING(20),
        field: "shipping_address"
    },
    billingAddress: {
        allowNull: false,
        type: DataTypes.STRING(20),
        field: "billing_address"
    }
})