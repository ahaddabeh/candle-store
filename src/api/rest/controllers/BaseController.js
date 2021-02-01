class BaseController {
    constructor(model) {
        this.model = model;
        this.modelName = model.name;
    }

    list = async (req, res) => {
        try {
            res.sendHttpSuccess(await this.model.findAll());
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
    create = async (req, res) => res.send({ msg: `POST ${this.modelName} create()`, body: req.body })
    update = async (req, res) => res.send({ msg: `PUT ${this.modelName} update(${req.params.id})`, body: req.body })
    delete = async (req, res) => res.send({ msg: `DELETE ${this.modelName} delete(${req.params.id})`, body: req.body })
}

module.exports = BaseController;