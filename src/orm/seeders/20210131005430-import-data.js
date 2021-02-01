'use strict';

const data = require("../../../tmp/output.json")

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    console.log(data)
    const products = data.products.map(product => {
      return {
        id: product.id,
        category_id: product.categoryId,
        title: product.title,
        price: product.price,
        description: product.description,
        image: product.image,
        ingredients: JSON.stringify(product.ingredients)
      }
    })

    const categories = data.categories.map(category => {
      return {
        id: category.id,
        title: category.title
      }
    })

    try {
      await queryInterface.bulkInsert("products", products, {})
      await queryInterface.bulkInsert("categories", categories, {})
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
