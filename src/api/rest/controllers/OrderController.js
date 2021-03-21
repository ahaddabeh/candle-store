const BaseController = require("./BaseController");
const authenticateToken = require("../../middleware/auhenticateToken");
class OrderController extends BaseController {
    constructor(model) {
        // Calling the constructor on the BaseController
        super(model);
    }
    // List function from BaseController not working for orders so have to improvise with this for now
    // list = async (req, res) => {
    //     try {
    //         res.sendHttpSuccess(await this.model.findAll());
    //     } catch (error) {
    //         res.sendHttpError(404, `${this.modelName}.list()`, error);
    //     }
    // }
}

module.exports = OrderController;