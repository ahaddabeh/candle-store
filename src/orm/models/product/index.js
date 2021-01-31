'use strict';
const {
  Model
} = require('sequelize');
const schema = require("./schema");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static addScopes(models) {
      // define scopes here
    }
  };
  Product.init(schema(DataTypes), {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    underscored: true,
    timestamps: true,
    paranoid: true
  });

  const methods = require("./methods");
  for (const attr in methods) {
    Product.prototype[attr] = methods[attr];
  }

  const statics = require("./statics");
  for (const attr in statics) {
    Product[attr] = statics[attr];
  }

  return Product;
};