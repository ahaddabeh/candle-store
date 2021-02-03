const db = require("../models");
const CategoryService = require("./CategoryService");

module.exports = {
    CategoryService: new CategoryService(db)
}