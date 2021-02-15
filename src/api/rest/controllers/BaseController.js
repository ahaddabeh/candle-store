class BaseController {
    constructor(model) {
        this.model = model;
        this.modelName = model.name;
    }

    // list = async (req, res) => {
    //     try {
    //         res.sendHttpSuccess(await this.model.findAll());
    //     } catch (error) {
    //         res.sendHttpError(404, `${this.modelName}.list()`, error);
    //     }
    // }

    list = async (req, res) => {
        try {
            const where = {};
            if (req.query.cid) {
                where.categoryId = req.query.cid
            }
            const options = {
                limit: req.query.size || null,
                where: where
            }
            res.sendHttpSuccess(await this.model.findWithCount(req.query.page, options))
        } catch (error) {
            res.sendHttpError(404, `${this.modelName}.list()`, error);
        }
    }

    getById = async (req, res) => {
        try {
            res.sendHttpSuccess(await this.model.findByPk(req.params.id));
        } catch (error) {
            res.sendHttpError(404, `${this.modelName}.getById()`, error);
        }
    }
    create = async (req, res) => {
        try {
            // We're gonna have to override this one in the ProductController and any other controllers since they're all gonna be different
            res.sendHttpSuccess(await this.model.create(req.body));
        } catch (error) {
            res.sendHttpError(404, `${this.modelName}.create(${req.body})`, error);
        }
    }
    update = async (req, res) => {
        try {
            // Overriding the update function in the BaseController
            // Ask hatem why it isn't printing the success response
            res.sendHttpSuccess(await this.model.update(req.body,
                {
                    where: {
                        id: req.params.id
                    }
                }));
        } catch (error) {
            res.sendHttpError(404, `${this.modelName}.update(${req.body})`, error);
        }
    }
    delete = async (req, res) => {
        try {
            // Because of our paranoid setting, we have a deleted_at timestamp. We didn't completely delete the instance, we did a "soft delete"
            res.sendHttpSuccess(await this.model.destroy({
                where: {
                    id: req.params.id
                }
            }));
        } catch (error) {
            res.sendHttpError(404, `${this.modelName}.delete(${req.params.id})`, error);
        }
    }

    // create = async (req, res) => res.send({ msg: `POST ${this.modelName} create()`, body: req.body })
    // update = async (req, res) => res.send({ msg: `PUT ${this.modelName} update(${req.params.id})`, body: req.body })
    // delete = async (req, res) => res.send({ msg: `DELETE ${this.modelName} delete(${req.params.id})`, body: req.body })
}

module.exports = BaseController;