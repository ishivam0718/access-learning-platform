# Deployment Guide - Access Learning Platform on Netlify

## Setup

This project is configured for Netlify deployment with:
- **Frontend**: Static HTML/CSS/JS hosted on Netlify
- **Backend**: Netlify Functions (serverless)
- **Database**: MongoDB Atlas (cloud MongoDB)

## Prerequisites

1. **MongoDB Atlas Account** - Cloud MongoDB hosting
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free account and cluster
   - Get your connection string

2. **Netlify Account** - Free hosting
   - Go to https://netlify.com
   - Sign up with GitHub

3. **Git Repository** - Push code to GitHub

## Step 1: Prepare MongoDB

1. Create a MongoDB Atlas account and cluster
2. Create a database user with username and password
3. Whitelist your IP (or use 0.0.0.0 for allow all)
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/access_learning?retryWrites=true`

## Step 2: Deploy to Netlify

### Option A: GitHub Integration (Recommended)

1. Push your code to GitHub
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/access-learning-platform.git
   git push -u origin main
   ```

2. Go to https://app.netlify.com
3. Click "New site from Git"
4. Connect GitHub and select your repository
5. Build settings:
   - Build command: `npm run build` (auto-filled)
   - Publish directory: `Frontend`
   - Functions directory: `netlify`
6. Add Environment Variables:
   - Go to Site settings → Build & deploy → Environment
   - Add these variables:
     ```
     JWT_SECRET=your_secret_key_here
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/access_learning
     GOOGLE_CLIENT_ID=183209466249-a122ef74a78tgjo0prc7hucspv7plorq.apps.googleusercontent.com
     PORT=443
     ```
7. Click "Deploy site"

### Option B: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## Step 3: Verify Deployment

1. Test the API:
   ```bash
   curl https://your-site.netlify.app/api/test
   ```

2. Visit https://your-site.netlify.app in browser
3. Try signup and login
4. Check Netlify dashboard → Functions → Logs for any errors

## Environment Variables

Set these in Netlify dashboard (Site settings → Environment):

| Variable | Value |
|----------|-------|
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/access_learning` |
| `JWT_SECRET` | Any random secret string |
| `GOOGLE_CLIENT_ID` | Your Google OAuth client ID |

## File Structure

```
access-learning-platform/
├── netlify.toml                 # Netlify config
├── api.js                       # Netlify Function handler
├── package.json                 # Root dependencies
├── Frontend/                    # Static files
│   ├── *.html
│   ├── css/
│   └── js/
└── Backend/                     # (Optional) Local dev
    ├── server.js
    └── package.json
```

## Troubleshooting

### API Not Working
1. Check Netlify Functions in dashboard
2. Look at build logs for errors
3. Verify MONGO_URI is correct
4. Check MongoDB whitelist IP

### "MongoDB connection error"
- Make sure MONGO_URI env variable is set
- Verify IP whitelist in MongoDB Atlas
- Test connection string locally first

### CORS Issues
- CORS headers are already set in api.js
- If still issues, check browser console errors

## Local Development

```bash
# Install dependencies
npm install

# Run local backend
cd Backend
node server.js

# Update Frontend JS files to use http://localhost:5000 for testing
```

## Support

For issues:
1. Check Netlify Functions logs
2. Verify environment variables
3. Check MongoDB Atlas connection
4. Review browser console errors
