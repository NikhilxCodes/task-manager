# Deployment Guide: Vercel (Frontend) + Render (Backend)

This guide will help you deploy your Task Manager application to production.

## 📋 Prerequisites

1. GitHub repository (already done ✅)
2. Vercel account (free tier available)
3. Render account (free tier available)
4. MongoDB Atlas account (free tier available) - for production database

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Database)

### Why MongoDB Atlas?
Render's free tier doesn't include MongoDB, so we'll use MongoDB Atlas (free tier).

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account
   - Create a new cluster (choose FREE tier)

2. **Configure Database Access**
   - Go to "Database Access" → "Add New Database User"
   - Create username and password (save these!)
   - Set privileges to "Atlas admin"

3. **Configure Network Access**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for now
   - Or add specific IPs later for security

4. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority`

---

## 🚀 Step 2: Deploy Backend to Render

### 2.1 Create Render Web Service

1. **Sign up/Login to Render**
   - Go to [Render.com](https://render.com)
   - Sign up with GitHub (recommended)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `task-manager` repository
   - Choose the repository

3. **Configure Service Settings**
   - **Name**: `task-manager-api` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `server` (important!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install --include=dev && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid if you prefer)

4. **Add Environment Variables**
   Click "Environment" tab and add:
   ```
   PORT=5050
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-a-strong-random-string>
   NODE_ENV=production
   ```

   **Generate JWT_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   Or use any random string generator.

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes first time)
   - Copy your service URL (e.g., `https://task-manager-api.onrender.com`)

### 2.2 Important Notes for Render

- **Free tier limitations:**
  - Service spins down after 15 minutes of inactivity
  - First request after spin-down takes ~30 seconds
  - Consider upgrading for production use

- **Keep service alive (optional):**
  - Use a cron job service (like cron-job.org) to ping your API every 10 minutes
  - Or upgrade to paid plan

---

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Project

1. **Sign up/Login to Vercel**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub (recommended)

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your `task-manager` repository
   - Select the repository

3. **Configure Project Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `client` (important!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   VITE_API_URL=https://your-render-service-url.onrender.com/api
   ```
   Replace `your-render-service-url` with your actual Render backend URL.

   **Important:** Don't include `/api` at the end if your backend already handles `/api` routes, or include it if needed.

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### 3.2 Update CORS on Backend

After getting your Vercel URL, update Render environment variables:

1. Go to Render dashboard → Your service → Environment
2. Add/Update:
   ```
   CORS_ORIGIN=https://your-project.vercel.app
   ```
3. Redeploy the service

**Update server code to use CORS_ORIGIN:**
```typescript
// In server/src/server.ts
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
```

---

## ✅ Step 4: Verify Deployment

### Test Your Application

1. **Frontend**: Visit your Vercel URL
2. **Backend Health Check**: Visit `https://your-render-url.onrender.com/health`
3. **Test Features**:
   - Register a new user
   - Login
   - Create tasks
   - Update/Delete tasks

### Common Issues

**Issue: CORS errors**
- Solution: Make sure `CORS_ORIGIN` is set correctly in Render

**Issue: API calls failing**
- Solution: Check `VITE_API_URL` in Vercel environment variables

**Issue: Database connection errors**
- Solution: Verify MongoDB Atlas connection string and network access

**Issue: Slow first request (Render free tier)**
- Solution: This is normal - service spins down after inactivity

---

## 🔄 Step 5: Update Code for Production

### Update server CORS configuration:

```typescript
// server/src/server.ts
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
```

### Update frontend axios config (already done):
- Uses `VITE_API_URL` environment variable
- Falls back to `/api` for local development

---

## 📝 Environment Variables Summary

### Render (Backend)
```
PORT=5050
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### Vercel (Frontend)
```
VITE_API_URL=https://your-render-service.onrender.com/api
```

---

## 🎯 Quick Deployment Checklist

- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created and connection string obtained
- [ ] Render backend deployed with environment variables
- [ ] Backend URL copied
- [ ] Vercel frontend deployed with `VITE_API_URL`
- [ ] CORS configured on backend
- [ ] Application tested end-to-end
- [ ] Both services are live and working

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **MongoDB Atlas**: https://cloud.mongodb.com

---

## 💡 Pro Tips

1. **Custom Domain**: Both Vercel and Render support custom domains
2. **Auto-deploy**: Both platforms auto-deploy on git push to main branch
3. **Monitoring**: Set up error tracking (Sentry, etc.) for production
4. **Backup**: Regularly backup your MongoDB database
5. **Security**: Use strong JWT_SECRET and limit MongoDB network access

---

## 🆘 Need Help?

If you encounter issues:
1. Check Render deployment logs
2. Check Vercel deployment logs
3. Verify all environment variables are set
4. Test API endpoints directly (using Postman or curl)
5. Check browser console for frontend errors

Good luck with your deployment! 🚀
