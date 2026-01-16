# GitHub Setup Instructions

## ✅ What's Done
- ✅ Git repository initialized
- ✅ All files committed
- ✅ Branch renamed to `main`
- ✅ Sensitive files (.env, node_modules, dist) are ignored

## 📋 Next Steps

### 1. Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in the details:
   - **Repository name**: `task-manager` (or your preferred name)
   - **Description**: "Full-stack task management application built with MERN stack"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

### 2. Connect and Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/task-manager.git

# Push to GitHub
git push -u origin main
```

### Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/task-manager.git
git push -u origin main
```

## 🔐 Important Notes

- ✅ `.env` files are NOT committed (they're in .gitignore)
- ✅ `node_modules` are NOT committed
- ✅ `dist` folders are NOT committed
- ✅ `.env.example` IS committed (this is the template file)

## 🚀 After Pushing

Once pushed, you can:
- View your code on GitHub
- Share the repository URL
- Set up GitHub Actions for CI/CD (optional)
- Add collaborators
- Create issues and pull requests

## 📝 Quick Commands Reference

```bash
# Check status
git status

# See what's committed
git log --oneline

# Add remote (one time)
git remote add origin <your-repo-url>

# Push to GitHub
git push -u origin main

# Future updates
git add .
git commit -m "Your commit message"
git push
```
