'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

const isDir = _path => fs.existsSync(_path) && fs.lstatSync(_path).isDirectory();
const resolveModelPath = file => path.resolve(path.join(__dirname, file));

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// this replaces the code above
fs.readdirSync(__dirname)
  .filter(it => {
    let temp = resolveModelPath(it);
    return isDir(temp);
  })
  .forEach(file => {
    const model = require(resolveModelPath(file))(sequelize, Sequelize.DataTypes);
    // Making an instance of each model
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
  if (db[modelName].addScopes) {
    db[modelName].addScopes(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
