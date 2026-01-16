# Quick Deployment Guide

## 🚀 Fast Track Deployment

### Prerequisites
- GitHub repo pushed ✅
- MongoDB Atlas account (free)
- Render account (free)
- Vercel account (free)

---

## Step 1: MongoDB Atlas (5 minutes)

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create FREE cluster
3. Database Access → Add user (save password!)
4. Network Access → Allow from anywhere (0.0.0.0/0)
5. Database → Connect → Copy connection string
6. Replace `<password>` in connection string

**Connection string format:**
```
mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
```

---

## Step 2: Deploy Backend to Render (10 minutes)

1. Go to [render.com](https://render.com) → Sign up with GitHub
2. New + → Web Service
3. Connect GitHub repo → Select `task-manager`
4. Configure:
   - **Name**: `task-manager-api`
   - **Root Directory**: `server` ⚠️ IMPORTANT
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add Environment Variables:
   ```
   PORT=5050
   MONGODB_URI=<your-atlas-connection-string>
   JWT_SECRET=<generate-random-string>
   NODE_ENV=production
   ```
6. Create Web Service → Wait for deployment
7. **Copy your Render URL** (e.g., `https://task-manager-api.onrender.com`)

**Generate JWT_SECRET:**
```bash
openssl rand -base64 32
```

---

## Step 3: Deploy Frontend to Vercel (5 minutes)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Add New... → Project
3. Import `task-manager` repo
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client` ⚠️ IMPORTANT
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-render-url.onrender.com/api
   ```
   Replace `your-render-url` with your actual Render URL
6. Deploy → Wait 2-3 minutes
7. **Copy your Vercel URL**

---

## Step 4: Update CORS (2 minutes)

1. Go back to Render dashboard
2. Your service → Environment
3. Add:
   ```
   CORS_ORIGIN=https://your-vercel-url.vercel.app
   ```
4. Save → Service will auto-redeploy

---

## Step 5: Test (2 minutes)

1. Visit your Vercel URL
2. Register a new account
3. Create a task
4. Everything should work! 🎉

---

## 🔧 Troubleshooting

**CORS errors?**
- Check `CORS_ORIGIN` in Render matches your Vercel URL exactly

**API not working?**
- Check `VITE_API_URL` in Vercel includes `/api` at the end
- Test backend directly: `https://your-render-url.onrender.com/health`

**Database errors?**
- Verify MongoDB connection string
- Check network access in Atlas

**Slow first request?**
- Render free tier spins down after 15 min inactivity
- First request takes ~30 seconds (normal)

---

## ✅ Done!

Your app is now live:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-api.onrender.com`

Both auto-deploy on every git push! 🚀
