// models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("blogdb", "postgres", "123456789", {
  host: "localhost",
  port: 5433,
  dialect: "postgres",
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require("./user")(sequelize, DataTypes);
db.Post = require("./post")(sequelize, DataTypes);

// Setup associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
