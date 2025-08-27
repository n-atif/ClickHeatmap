# Supabase Integration Setup

This project includes Supabase integration for database operations. Follow these steps to get everything working.

## Prerequisites

1. A Supabase account and project
2. Environment variables configured in Replit Secrets

## Environment Variables

Add these to your Replit Secrets:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anon/public key

Find these values in your Supabase project dashboard under Settings > API.

## Database Setup

### Step 1: Create the todos table

1. Go to your Supabase project dashboard
2. Navigate to the "SQL Editor" tab
3. Copy and paste the following SQL commands:

```sql
-- Create the todos table
CREATE TABLE todos (
  id BIGSERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional for production)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create a policy for public access (for testing purposes)
CREATE POLICY "Allow public access" ON todos FOR ALL USING (true);
```

4. Click "Run" to execute the SQL

### Step 2: Test the connection

Run the database test script:

```bash
node dbTest.js
```

You should see output like:
```
🔄 Starting Supabase database test...
1. Testing connection...
✅ Supabase connection successful
3. Inserting a new todo...
✅ Successfully inserted todo: { id: 1, task: "Test todo...", created_at: "2024-01-01T..." }
4. Reading all todos...
✅ Successfully retrieved todos:
📝 Total todos found: 1
   1. ID: 1 | Task: "Test todo..." | Created: 1/1/2024...
🎉 Database test completed successfully!
```

## Available Scripts

- `node dbTest.js` - Run the database test
- `node package-scripts.js setup-help` - Show setup instructions
- `node package-scripts.js test-db` - Run database test via helper script

## Files

- `supabaseClient.js` - Supabase client configuration
- `dbTest.js` - Database test script with examples
- `package-scripts.js` - Helper script for common operations

## Troubleshooting

### Connection Issues
- Verify SUPABASE_URL and SUPABASE_KEY are correctly set in Replit Secrets
- Check that your Supabase project is active

### Table Not Found
- Ensure you've run the SQL commands in the Supabase SQL Editor
- Check that the table was created in the `public` schema

### Permission Errors
- Verify Row Level Security policies are correctly configured
- For testing, use the "Allow public access" policy shown above

## Production Considerations

1. **Row Level Security**: Replace the broad public access policy with more restrictive rules
2. **API Keys**: Use service role keys for server-side operations that need elevated privileges
3. **Environment**: Use different Supabase projects for development and production

## Integration with Main App

The main application uses Drizzle ORM with PostgreSQL. The Supabase integration is separate and can be used for:
- Additional data storage
- Real-time features
- Authentication (if implemented)
- File storage

To integrate Supabase with the main app, you would import the client in your server routes:

```javascript
import { supabase } from './supabaseClient.js';

// Example usage in a route
app.get('/api/supabase-todos', async (req, res) => {
  const { data, error } = await supabase.from('todos').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
```