-- ClickTest Application Database Schema for Supabase
-- Run these commands in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create clicks table
CREATE TABLE IF NOT EXISTS clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  x REAL NOT NULL,
  y REAL NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  session_id TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_is_active ON tasks(is_active);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_clicks_task_id ON clicks(task_id);
CREATE INDEX IF NOT EXISTS idx_clicks_timestamp ON clicks(timestamp);
CREATE INDEX IF NOT EXISTS idx_clicks_session_id ON clicks(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust for production)
CREATE POLICY "Allow public read access on tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on tasks" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on tasks" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on tasks" ON tasks FOR DELETE USING (true);

CREATE POLICY "Allow public read access on clicks" ON clicks FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on clicks" ON clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on clicks" ON clicks FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on clicks" ON clicks FOR DELETE USING (true);

-- Insert sample data
INSERT INTO tasks (title, description, image_url, is_active) VALUES
('Find mirrors task', 'Where would you click to find mirrors or mirror-related products?', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800', 1),
('Navigation test', 'Where would you click to access the main navigation menu?', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800', 1),
('Mobile checkout flow', 'Where would you click to proceed to checkout?', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800', 1)
ON CONFLICT DO NOTHING;

-- Create helper functions for table creation (optional, for programmatic setup)
CREATE OR REPLACE FUNCTION create_tasks_table()
RETURNS void AS $$
BEGIN
  -- This function is called from the application to ensure tables exist
  -- The actual table creation is handled by the SQL above
  NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_clicks_table()
RETURNS void AS $$
BEGIN
  -- This function is called from the application to ensure tables exist
  -- The actual table creation is handled by the SQL above
  NULL;
END;
$$ LANGUAGE plpgsql;