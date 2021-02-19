'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING(20),
        field: "first_name"
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING(20),
        field: "last_name"
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(20),
        field: "email"
      },
      phone: {
        allowNull: false,
        type: Sequelize.STRING(20),
        field: "phone"
      },
      shippingAddress: {
        allowNull: false,
        type: Sequelize.STRING(20),
        field: "shipping_address"
      },
      billingAddress: {
        allowNull: false,
        type: Sequelize.STRING(20),
        field: "billing_address"
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: "updated_at",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: "deleted_at",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('customers');
  }
};