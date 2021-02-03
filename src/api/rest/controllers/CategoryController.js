const BaseController = require("./BaseController");
const { CategoryService } = require("../../../orm/services"); // Gets index file by default. It's implied

class CategoryController extends BaseController {
    constructor(model) {
        super(model)
    }
    // create = async (req, res) => {
    //     try {
    //         // We're gonna have to override this one in the ProductController and any other controllers since they're all gonna be different
    //         res.sendHttpSuccess(await this.model.create(req.body));
    //     } catch (error) {
    //         res.sendHttpError(404, `${this.modelName}.create(${req.body})`, error);
    //     }
    // }
    // update = async (req, res) => {
    //     try {
    //         // Overriding the update function in the BaseController
    //         // Ask hatem why it isn't printing the success response
    //         res.sendHttpSuccess(await this.model.update(req.body,
    //             {
    //                 where: {
    //                     id: req.params.id
    //                 }
    //             }));
    //     } catch (error) {
    //         res.sendHttpError(404, `${this.modelName}.update(${req.body})`, error);
    //     }
    // }
    delete = async (req, res) => {
        try {
            const result = await CategoryService.delete(+req.params.id);
            if (result.success) {
                res.sendHttpSuccess(result);
            }
            else {
                res.sendHttpError(409, `${this.modelName}.delete(${req.params.id})`, new Error("Record can't be deleted"));
            }
        } catch (error) {
            res.sendHttpError(404, `${this.modelName}.delete(${req.params.id})`, error);
        }
    }
}

module.exports = CategoryController;