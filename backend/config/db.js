const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbName = process.env.DB_NAME || 'project_portal';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || '127.0.0.1';

// Create the sequelize instance
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql',
  logging: false,
});

const connectDB = async () => {
  try {
    // 1. Establish raw connection to ensure the database exists
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();

    // 2. Authenticate the Sequelize connection
    await sequelize.authenticate();
    console.log('MySQL Database Connected successfully.');
  } catch (error) {
    console.error(`MySQL connection error: ${error.message}`);
    console.error('Please make sure MySQL is running in your XAMPP Control Panel.');
  }
};

module.exports = { sequelize, connectDB };
