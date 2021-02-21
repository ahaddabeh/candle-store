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

    const orders = data.orders.map(order => {
      return {
        id: order.id,
        customer_id: order.customer_id,
        status: order.status,
        total: order.total,
        cart_items: JSON.stringify(order.cart_items)
      }
    })

    const customers = data.customers.map(customer => {
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        shipping_address: customer.shipping_address,
        billing_address: customer.billing_address
      }
    })

    try {
      await queryInterface.bulkInsert("products", products, {})
      await queryInterface.bulkInsert("categories", categories, {})
      await queryInterface.bulkInsert("orders", orders, {})
      await queryInterface.bulkInsert("customers", customers, {})
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
