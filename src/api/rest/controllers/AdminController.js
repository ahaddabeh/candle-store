const BaseController = require("./BaseController");
const bcrypt = require("bcrypt");

class AdminController extends BaseController {
    constructor(model) {
        // Calling the constructor on the BaseController
        super(model);
    }

    // login = async (req, res) => {
    //     const user = {
    //         username: req.body.username,
    //         password: req.body.password
    //     }
    // }

    create = async (req, res) => {
        try {
            console.log(req.body);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            console.log("This is the salt: ", salt);
            console.log("This is the password: ", hashedPassword);
            const user = {
                ...req.body,
                password: hashedPassword
            }
            res.sendHttpSuccess(await this.model.create(user))
        }
        catch (error) {
            res.sendHttpError(404, `${this.modelName}.create(${req.body})`, error);
        }
    }
}

module.exports = AdminController;