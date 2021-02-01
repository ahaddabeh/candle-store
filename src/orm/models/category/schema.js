"use strict"

module.exports = DataTypes => ({
    title: {
        allowNull: false,
        type: DataTypes.STRING(20),
        field: "title"
    }
})