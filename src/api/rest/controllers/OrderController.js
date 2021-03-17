const BaseController = require("./BaseController");
const authenticateToken = require("../../middleware/auhenticateToken");
class OrderController extends BaseController {
    constructor(model) {
        // Calling the constructor on the BaseController
        super(model);
    }
}

module.exports = OrderController;