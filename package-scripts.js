#!/usr/bin/env node

/**
 * Helper script to run database operations
 * Usage: node package-scripts.js [command]
 * 
 * Commands:
 *   test-db    - Run Supabase database test
 *   setup-help - Show SQL commands to setup the database
 */

import { runDatabaseTest } from './dbTest.js';

const command = process.argv[2];

switch (command) {
  case 'test-db':
    console.log('Running Supabase database test...\n');
    await runDatabaseTest();
    break;
    
  case 'setup-help':
    console.log('📋 Supabase Database Setup Instructions\n');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to the "SQL Editor" tab');
    console.log('3. Copy and paste the following SQL commands:\n');
    console.log('-- Create the todos table');
    console.log('CREATE TABLE todos (');
    console.log('  id BIGSERIAL PRIMARY KEY,');
    console.log('  task TEXT NOT NULL,');
    console.log('  created_at TIMESTAMPTZ DEFAULT NOW()');
    console.log(');\n');
    console.log('-- Enable Row Level Security (optional)');
    console.log('ALTER TABLE todos ENABLE ROW LEVEL SECURITY;\n');
    console.log('-- Create a policy for public access (for testing)');
    console.log('CREATE POLICY "Allow public access" ON todos FOR ALL USING (true);\n');
    console.log('4. Click "Run" to execute the SQL');
    console.log('5. Run "node package-scripts.js test-db" to verify the setup\n');
    break;
    
  default:
    console.log('Available commands:');
    console.log('  test-db    - Run Supabase database test');
    console.log('  setup-help - Show SQL commands to setup the database');
    console.log('\nUsage: node package-scripts.js [command]');
}