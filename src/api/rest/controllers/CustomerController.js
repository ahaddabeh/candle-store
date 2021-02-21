const BaseController = require("./BaseController");

class CustomerController extends BaseController {
    constructor(model) {
        // Calling the constructor on the BaseController
        super(model);
    }
}

module.exports = CustomerController;