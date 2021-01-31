// This is the database configuration. 

require("dotenv").config();

module.exports = {
  development: {
    dialect: "sqlite",
    storage: "db.sqlite",
    logging: (str) => console.log(`****************************\n${str}\n****************************`)
  }
}
