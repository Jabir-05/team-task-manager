````md
# Team Task Manager 🚀

A full-stack project management web application that allows users to create projects, assign tasks, manage team members, and track progress with secure role-based access control (Admin / Member).

---

## 🌐 Live Demo

- **Live URL:** https://team-task-manager-production-ef81.up.railway.app  
- **GitHub Repository:** https://github.com/Jabir-05/team-task-manager

---

# 📌 Features

## 🔐 Authentication & Authorization
- User Signup & Login
- JWT-based Authentication
- Password Hashing using bcrypt
- Role-Based Access Control (Admin / Member)

---

## 📁 Project Management
- Create and manage projects
- Add or remove project members
- View project details and assigned members

---

## ✅ Task Management
- Create tasks
- Assign tasks to team members
- Update task status
- Track overdue tasks
- Delete tasks (Admin only)

---

## 📊 Dashboard
- Total Tasks
- Completed Tasks
- Pending Tasks
- Overdue Tasks
- Project progress overview

---

## 🛡️ Backend & Database
- RESTful API architecture
- Prisma ORM with PostgreSQL
- Proper relational database models
- Input validation using Zod

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- CSS

## Backend
- Node.js
- Express.js
- Prisma ORM

## Database
- PostgreSQL

## Authentication
- JWT
- bcryptjs

## Validation
- Zod

## Deployment
- Railway

---

# 📂 Project Structure

```bash
├── prisma
├── server
├── src
├── Screenshots
├── public
├── package.json
└── README.md
````

---

# ⚙️ Local Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Jabir-05/team-task-manager.git
cd team-task-manager
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file and add:

```env
DATABASE_URL="postgresql://taskmanager:taskmanager@localhost:5432/team_task_manager?schema=public"
JWT_SECRET="your-secret-key"
PORT=8080
```

---

## 4️⃣ Start PostgreSQL

```bash
docker compose up -d
```

---

## 5️⃣ Run Prisma Migrations

```bash
npm run db:dev
```

### Optional Seed Data

```bash
npm run db:seed
```

---

## 6️⃣ Start Development Server

```bash
npm run dev
```

### Frontend

```text
http://localhost:5173
```

### Backend

```text
http://localhost:8080
```

---

# 👨‍💻 Demo Accounts

## Admin Account

```text
Email: admin@example.com
Password: Password123!
```

## Member Account

```text
Email: member@example.com
Password: Password123!
```

---

# 📡 API Endpoints

## Authentication

* `POST /api/auth/signup`
* `POST /api/auth/login`

## User

* `GET /api/me`
* `GET /api/users`

## Dashboard

* `GET /api/dashboard`

## Projects

* `GET /api/projects`
* `POST /api/projects`
* `GET /api/projects/:id`

## Team Members

* `POST /api/projects/:projectId/members`

## Tasks

* `POST /api/projects/:projectId/tasks`
* `PATCH /api/tasks/:id`
* `DELETE /api/tasks/:id`

---

# 🔑 Role Permissions

## Admin

* Create projects
* Manage members
* Create and assign tasks
* Delete tasks
* View all project details

## Member

* View assigned projects
* Update assigned task status
* Track project progress

---

# 🚂 Railway Deployment

## Deployment Steps

1. Push project to GitHub
2. Create Railway project
3. Add PostgreSQL database
4. Configure environment variables
5. Deploy application

---

## Required Environment Variables

```env
DATABASE_URL=<Railway PostgreSQL URL>
JWT_SECRET=<your-secret-key>
PORT=8080
```

---

## Build Command

```bash
npm install && npm run build
```

---

## Start Command

```bash
npm start
```

---

# 📸 Screenshots

## 🔐 Login Page

![Login Page](https://raw.githubusercontent.com/Jabir-05/team-task-manager/main/Screenshots/Login.png)

---

## 📊 Dashboard

![Dashboard](https://raw.githubusercontent.com/Jabir-05/team-task-manager/main/Screenshots/Dashboard.png)

---

# 🎥 Demo Video

Record a 2–5 minute walkthrough including:

* Signup/Login
* Admin dashboard
* Project creation
* Team member assignment
* Task assignment
* Status updates
* Dashboard overview

---

# 📋 Submission Checklist

* ✅ Live Application
* ✅ GitHub Repository
* ✅ README Documentation
* ✅ Demo Video

---

# 👨‍💻 Developer

## Jabir Imteyaz

B.Tech CSE Student
Full Stack Developer

```
```
