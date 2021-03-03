'use strict';
const {
  Model
} = require('sequelize');
const schema = require("./schema");

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
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
  Customer.init(schema(DataTypes), {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers',
    underscored: true,
    timestamps: true,
    paranoid: true
  });

  const methods = require("./methods")(DataTypes);
  for (const attr in methods) {
    Customer.prototype[attr] = methods[attr];
  }

  const statics = require("./statics")(Customer);
  for (const attr in statics) {
    Customer[attr] = statics[attr];
  }

  return Customer;
};