# Task Manager - MERN Stack Application

A full-stack web application built with MongoDB, Express, React, and Node.js. This application provides user authentication and a task management dashboard with CRUD operations.

## Features

- **User Authentication**
  - User registration and login
  - JWT token-based authentication
  - Protected routes
  - Logout functionality

- **Task Management**
  - CRUD operations for tasks
  - Task status (Pending/Completed)
  - Search and filter tasks
  - Responsive design
  - Optimistic UI updates

- **UI/UX**
  - Tailwind CSS styling
  - Loading states
  - Toast notifications
  - Form validation

## Project Structure

```
company1/
├── server/                 # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── models/        # MongoDB models (User, Task)
│   │   ├── routes/        # API routes (auth, tasks)
│   │   ├── controllers/   # Route controllers
│   │   ├── services/      # Business logic layer
│   │   ├── middleware/    # Auth middleware
│   │   ├── types/         # TypeScript types
│   │   └── server.ts      # Express server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── client/                 # Frontend (React + Vite + TypeScript)
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/         # Page components (Login, Register, Dashboard)
    │   ├── context/       # React Context (AuthContext)
    │   ├── utils/         # Utility functions (axios config)
    │   ├── types/         # TypeScript types
    │   ├── App.tsx        # Main app component
    │   └── main.tsx       # React entry point
    ├── package.json
    └── vite.config.ts
```

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **BCrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## Installation & Setup

### 1. Clone the Repository

```bash
cd /Users/nikhilsagar/Desktop/Projects/Task\ Manager
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# For Windows/Linux:
cp .env.example .env

# For macOS:
cp .env.example .env

# Edit .env file with your configuration:
# PORT=5050
# MONGODB_URI=mongodb://localhost:27017/taskmanager
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
# NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Navigate to client directory (from project root)
cd ../client

# Install dependencies
npm install
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Start MongoDB service from Services panel
```

Or use MongoDB Atlas (cloud):
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Update `MONGODB_URI` in `server/.env`

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
The server will start on `http://localhost:5050`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
The client will start on `http://localhost:3000`

### Production Build

**Backend:**
```bash
cd server
npm run build
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/profile` - Get user profile (Protected)
  - Headers: `Authorization: Bearer <token>`

### Tasks (All Protected - Require JWT Token)
- `GET /api/tasks` - Get all tasks for logged-in user
  - Query params: `?status=Pending&search=task title`
  
- `POST /api/tasks` - Create a new task
  ```json
  {
    "title": "Complete assignment",
    "description": "Finish the take-home project",
    "status": "Pending"
  }
  ```

- `GET /api/tasks/:id` - Get a specific task

- `PUT /api/tasks/:id` - Update a task
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "status": "Completed"
  }
  ```

- `DELETE /api/tasks/:id` - Delete a task

## Authentication Flow

1. User registers or logs in
2. Server returns a JWT token
3. Token is stored in `sessionStorage`
4. Axios interceptor automatically attaches token to all API requests
5. Protected routes verify token via middleware
6. On token expiration or invalid token, user is redirected to login

## Key Features

### Optimistic UI Updates
- Tasks are immediately updated/deleted in the UI
- API call happens in the background
- On error, changes are reverted

### Protected Routes
- `ProtectedRoute` component checks authentication
- Redirects to `/login` if not authenticated
- Shows loading state while checking auth

### Error Handling
- Try-catch blocks in all async operations
- Toast notifications for user feedback
- Graceful error messages

## Testing

1. **Register a new user:**
   - Navigate to `/register`
   - Fill in name, email, and password
   - Submit the form

2. **Login:**
   - Navigate to `/login`
   - Enter email and password
   - You'll be redirected to dashboard

3. **Create a task:**
   - Click "Add Task" button
   - Fill in title and description
   - Select status
   - Click "Create Task"

4. **Manage tasks:**
   - Toggle status (Pending ↔ Completed)
   - Edit task details
   - Delete tasks
   - Search and filter tasks

## Environment Variables

### Server (.env)
```
PORT=5050
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod --version`
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change `PORT` in `server/.env`
- Update proxy in `client/vite.config.ts` if needed

### CORS Errors
- Ensure backend CORS is configured (already done)
- Check that frontend proxy is set correctly

### JWT Token Issues
- Clear `sessionStorage` and login again
- Check `JWT_SECRET` in `.env`

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## License

This project is created for a take-home assignment.

## 👤 Author

Built as a scalable MERN stack application demonstration.

---

For scalability considerations, see [SCALABILITY.md](./SCALABILITY.md)

