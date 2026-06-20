const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Title is required' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Description is required' },
      len: {
        args: [20, 5000],
        msg: 'Description must be at least 20 characters',
      },
    },
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
    allowNull: false,
    defaultValue: 'Pending',
    validate: {
      isIn: {
        args: [['Pending', 'In Progress', 'Completed']],
        msg: 'Invalid status value',
      },
    },
  },
});

// Define User-Task Associations
User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

module.exports = Task;
