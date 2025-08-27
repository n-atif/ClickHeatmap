import { createClient } from '@supabase/supabase-js';
import { type Task, type InsertTask, type Click, type InsertClick } from "@shared/schema";
import { type IStorage } from "./storage";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check SUPABASE_URL and SUPABASE_KEY in Replit Secrets.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseStorage implements IStorage {
  
  async initializeTables(): Promise<void> {
    try {
      // Create tasks table
      const { error: tasksError } = await supabase.rpc('create_tasks_table');
      if (tasksError && !tasksError.message.includes('already exists')) {
        console.warn('Tasks table creation warning:', tasksError.message);
      }

      // Create clicks table
      const { error: clicksError } = await supabase.rpc('create_clicks_table');
      if (clicksError && !clicksError.message.includes('already exists')) {
        console.warn('Clicks table creation warning:', clicksError.message);
      }

      console.log('✅ Supabase tables initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Supabase tables:', error);
      // Don't throw - allow app to continue, tables might already exist
    }
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    return data || [];
  }

  async getTask(id: string): Promise<Task | undefined> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return undefined; // Not found
      }
      console.error('Error fetching task:', error);
      throw new Error(`Failed to fetch task: ${error.message}`);
    }

    return data;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: task.title,
        description: task.description,
        image_url: task.imageUrl,
        is_active: task.isActive || 1
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw new Error(`Failed to create task: ${error.message}`);
    }

    // Transform database response to match our schema
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.image_url,
      isActive: data.is_active,
      createdAt: new Date(data.created_at)
    };
  }

  async updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined> {
    const updateData: any = {};
    if (task.title !== undefined) updateData.title = task.title;
    if (task.description !== undefined) updateData.description = task.description;
    if (task.imageUrl !== undefined) updateData.image_url = task.imageUrl;
    if (task.isActive !== undefined) updateData.is_active = task.isActive;

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return undefined; // Not found
      }
      console.error('Error updating task:', error);
      throw new Error(`Failed to update task: ${error.message}`);
    }

    // Transform database response to match our schema
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.image_url,
      isActive: data.is_active,
      createdAt: new Date(data.created_at)
    };
  }

  async deleteTask(id: string): Promise<boolean> {
    // First delete associated clicks
    await this.deleteClicksByTask(id);

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      throw new Error(`Failed to delete task: ${error.message}`);
    }

    return true;
  }

  // Click methods
  async getClicks(): Promise<Click[]> {
    const { data, error } = await supabase
      .from('clicks')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching clicks:', error);
      throw new Error(`Failed to fetch clicks: ${error.message}`);
    }

    // Transform database response to match our schema
    return (data || []).map(click => ({
      id: click.id,
      taskId: click.task_id,
      x: click.x,
      y: click.y,
      timestamp: new Date(click.timestamp),
      userAgent: click.user_agent,
      sessionId: click.session_id
    }));
  }

  async getClicksByTask(taskId: string): Promise<Click[]> {
    const { data, error } = await supabase
      .from('clicks')
      .select('*')
      .eq('task_id', taskId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching clicks by task:', error);
      throw new Error(`Failed to fetch clicks for task: ${error.message}`);
    }

    // Transform database response to match our schema
    return (data || []).map(click => ({
      id: click.id,
      taskId: click.task_id,
      x: click.x,
      y: click.y,
      timestamp: new Date(click.timestamp),
      userAgent: click.user_agent,
      sessionId: click.session_id
    }));
  }

  async createClick(click: InsertClick): Promise<Click> {
    const { data, error } = await supabase
      .from('clicks')
      .insert({
        task_id: click.taskId,
        x: click.x,
        y: click.y,
        user_agent: click.userAgent,
        session_id: click.sessionId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating click:', error);
      throw new Error(`Failed to create click: ${error.message}`);
    }

    // Transform database response to match our schema
    return {
      id: data.id,
      taskId: data.task_id,
      x: data.x,
      y: data.y,
      timestamp: new Date(data.timestamp),
      userAgent: data.user_agent,
      sessionId: data.session_id
    };
  }

  async deleteClicksByTask(taskId: string): Promise<number> {
    const { data, error } = await supabase
      .from('clicks')
      .delete()
      .eq('task_id', taskId)
      .select('id');

    if (error) {
      console.error('Error deleting clicks by task:', error);
      throw new Error(`Failed to delete clicks for task: ${error.message}`);
    }

    return data?.length || 0;
  }
}

export const supabaseStorage = new SupabaseStorage();