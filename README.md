# Task Management System (Kanban Based)

A full-stack task management application with user authentication and a Kanban-style task board. Built with Node.js/Express backend and React frontend.

## Features

- **User Authentication**
  - User registration and login
  - JWT-based authentication
  - User profile management (view, update, delete)

- **Task Management**
  - Full CRUD operations for tasks
  - Tasks include: title, description, status, due date, and creation timestamp
  - User-specific tasks (users can only see and manage their own tasks)
  - Filter tasks by status

- **Kanban Board**
  - Three columns: Pending, In Progress, Completed
  - Drag and drop functionality to move tasks between columns
  - Real-time status updates
  - Task cards display title, description, and due date
  - Visual indicators for overdue tasks

- **UI/UX**
  - Clean and minimal design
  - Mobile responsive layout
  - Error handling with user-friendly messages
  - Loading states and form validation

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **@hello-pangea/dnd** - Drag and drop functionality

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Database connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js # Authentication logic
│   │   │   └── task.controller.js # Task CRUD operations
│   │   ├── middleware/
│   │   │   └── auth.middleware.js # JWT verification
│   │   ├── models/
│   │   │   ├── User.js            # User schema
│   │   │   └── Task.js            # Task schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js     # Auth endpoints
│   │   │   └── task.routes.js     # Task endpoints
│   │   └── app.js                 # Express app setup
│   ├── server.js                  # Server entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── KanbanBoard.jsx    # Main board component
│   │   │   ├── Column.jsx         # Column component
│   │   │   ├── TaskCard.jsx       # Task card component
│   │   │   └── TaskForm.jsx       # Task creation form
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Register.jsx       # Registration page
│   │   │   └── Profile.jsx        # User profile page
│   │   ├── services/
│   │   │   └── api.js             # API client
│   │   ├── App.jsx                # Main app component
│   │   └── main.jsx               # Entry point
│   ├── package.json
│   └── .env.example
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskmanagement
   JWT_SECRET=your_secret_key_here_change_in_production
   ```

   **Note:** 
   - For local MongoDB: Use `mongodb://localhost:27017/taskmanagement`
   - For MongoDB Atlas: Use your connection string from Atlas dashboard
   - Change `JWT_SECRET` to a strong, random string in production

5. Start MongoDB (if using local installation):
   ```bash
   # On macOS/Linux
   mongod

   # On Windows
   # Start MongoDB service from Services or run mongod.exe
   ```

6. Start the backend server:
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory (optional):
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file if needed:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   **Note:** Only change this if your backend is running on a different URL/port.

5. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## API Overview

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
  - Body: `{ name, email, password }`
  - Returns: User object and success message

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: JWT token and user object

- `GET /api/auth/profile` - Get user profile (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Returns: User object

- `PUT /api/auth/profile` - Update user profile (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name?, email?, password? }`
  - Returns: Updated user object

- `DELETE /api/auth/profile` - Delete user account (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Returns: Success message

### Task Endpoints

All task endpoints require authentication.

- `POST /api/tasks` - Create a new task
  - Body: `{ title, description?, status?, due_date? }`
  - Returns: Created task object

- `GET /api/tasks` - Get all user tasks
  - Query params: `status?` (pending, in-progress, completed)
  - Returns: Array of task objects

- `GET /api/tasks/:id` - Get a specific task
  - Returns: Task object

- `PUT /api/tasks/:id` - Update a task
  - Body: `{ title?, description?, status?, due_date? }`
  - Returns: Updated task object

- `DELETE /api/tasks/:id` - Delete a task
  - Returns: Success message

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Server Error

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Create Tasks**: Use the task form to add new tasks with title, description, and due date
3. **Manage Tasks**: 
   - Drag and drop tasks between columns to change status
   - Click the × button on a task card to delete it
4. **Update Profile**: Click "Edit Profile" to update your name, email, or password
5. **Logout**: Click "Logout" to end your session

## Error Handling

The application includes comprehensive error handling:

- **Backend**: Input validation, meaningful error messages, proper HTTP status codes
- **Frontend**: User-friendly error messages, loading states, form validation
- **Authentication**: Automatic token refresh handling, session expiration

## Security Features

- Passwords are hashed using bcryptjs
- JWT tokens with expiration (7 days)
- Protected routes require authentication
- Task ownership verification (users can only access their own tasks)
- Input validation and sanitization

## Mobile Responsive

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

**Frontend:**
```bash
cd frontend
npm run dev  # Vite dev server with hot reload
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Database

The application uses MongoDB. The database will be created automatically when you first run the application.

### Collections
- `users` - User accounts
- `tasks` - User tasks

## Troubleshooting

### Backend Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - Verify MongoDB connection string format

2. **Port Already in Use**
   - Change PORT in .env file
   - Or stop the process using port 5000

### Frontend Issues

1. **API Connection Error**
   - Ensure backend is running
   - Check VITE_API_URL in .env file
   - Verify CORS settings in backend

2. **Authentication Issues**
   - Clear localStorage: `localStorage.clear()`
   - Try logging in again
   - Check browser console for errors

## Future Enhancements

- Task categories/tags
- Task search and filtering
- Task comments
- User collaboration
- Task attachments
- Email notifications
- Dark mode
- Task templates

## License

This project is created for educational purposes.

## Author

[Your Name]

## Submission

Repository format: `yourname_rollnumber`

---

**Note:** Make sure to:
- Use meaningful commit messages
- Avoid committing node_modules, .env files
- Include all necessary setup instructions
- Test the application thoroughly before submission
