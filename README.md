````md
# Team Task Manager 🚀

A modern full-stack project management application that helps teams create projects, assign tasks, manage members, and track work progress efficiently with secure role-based access control.

## 🌐 Live Demo

### 🚀 Live Application
[Open Live Project](https://team-task-manager-production-ef81.up.railway.app)

### 📂 GitHub Repository
[View GitHub Repository](https://github.com/Jabir-05/team-task-manager)

## ✨ Features

### 🔐 Authentication & Authorization
- Secure Signup & Login System
- JWT-based Authentication
- Password Encryption using bcrypt
- Role-Based Access Control (Admin / Member)

### 📁 Project Management
- Create and manage projects
- Add or remove team members
- Manage project responsibilities
- View project details and members

### ✅ Task Management
- Create and assign tasks
- Update task status
- Track overdue tasks
- Delete tasks (Admin only)
- Monitor project workflow

### 📊 Dashboard & Analytics
- Total Tasks Overview
- Pending Tasks
- Completed Tasks
- In Progress Tasks
- Overdue Task Monitoring

### 🛡️ Backend & Database
- RESTful API Architecture
- Prisma ORM Integration
- PostgreSQL Database
- Input Validation using Zod
- Relational Database Models

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| React.js | Frontend UI |
| Vite | Frontend Build Tool |
| Node.js | Backend Runtime |
| Express.js | Backend Framework |
| Prisma ORM | Database ORM |
| PostgreSQL | Database |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Railway | Deployment |

## 📂 Project Structure

```bash
├── prisma
├── server
├── src
├── Screenshots
├── public
├── package.json
└── README.md
```

## ⚙️ Local Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Jabir-05/team-task-manager.git
cd team-task-manager
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file and add:

```env
DATABASE_URL="postgresql://taskmanager:taskmanager@localhost:5432/team_task_manager?schema=public"
JWT_SECRET="your-secret-key"
PORT=8080
```

### 4️⃣ Start PostgreSQL

```bash
docker compose up -d
```

### 5️⃣ Run Prisma Migrations

```bash
npm run db:dev
```

### Optional Seed Data

```bash
npm run db:seed
```

### 6️⃣ Start Development Server

```bash
npm run dev
```

### Frontend URL

```text
http://localhost:5173
```

### Backend URL

```text
http://localhost:8080
```

## 👨‍💻 Demo Accounts

### 🔑 Admin Account

```text
Email: admin@example.com
Password: Password123!
```

### 👤 Member Account

```text
Email: member@example.com
Password: Password123!
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup`
- `POST /api/auth/login`

### User
- `GET /api/me`
- `GET /api/users`

### Dashboard
- `GET /api/dashboard`

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`

### Team Members
- `POST /api/projects/:projectId/members`

### Tasks
- `POST /api/projects/:projectId/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

## 🔑 Role Permissions

### 👑 Admin
- Create projects
- Manage members
- Assign tasks
- Delete tasks
- Access all project details

### 👤 Member
- View assigned projects
- Update assigned tasks
- Track task progress

## 🚂 Railway Deployment

### Deployment Steps

1. Push project to GitHub
2. Create Railway Project
3. Add PostgreSQL Database
4. Configure Environment Variables
5. Deploy Application

### Required Environment Variables

```env
DATABASE_URL=<Railway PostgreSQL URL>
JWT_SECRET=<your-secret-key>
PORT=8080
```

### Build Command

```bash
npm install && npm run build
```

### Start Command

```bash
npm start
```

## 📸 Application Screenshots

### 🔐 Login Page

![Login Page](https://raw.githubusercontent.com/Jabir-05/team-task-manager/main/Screenshots/Login.png)

### 📊 Admin Dashboard

![Dashboard](https://raw.githubusercontent.com/Jabir-05/team-task-manager/main/Screenshots/Dashboard.png)

### 👥 Member Dashboard

![Member Dashboard](https://raw.githubusercontent.com/Jabir-05/team-task-manager/main/Screenshots/member.png)

## 🎥 Demo Video

The demo video includes:

- User Authentication
- Admin Dashboard
- Project Creation
- Member Management
- Task Assignment
- Task Status Updates
- Dashboard Overview

## 📋 Submission Checklist

- ✅ Fully Functional Live Application
- ✅ GitHub Repository
- ✅ README Documentation
- ✅ Demo Video

## 👨‍💻 Developer

### Jabir Imteyaz

B.Tech CSE Student  
Full Stack Developer
````
