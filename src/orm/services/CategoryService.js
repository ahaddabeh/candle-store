class CategoryService {
    constructor(db) {
        this.db = db
    }

    delete = async (id) => {
        console.log(id)
        // Query products with this category id
        const productCount = await this.db.Product.count({
            where: {
                categoryId: id
            }
        })
        console.log(productCount)
        // Need to check if any products are using this category
        if (productCount > 0) {
            return { success: false, msg: `CategoryId ${id} used by ${productCount} product(s)` }
        }
        // If no products using the category, delete the category
        await this.db.Category.destroy({ where: { id: id } })
        return { success: true, msg: `CategoryId ${id} deleted successfully` }
    }
}

module.exports = CategoryService;