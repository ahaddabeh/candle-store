'use strict';
const {
  Model
} = require('sequelize');
const schema = require("./schema");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Order.init(schema(DataTypes), {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    underscored: true,
    timestamps: true,
    paranoid: true
  });

  const methods = require("./methods")(DataTypes);
  for (const attr in methods) {
    Order.prototype[attr] = methods[attr];
  }

  const statics = require("./statics")(Order);
  for (const attr in statics) {
    Order[attr] = statics[attr];
  }

  return Order;
};