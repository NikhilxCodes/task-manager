# Troubleshooting 404 Errors

## Common Causes

### 1. Favicon/Vite Logo (Harmless)
- Browser automatically requests `/favicon.ico` or `/vite.svg`
- This is normal and doesn't affect functionality
- **Fix**: Removed from index.html (already done)

### 2. API Endpoint 404
**Symptoms**: API calls returning 404

**Check:**
- Backend server is running on port 5050
- Vite proxy is configured correctly
- API baseURL is correct

**Test:**
```bash
# Test backend health
curl http://localhost:5050/health

# Test API (should return 401 without auth, not 404)
curl http://localhost:5050/api/tasks
```

**Fix if API 404:**
- Ensure backend server is running
- Check `client/vite.config.ts` proxy configuration
- Verify `client/src/utils/axios.ts` baseURL

### 3. React Router 404
**Symptoms**: Page not found when navigating

**Check:**
- All routes are defined in `App.tsx`
- Using `BrowserRouter` (not HashRouter)
- Routes match exactly

**Common routes:**
- `/` - Landing page
- `/login` - Login page
- `/register` - Register page
- `/dashboard` - Dashboard (protected)
- `/tasks` - My Tasks (protected)
- `/calendar` - Calendar View (protected)
- `/account` - Account (protected)

### 4. Static Asset 404
**Symptoms**: CSS/JS/images not loading

**Check:**
- Files exist in `client/dist/` after build
- Paths are correct (relative, not absolute)
- Vite is serving assets correctly

## How to Debug

1. **Open Browser DevTools** (F12)
2. **Go to Network tab**
3. **Reload the page**
4. **Look for red 404 requests**
5. **Check the URL that's failing**

## Quick Fixes

### If it's favicon.ico or vite.svg:
- ✅ Already fixed - removed from index.html
- This is harmless, can be ignored

### If it's an API endpoint:
```bash
# Restart backend
cd server
npm run dev

# Check if backend is running
curl http://localhost:5050/health
```

### If it's a React route:
- Check browser URL matches route definition
- Ensure you're logged in for protected routes
- Try navigating directly to the route

## Still Having Issues?

1. Check browser console for error messages
2. Check Network tab for failed requests
3. Verify both servers are running:
   - Backend: http://localhost:5050
   - Frontend: http://localhost:3000
4. Clear browser cache and reload
