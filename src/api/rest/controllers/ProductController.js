const BaseController = require("./BaseController");

class ProductController extends BaseController {
    constructor(model) {
        // Calling the constructor on the BaseController
        super(model);
    }
}

module.exports = ProductController;