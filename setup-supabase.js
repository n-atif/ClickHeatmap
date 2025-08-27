#!/usr/bin/env node

console.log('🚀 ClickTest Supabase Setup Guide\n');

console.log('Follow these steps to set up your Supabase database:\n');

console.log('1️⃣ Create a Supabase Project');
console.log('   - Go to https://supabase.com');
console.log('   - Sign up or log in');
console.log('   - Click "New Project"');
console.log('   - Choose your organization and enter project details\n');

console.log('2️⃣ Get Your API Credentials');
console.log('   - Once your project is created, go to Settings → API');
console.log('   - Copy the "Project URL" and "anon public" key');
console.log('   - Add them to Replit Secrets:');
console.log('     * SUPABASE_URL = your-project-url');
console.log('     * SUPABASE_KEY = your-anon-key\n');

console.log('3️⃣ Set Up Database Tables');
console.log('   - In your Supabase dashboard, go to the SQL Editor');
console.log('   - Copy the entire contents of the file: supabase-setup.sql');
console.log('   - Paste it into the SQL Editor and click "Run"\n');

console.log('4️⃣ Enable Supabase in the App');
console.log('   - Open server/routes.ts');
console.log('   - Comment out: import { storage } from "./storage";');
console.log('   - Uncomment: import { supabaseStorage as storage } from "./supabase-storage";');
console.log('   - Open server/index.ts');
console.log('   - Uncomment the Supabase initialization code\n');

console.log('5️⃣ Test Your Setup');
console.log('   - Run: node test-supabase-integration.js');
console.log('   - If successful, your app will now use Supabase!\n');

console.log('📋 Quick Files Reference:');
console.log('   - supabase-setup.sql      → Database schema');
console.log('   - SUPABASE_SETUP.md       → Detailed instructions');
console.log('   - test-supabase-integration.js → Test your setup\n');

console.log('Need help? Check SUPABASE_SETUP.md for detailed instructions!');

// Check if environment variables are set
const hasUrl = process.env.SUPABASE_URL;
const hasKey = process.env.SUPABASE_KEY;

console.log('\n📊 Current Status:');
console.log(`   SUPABASE_URL: ${hasUrl ? '✅ Set' : '❌ Not set'}`);
console.log(`   SUPABASE_KEY: ${hasKey ? '✅ Set' : '❌ Not set'}`);

if (hasUrl && hasKey) {
  console.log('\n🎉 Environment variables are configured!');
  console.log('Now run the SQL setup and enable Supabase in your code.');
} else {
  console.log('\n⚠️  Please add your Supabase credentials to Replit Secrets first.');
}