class BaseController {
    constructor(model) {
        this.model = model;
        this.modelName = model.name;
    }

    list = async (req, res) => res.sendHttpSuccess({}, `GET ${this.modelName} list()`)
    getById = async (req, res) => res.send({ msg: `GET ${this.modelName} getById(${req.params.id})` })
    create = async (req, res) => res.send({ msg: `POST ${this.modelName} create()`, body: req.body })
    update = async (req, res) => res.send({ msg: `PUT ${this.modelName} update(${req.params.id})`, body: req.body })
    delete = async (req, res) => res.send({ msg: `DELETE ${this.modelName} delete(${req.params.id})`, body: req.body })
}

module.exports = BaseController;