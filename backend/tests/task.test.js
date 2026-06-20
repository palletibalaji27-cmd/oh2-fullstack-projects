const request = require('supertest');
const app = require('../server');
const Task = require('../models/Task');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Mock jwt and config/db to prevent actual MySQL connections
jest.mock('jsonwebtoken');

// Mock the model methods to prevent database access
User.findOne = jest.fn();
User.create = jest.fn();
User.findByPk = jest.fn();

Task.findAll = jest.fn();
Task.count = jest.fn();
Task.create = jest.fn();
Task.findByPk = jest.fn();

describe('Task API Endpoints (MySQL/Sequelize)', () => {
  let mockUser;
  let mockToken;
  let mockTask;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      matchPassword: jest.fn().mockResolvedValue(true),
    };

    mockToken = 'mockedjwttoken123456';

    mockTask = {
      id: 10,
      title: 'Build Login Page',
      description: 'Create a responsive login page with validation',
      status: 'Pending',
      userId: 1,
      save: jest.fn().mockResolvedValue({
        id: 10,
        title: 'Build Login Page',
        description: 'Create a responsive login page with validation',
        status: 'Completed',
        userId: 1,
      }),
      destroy: jest.fn().mockResolvedValue({}),
    };
  });

  describe('Auth Endpoints', () => {
    test('POST /api/auth/register - Success', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      });
      jwt.sign.mockReturnValue(mockToken);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.name).toBe('John Doe');
      expect(User.create).toHaveBeenCalledTimes(1);
    });

    test('POST /api/auth/login - Success', async () => {
      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue(mockToken);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe('john@example.com');
    });

    test('POST /api/auth/login - Invalid Credentials', async () => {
      User.findOne.mockResolvedValue(mockUser);
      mockUser.matchPassword.mockResolvedValue(false);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('Invalid email or password');
    });
  });

  describe('Protected Task Endpoints', () => {
    beforeEach(() => {
      // Mock Auth Middleware verifying JWT
      jwt.verify.mockReturnValue({ id: mockUser.id });
      User.findByPk.mockResolvedValue(mockUser);
    });

    test('GET /api/tasks - Retrieve tasks with pagination', async () => {
      Task.findAll.mockResolvedValue([mockTask]);
      Task.count.mockResolvedValue(1);

      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('tasks');
      expect(res.body.tasks).toBeInstanceOf(Array);
      expect(res.body.tasks[0].title).toBe('Build Login Page');
      expect(res.body.totalTasks).toBe(1);
    });

    test('POST /api/tasks - Create task success', async () => {
      Task.create.mockResolvedValue(mockTask);

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          title: 'Build Login Page',
          description: 'Create a responsive login page with validation',
          status: 'Pending',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe('Build Login Page');
      expect(res.body.status).toBe('Pending');
    });

    test('POST /api/tasks - Description validation error (< 20 chars)', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          title: 'Build Login Page',
          description: 'Short desc',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('must be at least 20 characters');
    });

    test('PUT /api/tasks/:id - Update task status', async () => {
      Task.findByPk.mockResolvedValue(mockTask);

      const res = await request(app)
        .put(`/api/tasks/${mockTask.id}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          status: 'Completed',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('Completed');
    });

    test('DELETE /api/tasks/:id - Delete task successfully', async () => {
      Task.findByPk.mockResolvedValue(mockTask);

      const res = await request(app)
        .delete(`/api/tasks/${mockTask.id}`)
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain('Task removed successfully');
    });
  });
});
