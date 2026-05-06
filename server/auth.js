import jwt from "jsonwebtoken";
import { prisma } from "./db.js";

const jwtSecret = process.env.JWT_SECRET || "dev-only-change-me";

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, jwtSecret, { expiresIn: "7d" });
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true }
    });
    if (!user) return res.status(401).json({ message: "Invalid session" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ message: "Admin access required" });
  next();
}

export async function requireProjectAccess(req, res, next) {
  const projectId = req.params.projectId || req.params.id;
  if (!projectId) return res.status(400).json({ message: "Project id is required" });
  if (req.user.role === "ADMIN") return next();

  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: req.user.id } }
  });
  if (!membership) return res.status(403).json({ message: "Project access required" });
  req.membership = membership;
  next();
}

export async function requireProjectAdmin(req, res, next) {
  const projectId = req.params.projectId || req.params.id;
  if (req.user.role === "ADMIN") return next();

  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: req.user.id } }
  });
  if (membership?.role !== "ADMIN") return res.status(403).json({ message: "Project admin access required" });
  req.membership = membership;
  next();
}
