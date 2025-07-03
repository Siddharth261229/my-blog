// models/user.js
// models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING, // For local login
      allowNull: true, // Allow null for Google OAuth users
    },
    googleId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
  });
  User.associate = (models) => {
    User.hasMany(models.Post);
  };

  return User;
};
