const BaseController = require("./BaseController");

class OrderController extends BaseController {
    constructor(model) {
        // Calling the constructor on the BaseController
        super(model);
    }
}

module.exports = OrderController;