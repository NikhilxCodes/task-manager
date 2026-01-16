# MongoDB Atlas Connection String Setup

## Your Connection String
```
mongodb+srv://<db_username>:<db_password>@cluster0.oh1edbi.mongodb.net/?appName=Cluster0
```

## Steps to Complete Setup

### 1. Replace Placeholders
- Replace `<db_username>` with your MongoDB Atlas database username
- Replace `<db_password>` with your MongoDB Atlas database password

### 2. Add Database Name
Add your database name at the end. For example:
```
mongodb+srv://username:password@cluster0.oh1edbi.mongodb.net/taskmanager?retryWrites=true&w=majority
```

### 3. Complete Connection String Format
```
mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.oh1edbi.mongodb.net/taskmanager?retryWrites=true&w=majority
```

### 4. For Local Development (.env file)
Create/update `server/.env`:
```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.oh1edbi.mongodb.net/taskmanager?retryWrites=true&w=majority
PORT=5050
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 5. For Render Deployment
In Render Dashboard → Your Service → Environment:
- Add `MONGODB_URI` with your complete connection string
- Make sure to URL-encode special characters in password if needed

## Security Notes
⚠️ **Never commit your .env file to GitHub!**
- The `.env` file is already in `.gitignore`
- Only use `.env.example` as a template

## Testing Connection
After setting up, test locally:
```bash
cd server
npm run dev
```

You should see: "MongoDB connected successfully"
