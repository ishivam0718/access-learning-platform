# Deployment Guide

## Environment Setup

Set the following environment variables in Netlify:

1. **JWT_SECRET** - A secure random string for JWT signing
2. **GOOGLE_CLIENT_ID** - Your Google OAuth 2.0 Client ID
3. **MONGO_URI** - Your MongoDB connection string (Atlas or self-hosted)
4. **NODE_ENV** - Set to "production"

## Deployment Structure

- **Frontend/** - All static HTML/CSS/JS files (published to root)
- **netlify/functions/api.js** - Serverless backend functions
- **netlify.toml** - Build and routing configuration

## API Endpoints

All API endpoints are routed through `/.netlify/functions/api`:

- `POST /api/signup` - User registration
- `POST /api/login` - Email/password login
- `POST /api/google-login` - Google OAuth login
- `GET /api/profile` - Get user profile (requires auth token)
- `GET /api/progress` - Get learning progress (requires auth token)
- `POST /api/complete-lesson` - Mark lesson as complete (requires auth token)
- `GET /api/test` - Health check endpoint

## Step 1: MongoDB Setup

1. Create a MongoDB Atlas account and cluster
2. Create a database user with username and password
3. Whitelist your IP (or use 0.0.0.0 for allow all)
4. Get your connection string: `<your_mongo_connection_string>`

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
     JWT_SECRET=<your_secret_key_here>
     MONGO_URI=<your_mongo_connection_string>
     GOOGLE_CLIENT_ID=<your_google_client_id>
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
| `MONGO_URI` | `<your_mongo_connection_string>` |
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
npm install
npm run dev
```

Visit http://localhost:8888 (Netlify dev server)

## Important Notes

1. **MongoDB Connection** - Ensure your MongoDB is accessible from Netlify (Atlas recommended)
2. **CORS** - CORS is enabled for all origins in the API handler
3. **Authentication** - Uses JWT tokens stored in localStorage on the client
4. **Production Build** - Frontend files are served statically from the `/Frontend` directory
