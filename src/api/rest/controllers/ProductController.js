const BaseController = require("./BaseController");


/*
categoryId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: "category_id"
    },
    price: {
        allowNull: false,
        type: DataTypes.DOUBLE,
        field: "price"
    },
    description: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "description"
    },
    image: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "image"
    },
    ingredients: {
        allowNull: false,
        type: DataTypes.JSON,
        field: "ingredients",
    },
    title: {
        allowNull: false,
        type: DataTypes.STRING(50),
        field: "title"
    }
*/
class ProductController extends BaseController {
    constructor(model) {
        // Calling the constructor on the BaseController
        super(model);
    }

    delete = async (req, res) => {
        try {
            // Because of our paranoid setting, we have a deleted_at timestamp. We didn't completely delete the instance, we did a "soft delete"
            res.sendHttpSuccess(await this.model.delete(req.params.id));
        } catch (error) {
            res.sendHttpError(404, `${this.modelName}.delete(${req.params.id})`, error);
        }
    }
}

module.exports = ProductController;