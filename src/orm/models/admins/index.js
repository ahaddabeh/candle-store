'use strict';
const {
  Model
} = require('sequelize');
const schema = require("./schema");

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static addScopes(models) {
      // define association here
    }
  };
  Admin.init(schema(DataTypes), {
    sequelize,
    modelName: 'Admin',
    tableName: 'admins',
    underscored: true,
    timestamps: true,
    paranoid: true
  });

  const methods = require("./methods");
  for (const attr in methods) {
    Admin.prototype[attr] = methods[attr];
  }

  const statics = require("./statics")(Admin);
  for (const attr in statics) {
    Admin[attr] = statics[attr];
  }
  return Admin;
};