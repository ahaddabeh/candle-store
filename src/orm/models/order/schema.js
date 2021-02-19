"use strict"

const { DataTypes } = require("sequelize/types")

module.exports = ({
    customerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: "customer_id"
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
    }
})