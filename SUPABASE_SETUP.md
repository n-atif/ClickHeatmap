# ClickTest Supabase Database Setup

This guide will help you set up Supabase as the database backend for your ClickTest application, replacing the in-memory storage with persistent database storage.

## Prerequisites

1. A Supabase account and project ([Create one here](https://supabase.com))
2. Environment variables configured in Replit Secrets

## Step 1: Environment Variables

Add these to your Replit Secrets (Tools → Secrets):
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anon/public key

Find these values in your Supabase project dashboard under Settings → API.

## Step 2: Database Schema Setup

1. Go to your Supabase project dashboard
2. Navigate to the "SQL Editor" tab
3. Copy and paste the entire contents of `supabase-setup.sql` file
4. Click "Run" to execute the SQL

This will create:
- `tasks` table for storing click test scenarios
- `clicks` table for storing user click data
- Proper indexes for performance
- Row Level Security policies
- Sample data to get you started

## Step 3: Verify Integration

Run the comprehensive integration test:

```bash
node test-supabase-integration.js
```

You should see output like:
```
🔄 Testing ClickTest Supabase Integration...

1. Testing Supabase connection...
✅ Supabase connection successful

2. Creating a test task...
✅ Test task created successfully

3. Creating test clicks...
✅ 2 test clicks created successfully

4. Reading all tasks...
✅ Successfully retrieved tasks

5. Reading clicks for test task...
✅ Successfully retrieved clicks for the test task

6. Updating test task...
✅ Task updated successfully

7. Cleaning up test data...
✅ Test data cleaned up successfully

🎉 All Supabase integration tests passed!
```

## Application Integration

The ClickTest application now uses Supabase as its primary database through:

- **SupabaseStorage**: Implements the IStorage interface for all database operations
- **Automatic Initialization**: Tables are initialized when the server starts
- **Error Handling**: Comprehensive error handling with fallbacks
- **Data Transformation**: Converts between Supabase column names and application schemas

### Architecture Changes

- **server/supabase-storage.ts**: Main database integration layer
- **server/routes.ts**: Uses SupabaseStorage instead of in-memory storage
- **server/index.ts**: Initializes Supabase tables on startup

## Database Schema

### Tasks Table
```sql
tasks (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Clicks Table
```sql
clicks (
  id UUID PRIMARY KEY,
  task_id UUID REFERENCES tasks(id),
  x REAL NOT NULL,
  y REAL NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  session_id TEXT
)
```

## Testing Scripts

- `node test-supabase-integration.js` - Complete integration test
- `node dbTest.js` - Basic Supabase connection test (legacy)
- `node package-scripts.js setup-help` - Setup instructions

## Troubleshooting

### Missing Environment Variables
```
❌ Missing Supabase environment variables
```
**Solution**: Ensure SUPABASE_URL and SUPABASE_KEY are set in Replit Secrets

### Table Not Found Errors
```
relation "tasks" does not exist
```
**Solution**: Run the SQL commands from `supabase-setup.sql` in your Supabase SQL Editor

### Permission Denied Errors
```
new row violates row-level security policy
```
**Solution**: Ensure RLS policies are created as shown in the setup SQL

### Connection Timeout
**Solution**: 
- Check your Supabase project is active
- Verify the SUPABASE_URL is correct
- Ensure you're using the correct API key

## Production Considerations

1. **Row Level Security**: The current setup uses broad public access policies. For production, implement user-specific policies.

2. **API Keys**: Consider using the service role key for server-side operations that need elevated privileges.

3. **Environment Separation**: Use different Supabase projects for development and production.

4. **Performance**: The schema includes indexes for common queries. Monitor query performance and add additional indexes as needed.

## Data Migration

If you have existing data in the in-memory storage that you want to preserve:

1. Export your current data using the admin dashboard
2. Import it manually through the Supabase dashboard or SQL Editor
3. Verify the data appears correctly in your application

Your ClickTest application is now running on Supabase with persistent storage! 🚀