const {
    Product,
    Category,
    Order,
    Customer,
    Admin
} = require("../../../orm/models")

const ProductController = require("./ProductController");
const CategoryController = require("./CategoryController");
const ShoppingCartController = require("./ShoppingCartController");
const OrderController = require("./OrderController");
const CustomerController = require("./CustomerController");
const AdminController = require("./AdminController");
module.exports = {
    // Passing the Product model that we imported into the ProductController
    ProductController: new ProductController(Product),
    CategoryController: new CategoryController(Category),
    ShoppingCartController: new ShoppingCartController(),
    OrderController: new OrderController(Order),
    CustomerController: new CustomerController(Customer),
    AdminController: new AdminController(Admin)
}