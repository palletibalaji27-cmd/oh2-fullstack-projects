const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add a name' },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'User already exists with this email' },
    validate: {
      isEmail: { msg: 'Please add a valid email' },
      notEmpty: { msg: 'Please add an email' },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: 'Password must be at least 6 characters',
      },
    },
  },
});

// Hook to hash password before creation
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// Instance method to check password
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
