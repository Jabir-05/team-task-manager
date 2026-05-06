import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { name: "Avery Admin", email: "admin@example.com", passwordHash, role: "ADMIN" }
  });

  const member = await prisma.user.upsert({
    where: { email: "member@example.com" },
    update: {},
    create: { name: "Mina Member", email: "member@example.com", passwordHash, role: "MEMBER" }
  });

  const project = await prisma.project.upsert({
    where: { id: "demo-project" },
    update: {},
    create: {
      id: "demo-project",
      name: "Launch Portal",
      description: "Demo project showing team assignments, task status, and due dates.",
      ownerId: admin.id,
      members: {
        create: [
          { userId: admin.id, role: "ADMIN" },
          { userId: member.id, role: "MEMBER" }
        ]
      }
    }
  });

  await prisma.task.deleteMany({
    where: {
      projectId: project.id,
      title: { in: ["Design project dashboard", "Review access rules"] }
    }
  });

  await prisma.task.createMany({
    data: [
      {
        id: "demo-task-dashboard",
        title: "Design project dashboard",
        description: "Create the core dashboard views for status and overdue work.",
        status: "IN_PROGRESS",
        dueDate: new Date(Date.now() + 86400000 * 2),
        projectId: project.id,
        assigneeId: member.id,
        createdById: admin.id
      },
      {
        id: "demo-task-access",
        title: "Review access rules",
        description: "Validate admin/member permissions before release.",
        status: "TODO",
        dueDate: new Date(Date.now() - 86400000),
        projectId: project.id,
        assigneeId: admin.id,
        createdById: admin.id
      }
    ],
    skipDuplicates: true
  });
}

main()
  .finally(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
