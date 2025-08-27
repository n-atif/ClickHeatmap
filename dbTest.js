import { supabase, testConnection } from './supabaseClient.js';

/**
 * Instructions for setting up the "todos" table in Supabase:
 * 
 * 1. Go to your Supabase project dashboard
 * 2. Navigate to the "SQL Editor" tab
 * 3. Run the following SQL command to create the todos table:
 * 
 * CREATE TABLE todos (
 *   id BIGSERIAL PRIMARY KEY,
 *   task TEXT NOT NULL,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * 4. Optionally, enable Row Level Security (RLS) if needed:
 * 
 * ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
 * 
 * 5. Create a policy to allow public access (for testing):
 * 
 * CREATE POLICY "Allow public access" ON todos FOR ALL USING (true);
 */

async function createTodosTable() {
  console.log('🔧 Creating todos table if it doesn\'t exist...');
  
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS todos (
        id BIGSERIAL PRIMARY KEY,
        task TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });

  if (error) {
    // Try alternative approach using SQL editor
    console.log('⚠️  Direct SQL execution not available. Please create the table manually in Supabase SQL Editor:');
    console.log(`
CREATE TABLE todos (
  id BIGSERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON todos FOR ALL USING (true);
    `);
    return false;
  }
  
  console.log('✅ Table creation completed');
  return true;
}

async function runDatabaseTest() {
  console.log('🔄 Starting Supabase database test...\n');

  // Test connection first
  console.log('1. Testing connection...');
  const isConnected = await testConnection();
  if (!isConnected) {
    console.log('❌ Connection test failed. Please check your Supabase credentials.');
    return;
  }

  // Try to create table
  console.log('\n2. Setting up todos table...');
  await createTodosTable();

  try {
    // Insert a new todo item
    console.log('\n3. Inserting a new todo...');
    const newTodo = {
      task: `Test todo created at ${new Date().toISOString()}`
    };

    const { data: insertedData, error: insertError } = await supabase
      .from('todos')
      .insert(newTodo)
      .select();

    if (insertError) {
      console.error('❌ Insert failed:', insertError.message);
      return;
    }

    console.log('✅ Successfully inserted todo:', insertedData[0]);

    // Read all todos from the table
    console.log('\n4. Reading all todos...');
    const { data: allTodos, error: selectError } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (selectError) {
      console.error('❌ Select failed:', selectError.message);
      return;
    }

    console.log('✅ Successfully retrieved todos:');
    console.log('📝 Total todos found:', allTodos.length);
    
    allTodos.forEach((todo, index) => {
      console.log(`   ${index + 1}. ID: ${todo.id} | Task: "${todo.task}" | Created: ${new Date(todo.created_at).toLocaleString()}`);
    });

    console.log('\n🎉 Database test completed successfully!');

  } catch (error) {
    console.error('❌ Unexpected error during database test:', error.message);
  }
}

// Run the test if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDatabaseTest()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Test script failed:', error);
      process.exit(1);
    });
}

export { runDatabaseTest };