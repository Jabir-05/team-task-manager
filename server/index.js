import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { prisma } from "./db.js";
import { requireAdmin, requireAuth, requireProjectAccess, requireProjectAdmin, signToken } from "./auth.js";
import {
  loginSchema,
  memberSchema,
  projectSchema,
  signupSchema,
  statusSchema,
  taskSchema,
  validate
} from "./validators.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

app.use(cors());
app.use(express.json());

const publicUser = { id: true, name: true, email: true, role: true };
const projectInclude = {
  owner: { select: publicUser },
  members: { include: { user: { select: publicUser } } },
  tasks: {
    include: {
      assignee: { select: publicUser },
      createdBy: { select: publicUser }
    },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }]
  }
};

function taskDueDate(value) {
  return value ? new Date(value) : null;
}

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api", (_req, res) => {
  res.json({
    name: "Team Task Manager API",
    ok: true,
    health: "/api/health"
  });
});

app.post("/api/auth/signup", asyncHandler(async (req, res) => {
  const { data, error } = validate(signupSchema, req.body);
  if (error) return res.status(400).json({ message: "Validation failed", details: error });

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return res.status(409).json({ message: "Email is already registered" });

  const userCount = await prisma.user.count();
  const role = userCount === 0 ? "ADMIN" : "MEMBER";
  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, passwordHash, role },
    select: publicUser
  });

  res.status(201).json({ user, token: signToken(user) });
}));

app.post("/api/auth/login", asyncHandler(async (req, res) => {
  const { data, error } = validate(loginSchema, req.body);
  if (error) return res.status(400).json({ message: "Validation failed", details: error });

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  const valid = user ? await bcrypt.compare(data.password, user.passwordHash) : false;
  if (!valid) return res.status(401).json({ message: "Invalid email or password" });

  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  res.json({ user: safeUser, token: signToken(safeUser) });
}));

app.get("/api/me", requireAuth, (req, res) => res.json({ user: req.user }));

app.get("/api/users", requireAuth, asyncHandler(async (_req, res) => {
  const users = await prisma.user.findMany({ select: publicUser, orderBy: { name: "asc" } });
  res.json({ users });
}));

app.get("/api/dashboard", requireAuth, asyncHandler(async (req, res) => {
  const where =
    req.user.role === "ADMIN"
      ? {}
      : {
          OR: [
            { assigneeId: req.user.id },
            { project: { members: { some: { userId: req.user.id } } } }
          ]
        };

  const tasks = await prisma.task.findMany({
    where,
    include: { project: true, assignee: { select: publicUser } },
    orderBy: { dueDate: "asc" }
  });

  const now = new Date();
  const stats = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === "TODO").length,
    inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
    done: tasks.filter((task) => task.status === "DONE").length,
    overdue: tasks.filter((task) => task.dueDate && task.dueDate < now && task.status !== "DONE").length
  };

  res.json({ stats, tasks });
}));

app.get("/api/projects", requireAuth, asyncHandler(async (req, res) => {
  const where =
    req.user.role === "ADMIN"
      ? {}
      : { members: { some: { userId: req.user.id } } };
  const projects = await prisma.project.findMany({
    where,
    include: projectInclude,
    orderBy: { updatedAt: "desc" }
  });
  res.json({ projects });
}));

app.post("/api/projects", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { data, error } = validate(projectSchema, req.body);
  if (error) return res.status(400).json({ message: "Validation failed", details: error });

  const project = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      ownerId: req.user.id,
      members: { create: { userId: req.user.id, role: "ADMIN" } }
    },
    include: projectInclude
  });
  res.status(201).json({ project });
}));

app.get("/api/projects/:id", requireAuth, requireProjectAccess, asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id }, include: projectInclude });
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json({ project });
}));

app.post("/api/projects/:projectId/members", requireAuth, requireProjectAdmin, asyncHandler(async (req, res) => {
  const { data, error } = validate(memberSchema, req.body);
  if (error) return res.status(400).json({ message: "Validation failed", details: error });

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const member = await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: req.params.projectId, userId: user.id } },
    update: { role: data.role },
    create: { projectId: req.params.projectId, userId: user.id, role: data.role },
    include: { user: { select: publicUser } }
  });

  res.status(201).json({ member });
}));

app.post("/api/projects/:projectId/tasks", requireAuth, requireProjectAdmin, asyncHandler(async (req, res) => {
  const { data, error } = validate(taskSchema, req.body);
  if (error) return res.status(400).json({ message: "Validation failed", details: error });

  if (data.assigneeId) {
    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: req.params.projectId, userId: data.assigneeId } }
    });
    if (!member) return res.status(400).json({ message: "Assignee must be a project member" });
  }

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      dueDate: taskDueDate(data.dueDate),
      projectId: req.params.projectId,
      assigneeId: data.assigneeId || null,
      createdById: req.user.id
    },
    include: { assignee: { select: publicUser }, createdBy: { select: publicUser }, project: true }
  });

  res.status(201).json({ task });
}));

app.patch("/api/tasks/:id", requireAuth, asyncHandler(async (req, res) => {
  const existing = await prisma.task.findUnique({
    where: { id: req.params.id },
    include: { project: { include: { members: true } } }
  });
  if (!existing) return res.status(404).json({ message: "Task not found" });

  const isGlobalAdmin = req.user.role === "ADMIN";
  const membership = existing.project.members.find((member) => member.userId === req.user.id);
  const canManage = isGlobalAdmin || membership?.role === "ADMIN";
  const isAssignee = existing.assigneeId === req.user.id;

  if (!canManage && !isAssignee) {
    return res.status(403).json({ message: "Only project admins or assignees can update this task" });
  }

  const schema = canManage ? taskSchema.partial().merge(statusSchema.partial()) : statusSchema;
  const { data, error } = validate(schema, req.body);
  if (error) return res.status(400).json({ message: "Validation failed", details: error });

  if (data.assigneeId) {
    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: existing.projectId, userId: data.assigneeId } }
    });
    if (!member) return res.status(400).json({ message: "Assignee must be a project member" });
  }

  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: {
      ...data,
      dueDate: Object.hasOwn(data, "dueDate") ? taskDueDate(data.dueDate) : undefined
    },
    include: { assignee: { select: publicUser }, createdBy: { select: publicUser }, project: true }
  });

  res.json({ task });
}));

app.delete("/api/tasks/:id", requireAuth, asyncHandler(async (req, res) => {
  const task = await prisma.task.findUnique({
    where: { id: req.params.id },
    include: { project: { include: { members: true } } }
  });
  if (!task) return res.status(404).json({ message: "Task not found" });

  const membership = task.project.members.find((member) => member.userId === req.user.id);
  if (req.user.role !== "ADMIN" && membership?.role !== "ADMIN") {
    return res.status(403).json({ message: "Project admin access required" });
  }

  await prisma.task.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

app.use("/api", (err, _req, res, next) => {
  if (res.headersSent) return next(err);
  console.error(err);
  const message = process.env.NODE_ENV === "production" ? "Server error" : err.message || "Server error";
  res.status(500).json({ message });
});

app.use(express.static(path.join(rootDir, "dist")));
app.get("*", (_req, res) => res.sendFile(path.join(rootDir, "dist", "index.html")));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Team Task Manager running on port ${port}`);
});
