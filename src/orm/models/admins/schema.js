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
    username: {
        allowNull: false,
        type: DataTypes.STRING(20),
        field: "username"
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING(40),
        field: "password"
    }
})