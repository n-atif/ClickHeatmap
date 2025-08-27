import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertClickSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(req.params.id, validatedData);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTask(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Click routes
  app.get("/api/clicks", async (req, res) => {
    try {
      const clicks = await storage.getClicks();
      res.json(clicks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clicks" });
    }
  });

  app.get("/api/clicks/task/:taskId", async (req, res) => {
    try {
      const clicks = await storage.getClicksByTask(req.params.taskId);
      res.json(clicks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clicks for task" });
    }
  });

  app.post("/api/clicks", async (req, res) => {
    try {
      const validatedData = insertClickSchema.parse(req.body);
      const click = await storage.createClick(validatedData);
      res.status(201).json(click);
    } catch (error) {
      res.status(400).json({ message: "Invalid click data" });
    }
  });

  // Export routes
  app.get("/api/export/clicks/:taskId", async (req, res) => {
    try {
      const { format } = req.query;
      const clicks = await storage.getClicksByTask(req.params.taskId);
      
      if (format === "csv") {
        const csvHeaders = "Task ID,X,Y,Timestamp,User Agent,Session ID\n";
        const csvData = clicks.map(click => 
          `${click.taskId},${click.x},${click.y},${click.timestamp},${click.userAgent || ""},${click.sessionId || ""}`
        ).join("\n");
        
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=task-${req.params.taskId}-clicks.csv`);
        res.send(csvHeaders + csvData);
      } else {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename=task-${req.params.taskId}-clicks.json`);
        res.json(clicks);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  // Stats route
  app.get("/api/stats", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      const clicks = await storage.getClicks();
      
      const stats = {
        totalClicks: clicks.length,
        totalTasks: tasks.length,
        activeTasks: tasks.filter(t => t.isActive === 1).length,
        uniqueTesters: new Set(clicks.map(c => c.sessionId).filter(Boolean)).size || 0
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
