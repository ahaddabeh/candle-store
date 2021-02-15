const db = require("../models");
const CategoryService = require("./CategoryService");
const CheckoutService = require("./CheckoutService");

module.exports = {
    CategoryService: new CategoryService(db),
    CheckoutService: new CheckoutService(db)
}