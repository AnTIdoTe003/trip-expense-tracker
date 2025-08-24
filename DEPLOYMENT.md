# Deployment Guide for Vercel

## Issues Fixed

1. **Removed unused imports** in middleware.ts that could cause build issues
2. **Added proper error handling** for missing JWT_SECRET in edge runtime
3. **Optimized MongoDB connection** for serverless environments
4. **Added Vercel configuration** for proper function timeouts

## Environment Variables Setup

You need to set these environment variables in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

### Required Environment Variables:

- `MONGODB_URI`: `mongodb+srv://viperbaledb:NXpnSMNb8l4uT6Hl@cluster0.uwdeuub.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
- `JWT_SECRET`: `DBANDSOHELA123`

**Important**: Make sure to set these for all environments (Production, Preview, Development)

## Common Deployment Issues & Solutions

### 1. MongoDB Connection Issues

- Ensure your MongoDB Atlas cluster allows connections from `0.0.0.0/0` (all IPs) for Vercel
- Check that your MongoDB URI includes the correct database name and connection options

### 2. Environment Variables

- Never commit `.env.local` to git - it won't be available in production
- Always set environment variables in Vercel dashboard
- Use the exact same variable names as in your local environment

### 3. Function Timeouts

- Added `vercel.json` with 30-second timeout for API routes
- This prevents timeout issues with database operations

### 4. Edge Runtime Compatibility

- Middleware uses edge-compatible JWT verification
- Removed Node.js-specific dependencies from edge functions

## Deployment Steps

1. **Set Environment Variables** in Vercel dashboard (as described above)
2. **Push your code** to your connected Git repository
3. **Vercel will automatically deploy** your application
4. **Test the deployment** by accessing your live URL

## Troubleshooting

If you still encounter issues:

1. **Check Vercel Function Logs**:

   - Go to your Vercel dashboard
   - Click on your deployment
   - Check the "Functions" tab for error logs

2. **Common Error Messages**:

   - "JWT_SECRET environment variable is required" → Set JWT_SECRET in Vercel
   - "Please add your MongoDB URI to environment variables" → Set MONGODB_URI in Vercel
   - "MongoServerSelectionError" → Check MongoDB Atlas network access settings

3. **Test API Endpoints**:
   - Try accessing `/api/trips` directly in your browser
   - Check browser developer tools for detailed error messages
