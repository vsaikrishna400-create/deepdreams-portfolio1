# DeepDreams AI Studio - Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

1. Go to https://github.com/new
2. Create a new repository named `deepdreams-portfolio`
3. Don't initialize with README
4. Copy the commands shown and run in your terminal:

```bash
cd c:\Portfolio\portfolio-app
git remote add origin https://github.com/YOUR_USERNAME/deepdreams-portfolio.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. Sign up / Log in with GitHub
3. Click "Add New" → "Project"
4. Import your `deepdreams-portfolio` repository
5. Click "Deploy"
6. Wait 2-3 minutes for build
7. Your site will be live at `https://deepdreams-portfolio.vercel.app`

## Alternative: Netlify

1. Go to https://netlify.com
2. Sign up / Log in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy site"

## Custom Domain (Optional)

After deployment, you can add a custom domain:
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

---
Your portfolio is production-ready! 🚀
