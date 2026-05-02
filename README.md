# TaskFlow - Team Task Manager

A full-stack team task management application with role-based access control.

## Live Demo
- Frontend: (Railway URL - coming soon)
- Backend API: (Railway URL - coming soon)

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT (JSON Web Tokens)
- **Deployment:** Railway

## Features
- JWT Authentication (Signup/Login)
- Create and manage projects
- Add team members with roles (Admin/Member)
- Create, assign and track tasks
- Kanban board (To Do / In Progress / Done)
- Dashboard with live stats and overdue tracking
- Role-based access control (Admin can create/delete tasks and manage members)

## API Endpoints

### Auth
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me

### Projects
- GET /api/projects
- POST /api/projects
- GET /api/projects/:id
- DELETE /api/projects/:id
- POST /api/projects/:id/members
- DELETE /api/projects/:id/members/:userId

### Tasks
- GET /api/dashboard
- GET /api/:projectId/tasks
- POST /api/:projectId/tasks
- PATCH /api/:projectId/tasks/:taskId
- DELETE /api/:projectId/tasks/:taskId

## Local Setup

### Backend
```bash
cd backend
npm install
# Create .env file with:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/taskmanagerdb
# JWT_SECRET=your_secret_key
# PORT=5000
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Create .env file with:
# VITE_API_URL=http://localhost:5000/api
npm run dev
```
