# Team Task Manager

A full-stack project management app for creating projects, managing team members, assigning tasks, and tracking progress with Admin/Member access control.

## Features

- Signup and login with JWT authentication
- Admin and Member roles
- Project creation and team membership
- Task creation, assignment, status updates, and overdue tracking
- Dashboard totals for task status and overdue work
- REST API with validation and relational database models
- Railway-ready deployment using PostgreSQL

## Tech Stack

- React + Vite
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT + bcrypt
- Zod validation

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set:

```bash
DATABASE_URL="postgresql://taskmanager:taskmanager@localhost:5432/team_task_manager?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=8080
```

3. Start PostgreSQL locally:

```bash
docker compose up -d
```

4. Run migrations and optional seed data:

```bash
npm run db:dev
npm run db:seed
```

5. Start the app:

```bash
npm run dev
```

Open the development app at `http://localhost:5173`. The Vite dev server proxies `/api` requests to Express on `http://localhost:8080`.

For a production-style local run:

```bash
npm run build
npm start
```

Then open `http://localhost:8080`.

## Demo Accounts

After running the seed script:

- Admin: `admin@example.com`
- Member: `member@example.com`
- Password: `Password123!`

## API Overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/me`
- `GET /api/dashboard`
- `GET /api/users`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects/:projectId/members`
- `POST /api/projects/:projectId/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Role Rules

- Global Admins can create projects, manage team members, create tasks, assign tasks, and delete tasks.
- Project Admins can manage members and tasks for their project.
- Members can view projects they belong to and update the status of tasks assigned to them.
- The first registered user is automatically promoted to Admin; later signups start as Members.

## Railway Deployment

1. Push this repository to GitHub.
2. Create a new Railway project from the GitHub repo.
3. Add a Railway PostgreSQL database.
4. Set environment variables:

```bash
DATABASE_URL=<Railway Postgres connection URL>
JWT_SECRET=<long random secret>
```

5. Deploy. Railway will run:

```bash
npm install && npm run build
npm run db:migrate && npm start
```

## Submission Checklist

- Live URL: add your Railway app URL here
- GitHub repo: add your repository URL here
- README: included
- Demo video: record a 2-5 minute walkthrough covering signup/login, admin project creation, team member assignment, task assignment, member status update, and dashboard/overdue view
# team-task-manager
