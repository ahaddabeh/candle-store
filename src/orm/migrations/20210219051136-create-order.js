'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        field: "customer_id"
      },
      total: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        field: "total"
      },
      cartItems: {
        allowNull: false,
        type: Sequelize.JSON,
        field: "cart_items"
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        field: "status"
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
    await queryInterface.dropTable('orders');
  }
};