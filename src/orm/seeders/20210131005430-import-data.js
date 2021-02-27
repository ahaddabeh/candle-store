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
        ingredients: JSON.stringify(product.ingredients),
        quantity_on_hand: product.quantity_on_hand
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
        invoice_id: order.invoice_id,
        status: order.status,
        total: order.total,
        cart_items: JSON.stringify(order.cart_items),
        stripe_charge_id: order.stripe_charge_id,
        stripe_customer_id: order.stripe_customer_id,
        stripe_payment_method_id: order.stripe_payment_method_id,
        card_number: order.card_number
      }
    })

    const customers = data.customers.map(customer => {
      return {
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        shipping_address: JSON.stringify(customer.shipping_address),
        billing_address: JSON.stringify(customer.billing_address),
        stripe_customer_id: customer.stripe_customer_id,
        stripe_payment_method_id: customer.stripe_payment_method_id
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
