const dotenv = require('dotenv');
// Load environment variables immediately
dotenv.config();

const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // In production, replace with specific domain
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Project Management Portal MySQL API is running...' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Listen to port only if run directly (useful for tests)
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  // Connect to database and synchronize tables
  connectDB().then(() => {
    sequelize.sync({ alter: true }).then(() => {
      console.log('Database tables synchronized successfully.');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }).catch(err => {
      console.error(`Failed to synchronize tables: ${err.message}`);
    });
  });
}

module.exports = app; // Export for unit tests
