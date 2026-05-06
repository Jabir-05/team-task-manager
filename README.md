# Team Task Manager

> A full-stack project management application for teams to create projects, assign tasks, manage members, and track progress with secure role-based access control.

---

## 🔗 Links

| | |
|---|---|
| **Live Application** | [team-task-manager-production-ef81.up.railway.app](https://team-task-manager-production-ef81.up.railway.app) |
| **GitHub Repository** | [github.com/Jabir-05/team-task-manager](https://github.com/Jabir-05/team-task-manager) |

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with secure signup and login
- Password hashing with bcrypt
- Role-based access control (Admin / Member)

### 📁 Project Management
- Create and manage projects
- Add or remove team members
- Control project access and responsibilities

### ✅ Task Management
- Create, assign, and update tasks
- Track task status (Pending, In Progress, Completed, Overdue)
- Admin-only task deletion
- Real-time workflow tracking

### 📊 Dashboard & Analytics
- Overview of total, pending, in-progress, completed, and overdue tasks
- Role-specific dashboard views for Admins and Members

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js + Vite |
| Backend | Node.js + Express.js |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + bcryptjs |
| Validation | Zod |
| Deployment | Railway |

---

## 📂 Project Structure

```
team-task-manager/
├── prisma/         # Database schema and migrations
├── server/         # Express backend (routes, controllers, middleware)
├── src/            # React frontend
├── public/         # Static assets
├── Screenshots/    # App screenshots
└── package.json
```

---

## ⚙️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Jabir-05/team-task-manager.git
cd team-task-manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://taskmanager:taskmanager@localhost:5432/team_task_manager?schema=public"
JWT_SECRET="your-secret-key"
PORT=8080
```

### 4. Start PostgreSQL via Docker

```bash
docker compose up -d
```

### 5. Run Prisma Migrations

```bash
npm run db:dev
```

Optionally seed the database with demo data:

```bash
npm run db:seed
```

### 6. Start the Development Server

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8080 |

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | Password123! |
| Member | member@example.com | Password123! |

---

## 📡 API Reference

### Authentication
| Method | Endpoint |
|--------|----------|
| POST | `/api/auth/signup` |
| POST | `/api/auth/login` |

### Users
| Method | Endpoint |
|--------|----------|
| GET | `/api/me` |
| GET | `/api/users` |

### Dashboard
| Method | Endpoint |
|--------|----------|
| GET | `/api/dashboard` |

### Projects
| Method | Endpoint |
|--------|----------|
| GET | `/api/projects` |
| POST | `/api/projects` |
| GET | `/api/projects/:id` |

### Team Members
| Method | Endpoint |
|--------|----------|
| POST | `/api/projects/:projectId/members` |

### Tasks
| Method | Endpoint |
|--------|----------|
| POST | `/api/projects/:projectId/tasks` |
| PATCH | `/api/tasks/:id` |
| DELETE | `/api/tasks/:id` |

---

## 🔑 Role Permissions

| Permission | Admin | Member |
|-----------|:-----:|:------:|
| Create projects | ✅ | ❌ |
| Manage members | ✅ | ❌ |
| Assign tasks | ✅ | ❌ |
| Delete tasks | ✅ | ❌ |
| Update assigned tasks | ✅ | ✅ |
| View assigned projects | ✅ | ✅ |
| Track task progress | ✅ | ✅ |

---

## 🚀 Deployment (Railway)

### Steps

1. Push the project to GitHub
2. Create a new Railway project
3. Add a PostgreSQL database plugin
4. Set the environment variables below
5. Deploy

### Environment Variables

```env
DATABASE_URL=<Railway PostgreSQL URL>
JWT_SECRET=<your-secret-key>
PORT=8080
```

### Build & Start Commands

```bash
# Build
npm install && npm run build

# Start
npm start
```

---

## 📸 Screenshots

### Login Page
![Login Page](https://raw.githubusercontent.com/Jabir-05/team-task-manager/main/Screenshots/Login.png)

### Admin Dashboard
![Admin Dashboard](https://raw.githubusercontent.com/Jabir-05/team-task-manager/main/Screenshots/Dashboard.png)

### Member Dashboard
![Member Dashboard](https://raw.githubusercontent.com/Jabir-05/team-task-manager/main/Screenshots/member.png)

---

## 👨‍💻 Developer

**Jabir Imteyaz**  
B.Tech CSE Student · Full Stack Developer  
[GitHub](https://github.com/Jabir-05)
