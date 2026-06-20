# TaskFlow - Full Stack Project Management Portal

TaskFlow is a premium, state-of-the-art Project Management Portal designed to help users organize, search, filter, and complete project tasks. Built with a modern dark/light mode SaaS aesthetic, real-time input validations, responsive design, and statistics tracking.

## Tech Stack

- **Frontend**: React.js, Axios, Tailwind CSS, React Router v6, Lucide React (Icons).
- **Backend**: Node.js, Express.js, JWT Authentication, Bcrypt.js, Sequelize ORM.
- **Database**: MySQL (Sequelize Schema design).
- **Testing**: Jest, Supertest.

---

## Features

### 1. Modern SaaS Dashboard
- **Statistics Widget**: Real-time display of Total Tasks, Pending Tasks, In Progress Tasks, and Completed Tasks.
- **Task Search**: Instant client-side search across task titles and descriptions.
- **Filters**: Quickly filter tasks by status (All, Pending, In Progress, Completed).
- **Sorting**: Toggle sorting of tasks by creation date (Newest First vs. Oldest First).
- **Pagination**: Easy navigation controls (limit: 6 tasks per page).
- **Dark Mode**: Premium class-based dark mode toggle saved to local storage.
- **Toasts**: Customized notification banners for all async responses.

### 2. Task Management Forms
- Form for adding new tasks with initial status (Pending, In Progress).
- Client-side validation:
  - Title is strictly required.
  - Description must be at least 20 characters.
- Interactive alerts and submit validation (button remains disabled until inputs are valid).

### 3. JWT Authentication & Protected Routes
- Full Register and Login flows.
- Hashed password storage using `bcryptjs`.
- Router protection preventing access to dashboard and add-task views for unauthenticated users.
- Automatic routing redirects for unmatched pages.

---

## Environment Variables

### Backend Configuration (`backend/.env`)
Create a file named `.env` in the `backend/` directory with the following variables:

```env
PORT=5000
DB_HOST=127.0.0.1
DB_NAME=project_portal
DB_USER=root
DB_PASSWORD=
JWT_SECRET=jwt_secret_production_ready_portal_3294823908
NODE_ENV=development
```

### Frontend Configuration (`frontend/.env`)
By default, the frontend resolves to `http://localhost:5000/api`. If you need to customize this, create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Folder Structure

```
project-root/
│
├── backend/
│   ├── config/
│   │   └── db.js            # Mongoose connection
│   ├── controllers/
│   │   ├── authController.js# Registration, Login, Profile
│   │   └── taskController.js# Task CRUD, filters, search, pagination, stats
│   ├── middleware/
│   │   ├── authMiddleware.js# Token verifier
│   │   └── errorMiddleware.js# Error handling
│   ├── models/
│   │   ├── User.js          # User schema & password hashing
│   │   └── Task.js          # Task schema & rules
│   ├── routes/
│   │   ├── authRoutes.js    # Auth mappings
│   │   └── taskRoutes.js    # Task CRUD mappings
│   ├── tests/
│   │   └── task.test.js     # Jest & Supertest specs
│   ├── .env                 # Environment config
│   ├── package.json         # Node scripts & packages
│   └── server.js            # Entry Point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Common/      # Navbar, ProtectedRoute, Spinner
│   │   │   └── Layout.jsx   # Shared layout
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # Authentication state
│   │   │   ├── ThemeContext.jsx# Dark/light mode
│   │   │   └── ToastContext.jsx# Custom toast notification system
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx# Workspace portal
│   │   │   ├── AddTask.jsx  # Task creation form
│   │   │   ├── Login.jsx    # Login screen
│   │   │   └── Register.jsx # Register screen
│   │   ├── services/
│   │   │   └── api.js       # Axios services wrapper
│   │   ├── App.jsx          # Route tree
│   │   ├── index.css        # Tailwind & custom css
│   │   └── main.jsx         # React DOM renderer
│   ├── tailwind.config.js   # Tailwind configurations
│   ├── postcss.config.js    # Postcss configurations
│   ├── vite.config.js       # Vite build setup
│   └── package.json         # Frontend scripts & packages
│
└── README.md                # System documentation
```

---

## API Documentation

All routes (except Auth Login/Register) require an `Authorization: Bearer <JWT_TOKEN>` header.

### Authentication Endpoints
- **POST** `/api/auth/register`
  - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
  - Returns: User details and generated JWT token.
- **POST** `/api/auth/login`
  - Body: `{ "email": "john@example.com", "password": "password123" }`
  - Returns: Authenticated user profile and JWT token.
- **GET** `/api/auth/me`
  - Headers: `Authorization: Bearer <token>`
  - Returns: Current logged-in user profile.

### Task Management Endpoints (Protected)
- **GET** `/api/tasks`
  - Query parameters (optional): `status` (Pending/In Progress/Completed/All), `search` (text), `sort` (asc/desc), `page` (number), `limit` (number).
  - Returns: Paginated list of tasks, current page, total pages, and total task count.
- **POST** `/api/tasks`
  - Body: `{ "title": "Build Login Page", "description": "Create a responsive login page with validation", "status": "Pending" }`
  - Returns: Created task object.
- **PUT** `/api/tasks/:id`
  - Body: `{ "status": "Completed" }` (or custom title/description).
  - Returns: Updated task object.
- **DELETE** `/api/tasks/:id`
  - Returns: `{ "message": "Task removed successfully" }`.
- **GET** `/api/tasks/stats`
  - Returns: Aggregated counts: `{ "total": X, "pending": Y, "inProgress": Z, "completed": W }`.

---

## Installation Steps

### Prerequisites
- Node.js installed on your machine.
- MongoDB (Optional: The application automatically boots an **In-Memory MongoDB Server** if no local MongoDB is detected. If you want permanent persistence, ensure MongoDB is running locally on port `27017` or configure a MongoDB Atlas URI).

### Unified Setup & Run (Recommended)
You can run both the frontend and backend concurrently with a single command from the project root directory:

1. **Install all dependencies** (for root, backend, and frontend):
   ```bash
   npm install
   ```
2. **Start both servers concurrently**:
   ```bash
   npm run dev
   ```
   This will simultaneously start:
   - Backend API server at `http://localhost:5000`
   - Frontend Vite application at `http://localhost:5173`

---

### Separate Setup & Run (Manual)

#### Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install packages and set up `.env`:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```
4. Run tests:
   ```bash
   npm test
   ```

#### Frontend Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Start the React Vite app:
   ```bash
   npm run dev
   ```
4. Open the application at: `http://localhost:5173`.

---

## Assumptions
- Each task belongs to the user who created it, preventing users from seeing, editing, or deleting tasks of other registered users.
- Tasks default to `Pending` status if not specified during creation.
- Dark mode preferences are saved locally on the client browser so they persist across sessions.
