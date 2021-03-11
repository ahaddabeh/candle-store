const db = require("../models");
const CategoryService = require("./CategoryService");
const CheckoutService = require("./CheckoutService");
const LoginService = require("./LoginService");
module.exports = {
    CategoryService: new CategoryService(db),
    CheckoutService: new CheckoutService(db),
    LoginService: new LoginService(db)
}