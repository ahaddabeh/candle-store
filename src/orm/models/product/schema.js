"use strict"

module.exports = DataTypes => ({
    categoryId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: "category_id"
    },
    price: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        field: "price"
    },
    description: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "description"
    },
    image: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "image"
    },
    ingredients: {
        allowNull: false,
        type: DataTypes.JSON,
        field: ingredients,
    },
    title: {
        allowNull: false,
        type: DataTypes.STRING(50),
        field: "title"
    },
})