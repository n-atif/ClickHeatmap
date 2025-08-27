import { type Task, type InsertTask, type Click, type InsertClick } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Task methods
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  // Click methods
  getClicks(): Promise<Click[]>;
  getClicksByTask(taskId: string): Promise<Click[]>;
  createClick(click: InsertClick): Promise<Click>;
  deleteClicksByTask(taskId: string): Promise<number>;
}

export class MemStorage implements IStorage {
  private tasks: Map<string, Task>;
  private clicks: Map<string, Click>;

  constructor() {
    this.tasks = new Map();
    this.clicks = new Map();
    
    // Add sample tasks
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleTasks: Task[] = [
      {
        id: randomUUID(),
        title: "Find mirrors task",
        description: "Where would you click to find mirrors or mirror-related products?",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        isActive: 1,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Navigation test",
        description: "Where would you click to access the main navigation menu?",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        isActive: 1,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Mobile checkout flow",
        description: "Where would you click to proceed to checkout?",
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        isActive: 1,
        createdAt: new Date(),
      }
    ];

    sampleTasks.forEach(task => this.tasks.set(task.id, task));
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = { 
      ...insertTask, 
      id, 
      createdAt: new Date() 
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updateData: Partial<InsertTask>): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;

    const updatedTask: Task = { ...existingTask, ...updateData };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    const deleted = this.tasks.delete(id);
    if (deleted) {
      // Also delete associated clicks
      await this.deleteClicksByTask(id);
    }
    return deleted;
  }

  async getClicks(): Promise<Click[]> {
    return Array.from(this.clicks.values()).sort((a, b) => 
      new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
    );
  }

  async getClicksByTask(taskId: string): Promise<Click[]> {
    return Array.from(this.clicks.values())
      .filter(click => click.taskId === taskId)
      .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
  }

  async createClick(insertClick: InsertClick): Promise<Click> {
    const id = randomUUID();
    const click: Click = { 
      ...insertClick, 
      id, 
      timestamp: new Date() 
    };
    this.clicks.set(id, click);
    return click;
  }

  async deleteClicksByTask(taskId: string): Promise<number> {
    const clicksToDelete = Array.from(this.clicks.values()).filter(click => click.taskId === taskId);
    clicksToDelete.forEach(click => this.clicks.delete(click.id));
    return clicksToDelete.length;
  }
}

export const storage = new MemStorage();
