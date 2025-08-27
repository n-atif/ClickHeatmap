import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please ensure SUPABASE_URL and SUPABASE_KEY are set in Replit Secrets');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseIntegration() {
  console.log('🔄 Testing ClickTest Supabase Integration...\n');

  try {
    // Test 1: Connection test
    console.log('1. Testing Supabase connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('tasks')
      .select('count', { count: 'exact' });
    
    if (connectionError) {
      throw new Error(`Connection failed: ${connectionError.message}`);
    }
    console.log('✅ Supabase connection successful\n');

    // Test 2: Create a test task
    console.log('2. Creating a test task...');
    const testTask = {
      title: 'Test Task - Database Integration',
      description: 'This is a test task to verify database integration is working correctly.',
      image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
      is_active: 1
    };

    const { data: newTask, error: taskError } = await supabase
      .from('tasks')
      .insert(testTask)
      .select()
      .single();

    if (taskError) {
      throw new Error(`Task creation failed: ${taskError.message}`);
    }
    console.log(`✅ Test task created successfully:`, {
      id: newTask.id,
      title: newTask.title,
      description: newTask.description.substring(0, 50) + '...',
      created_at: new Date(newTask.created_at).toLocaleString()
    });

    // Test 3: Create test clicks for the task
    console.log('\n3. Creating test clicks...');
    const testClicks = [
      {
        task_id: newTask.id,
        x: 0.25,
        y: 0.30,
        user_agent: 'Test Browser 1.0',
        session_id: 'test-session-001'
      },
      {
        task_id: newTask.id,
        x: 0.75,
        y: 0.65,
        user_agent: 'Test Browser 1.0',
        session_id: 'test-session-001'
      }
    ];

    const { data: newClicks, error: clicksError } = await supabase
      .from('clicks')
      .insert(testClicks)
      .select();

    if (clicksError) {
      throw new Error(`Clicks creation failed: ${clicksError.message}`);
    }
    console.log(`✅ ${newClicks.length} test clicks created successfully`);

    // Test 4: Read all tasks
    console.log('\n4. Reading all tasks...');
    const { data: allTasks, error: readError } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (readError) {
      throw new Error(`Reading tasks failed: ${readError.message}`);
    }
    console.log(`✅ Successfully retrieved ${allTasks.length} tasks`);

    // Test 5: Read clicks for the test task
    console.log('\n5. Reading clicks for test task...');
    const { data: taskClicks, error: clicksReadError } = await supabase
      .from('clicks')
      .select('*')
      .eq('task_id', newTask.id)
      .order('timestamp', { ascending: false });

    if (clicksReadError) {
      throw new Error(`Reading clicks failed: ${clicksReadError.message}`);
    }
    console.log(`✅ Successfully retrieved ${taskClicks.length} clicks for the test task`);

    // Test 6: Update the test task
    console.log('\n6. Updating test task...');
    const { data: updatedTask, error: updateError } = await supabase
      .from('tasks')
      .update({ 
        title: 'Updated Test Task - Database Integration',
        is_active: 0 
      })
      .eq('id', newTask.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Task update failed: ${updateError.message}`);
    }
    console.log(`✅ Task updated successfully:`, {
      title: updatedTask.title,
      is_active: updatedTask.is_active
    });

    // Test 7: Cleanup - Delete test data
    console.log('\n7. Cleaning up test data...');
    
    // Delete clicks first (foreign key constraint)
    const { error: deleteClicksError } = await supabase
      .from('clicks')
      .delete()
      .eq('task_id', newTask.id);

    if (deleteClicksError) {
      throw new Error(`Clicks deletion failed: ${deleteClicksError.message}`);
    }

    // Delete the test task
    const { error: deleteTaskError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', newTask.id);

    if (deleteTaskError) {
      throw new Error(`Task deletion failed: ${deleteTaskError.message}`);
    }

    console.log('✅ Test data cleaned up successfully');

    console.log('\n🎉 All Supabase integration tests passed!');
    console.log('\n📊 Summary:');
    console.log('- ✅ Database connection working');
    console.log('- ✅ Task CRUD operations working');
    console.log('- ✅ Click tracking working');
    console.log('- ✅ Foreign key relationships working');
    console.log('- ✅ Data cleanup working');
    console.log('\nYour ClickTest application is ready to use with Supabase! 🚀');

  } catch (error) {
    console.error('\n❌ Supabase integration test failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Verify SUPABASE_URL and SUPABASE_KEY are correctly set in Replit Secrets');
    console.log('2. Ensure you have run the SQL setup commands in your Supabase project');
    console.log('3. Check that Row Level Security policies allow the operations');
    console.log('4. Verify your Supabase project is active and accessible');
    process.exit(1);
  }
}

// Run the test
testSupabaseIntegration();