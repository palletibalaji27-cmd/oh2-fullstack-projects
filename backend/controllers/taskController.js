const Task = require('../models/Task');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// Helper to format task for frontend (_id compatibility)
const formatTask = (task) => {
  if (!task) return null;
  return {
    _id: task.id,
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    userId: task.userId,
  };
};

// @desc    Get all tasks for user with filter, search, sort, pagination
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, search, sort, page = 1, limit = 6 } = req.query;

    // Build where object
    const where = { userId: req.user.id };

    // Filter by status if specified and not 'All'
    if (status && status !== 'All') {
      where.status = status;
    }

    // Search query in title or description
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    // Sorting order
    let order = [['createdAt', 'DESC']]; // default
    if (sort === 'asc') {
      order = [['createdAt', 'ASC']];
    } else if (sort === 'desc') {
      order = [['createdAt', 'DESC']];
    }

    // Pagination numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offsetNum = (pageNum - 1) * limitNum;

    // Execute query
    const tasks = await Task.findAll({
      where,
      order,
      limit: limitNum,
      offset: offsetNum,
    });

    // Get total matching tasks count
    const totalTasks = await Task.count({ where });
    const pages = Math.ceil(totalTasks / limitNum);

    // Format tasks for frontend
    const formattedTasks = tasks.map(formatTask);

    res.json({
      tasks: formattedTasks,
      page: pageNum,
      pages,
      totalTasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      res.status(400);
      throw new Error('Title is required');
    }

    if (!description) {
      res.status(400);
      throw new Error('Description is required');
    }

    if (description.length < 20) {
      res.status(400);
      throw new Error('Description must be at least 20 characters');
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'Pending',
      userId: req.user.id,
    });

    res.status(201).json(formatTask(task));
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    let task = await Task.findByPk(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check authorization
    if (task.userId.toString() !== req.user.id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    // Apply updates if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) {
      if (description.length < 20) {
        res.status(400);
        throw new Error('Description must be at least 20 characters');
      }
      task.description = description;
    }
    if (status !== undefined) {
      const validStatuses = ['Pending', 'In Progress', 'Completed'];
      if (!validStatuses.includes(status)) {
        res.status(400);
        throw new Error('Invalid status value');
      }
      task.status = status;
    }

    await task.save();
    res.json(formatTask(task));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check authorization
    if (task.userId.toString() !== req.user.id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this task');
    }

    await task.destroy();
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task stats for dashboard
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const stats = await Task.findAll({
      where: { userId: req.user.id },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
    });

    const formattedStats = {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
    };

    stats.forEach((item) => {
      const statusKey = item.getDataValue('status');
      const count = parseInt(item.getDataValue('count')) || 0;
      formattedStats.total += count;

      if (statusKey === 'Pending') {
        formattedStats.pending = count;
      } else if (statusKey === 'In Progress') {
        formattedStats.inProgress = count;
      } else if (statusKey === 'Completed') {
        formattedStats.completed = count;
      }
    });

    res.json(formattedStats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
