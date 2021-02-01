const {
    Product,
    Category
} = require("../../../orm/models")

const ProductController = require("./ProductController");

module.exports = {
    // Passing the Product model that we imported into the ProductController
    ProductController: new ProductController(Product)
}