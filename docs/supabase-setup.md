# Supabase Setup Guide

This guide walks you through setting up a Supabase project for the Unconf2 application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Access to your project's environment variables

## Step 1: Create a New Supabase Project

1. **Sign in to Supabase Dashboard**

   - Go to [app.supabase.com](https://app.supabase.com)
   - Sign in with your account

2. **Create New Project**

   - Click "New Project"
   - Choose your organization (or create one)
   - Fill in project details:
     - **Name**: `unconf2-app` (or your preferred name)
     - **Database Password**: Use a strong password (save this!)
     - **Region**: Choose the region closest to your users
   - Click "Create new project"

3. **Wait for Deployment**
   - The project will take 2-3 minutes to set up
   - You'll see a progress indicator

## Step 2: Get Your API Keys

Once your project is ready:

1. **Navigate to API Settings**

   - In your project dashboard, go to `Settings` → `API`

2. **Copy the Required Values**
   - **Project URL**: Look for "Project URL" (e.g., `https://xxxxx.supabase.co`)
   - **Anon Public Key**: This is safe to use in client-side code
   - **Service Role Key**: This is for server-side operations (keep secret!)

## Step 3: Set Up Environment Variables

1. **Create `.env.local` file**

   ```bash
   # In your project root directory
   touch .env.local
   ```

2. **Add Your Supabase Configuration**

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

   # Database Connection (Prisma)
   # Replace 'your-project-ref' with your actual Supabase project reference
   # Replace 'your-db-password' with your actual database password
   DATABASE_URL="postgresql://postgres:[your-db-password]@db.[your-project-ref].supabase.co:5432/postgres?connection_limit=1&pool_timeout=10"
   DIRECT_URL="postgresql://postgres:[your-db-password]@db.[your-project-ref].supabase.co:5432/postgres"

   # Development settings
   NODE_ENV=development
   ```

3. **Replace the Placeholder Values**
   - Replace `your-project-ref` with your actual project reference
   - Replace `your-anon-key-here` with your actual anon key
   - Replace `your-service-role-key-here` with your actual service role key

## Step 4: Enable Row Level Security (RLS)

Row Level Security is crucial for protecting your data:

1. **Go to Database Settings**

   - In your Supabase dashboard: `Database` → `Settings`

2. **Enable RLS by Default**

   - Navigate to `Database` → `Settings` → `Security`
   - Enable "Row Level Security" for all new tables

3. **Configure RLS for Future Tables**
   - We'll set up specific RLS policies when we create our database schema
   - For now, just ensure RLS is enabled globally

## Step 5: Configure Database Connection (Prisma)

1. **Get Database Connection Details**

   - In your Supabase dashboard: `Settings` → `Database`
   - Look for "Connection string" section
   - Note down your database password (the one you set when creating the project)

2. **Construct Connection URLs**

   - Your project reference is the part before `.supabase.co` in your Project URL
   - Replace `[your-project-ref]` and `[your-db-password]` in the template
   - Example: If your URL is `https://abc123.supabase.co`, your project ref is `abc123`

3. **Add Database URLs to Environment**

   ```env
   DATABASE_URL="postgresql://postgres:your-actual-password@db.your-project-ref.supabase.co:5432/postgres?connection_limit=1&pool_timeout=10"
   DIRECT_URL="postgresql://postgres:your-actual-password@db.your-project-ref.supabase.co:5432/postgres"
   ```

4. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

## Step 6: Test Your Connection

1. **Start Your Development Server**

   ```bash
   npm run dev
   ```

2. **Test Supabase Connection**

   - The app will validate your environment variables on startup
   - Check the console for any connection errors

3. **Optional: Test in Browser Console**
   ```javascript
   // In your browser console at localhost:4250
   import { testSupabaseConnection } from '@/lib/supabase';
   await testSupabaseConnection();
   ```

## Step 6: Security Best Practices

1. **Never Commit Secrets**

   - The `.env.local` file is already in `.gitignore`
   - Never commit your service role key to version control

2. **Use Environment-Specific Projects**

   - Consider separate Supabase projects for development/staging/production
   - Use different API keys for each environment

3. **Rotate Keys Regularly**
   - You can regenerate API keys in the Supabase dashboard
   - Update your environment variables when you do

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables" Error**

   - Ensure `.env.local` exists in your project root
   - Check that variable names match exactly (case-sensitive)
   - Restart your development server after adding variables

2. **Connection Timeout**

   - Verify your project URL is correct
   - Check if your Supabase project is active (not paused)

3. **Invalid API Key**
   - Regenerate keys in Supabase dashboard
   - Ensure you're copying the full key (they're quite long)

### Getting Help

- **Supabase Documentation**: [docs.supabase.com](https://docs.supabase.com)
- **Community Discord**: [discord.supabase.com](https://discord.supabase.com)
- **Project Issues**: Create an issue in this repository

## Next Steps

Once Supabase is configured:

1. ✅ **Supabase project created and configured**
2. 🔄 **Next**: Set up Prisma with your Supabase database
3. 🔄 **Then**: Define your database schema and migrations

Your Supabase setup is now complete! The app will use these credentials to connect to your database and handle authentication.
