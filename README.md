# TaskFlow - Team Task Manager

A full-stack team task management web application with role-based access control (Admin/Member), built as part of a full-stack developer assessment.

## 🌐 Live Demo

- **Frontend (Live App):** https://taskflow-frontend-e7xc.onrender.com
- **Backend API:** https://team-task-manager-c0o9.onrender.com/health

> Note: Deployed on Render (free tier) instead of Railway, as Railway no longer offers a free tier and requires a paid plan. Render provides the same cloud deployment experience and the app is fully live and functional.

## 🚀 Features

- JWT Authentication (Signup & Login)
- Create and manage multiple projects
- Add team members with roles (Admin / Member)
- Create tasks with title, description, priority, due date, and assignee
- Kanban board with 3 columns — To Do, In Progress, Done
- Move tasks between columns with one click
- Dashboard with live stats — total projects, tasks, overdue count
- Role-based access control — only Admins can create/delete tasks and manage members
- Toast notifications for all actions
- Fully responsive UI

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, React Router |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (JSON Web Tokens) |
| Deployment | Render (Frontend + Backend + Database) |

## 📁 Project Structure

team-task-manager/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        # Database models
│   ├── src/
│   │   ├── controllers/         # Business logic
│   │   ├── middleware/          # Auth & role checks
│   │   ├── routes/              # API routes
│   │   └── index.js             # Express server
│   └── package.json
└── frontend/
├── src/
│   ├── api/                 # Axios instance
│   ├── components/          # Navbar
│   ├── context/             # Auth context
│   ├── pages/               # Login, Signup, Dashboard, Projects, TaskBoard
│   └── App.jsx              # Routes
└── package.json

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/signup | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Protected |

### Projects
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/projects | Any member |
| POST | /api/projects | Any logged in user |
| GET | /api/projects/:id | Any member |
| DELETE | /api/projects/:id | Owner only |
| POST | /api/projects/:id/members | Admin only |
| DELETE | /api/projects/:id/members/:userId | Admin only |

### Tasks
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/dashboard | Any member |
| GET | /api/:projectId/tasks | Any member |
| POST | /api/:projectId/tasks | Admin only |
| PATCH | /api/:projectId/tasks/:taskId | Any member |
| DELETE | /api/:projectId/tasks/:taskId | Admin only |

## 🛠️ Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL

### Backend
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/taskmanagerdb"
JWT_SECRET="your_secret_key"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

```bash
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd frontend
npm install
```

Create `.env` file in frontend folder:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

App runs on http://localhost:5173

## 👤 Test Credentials

You can create your own account on the live app, or use:
- **Email:** shiva@test.com
- **Password:** 123456

## 📦 Submission

- **Live URL:** https://taskflow-frontend-e7xc.onrender.com
- **GitHub Repo:** https://github.com/Shivam954629/team-task-manager
- **Demo Video:** (recording with Loom - 2-5 min walkthrough)