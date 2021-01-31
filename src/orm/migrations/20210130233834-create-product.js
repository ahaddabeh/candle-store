'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      categoryId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        field: "category_id"
      },
      price: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        field: "price"
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING,
        field: "description"
      },
      image: {
        allowNull: false,
        type: Sequelize.STRING,
        field: "image"
      },
      ingredients: {
        allowNull: false,
        type: Sequelize.JSON,
        field: "ingredients",
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(50),
        field: "title"
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
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  }
};