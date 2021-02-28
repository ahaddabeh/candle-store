const globalStatics = require("../../common/statics");
module.exports = (model) => ({
    ...globalStatics(model),
    // These are static methods that get added to our model. 
    delete: async (id) => {
        return await model.destroy({ where: { id: id } })
    },

    findAllWhereIdIn: async (ids) => {
        // sequelize knows that we're implying to find id in ids
        return await model.findAll({ where: { id: ids } })
    }

    // updateProductQuantities: async (cart_items) => {
    //     let product = {}
    //     for(let i = 0; i < cart_items.length; i++) {
    //         product = await model.findOne({where: {id: cart_items[i].id}})
    //         product.quantity_on_hand -= cart_items[i].quantity;

    //     }
    // }
})