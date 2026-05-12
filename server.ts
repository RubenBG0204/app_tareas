import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Users
  app.get("/api/users", async (req, res) => {
    const users = await prisma.user.findMany({
      include: { tasks: true }
    });
    res.json(users);
  });

  app.post("/api/users", async (req, res) => {
    const { name, email } = req.body;
    try {
      const user = await prisma.user.create({
        data: { name, email }
      });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "User already exists or invalid data" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    const { name, email } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { name, email }
    });
    res.json(user);
  });

  app.delete("/api/users/:id", async (req, res) => {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true });
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    const categories = await prisma.category.findMany({
      include: { tasks: true }
    });
    res.json(categories);
  });

  app.post("/api/categories", async (req, res) => {
    const { name, color } = req.body;
    const category = await prisma.category.create({
      data: { name, color }
    });
    res.json(category);
  });

  app.put("/api/categories/:id", async (req, res) => {
    const { name, color } = req.body;
    const category = await prisma.category.update({
      where: { id: parseInt(req.params.id) },
      data: { name, color }
    });
    res.json(category);
  });

  app.delete("/api/categories/:id", async (req, res) => {
    await prisma.category.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true });
  });

  // Tasks
  app.get("/api/tasks", async (req, res) => {
    const tasks = await prisma.task.findMany({
      include: { category: true, users: true }
    });
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const { title, description, status, dueDate, categoryId, userIds } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "pendiente",
        dueDate: dueDate ? new Date(dueDate) : null,
        categoryId,
        users: {
          connect: userIds?.map((id: number) => ({ id })) || []
        }
      },
      include: { category: true, users: true }
    });
    res.json(task);
  });

  app.put("/api/tasks/:id", async (req, res) => {
    const { title, description, status, dueDate, categoryId, userIds } = req.body;
    
    // For many-to-many update, we'll set the new connections
    const task = await prisma.task.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        categoryId,
        users: {
          set: userIds?.map((id: number) => ({ id })) || []
        }
      },
      include: { category: true, users: true }
    });
    res.json(task);
  });

  app.patch("/api/tasks/:id/status", async (req, res) => {
    const { status } = req.body;
    const task = await prisma.task.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
      include: { category: true, users: true }
    });
    res.json(task);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    await prisma.task.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true });
  });

  // --- End API Routes ---

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
