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
