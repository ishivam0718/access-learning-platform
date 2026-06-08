# Netlify Deployment Troubleshooting

## Issue: "Backend is not connected"

### Quick Checklist:

1. **Environment Variables** - Set these in Netlify Dashboard → Site Settings → Environment:
   - `JWT_SECRET` (required - can be any random string)
   - `MONGO_URI` (required - MongoDB connection string)
   - `GOOGLE_CLIENT_ID` (required for Google login)
   - `NODE_ENV` set to `production`

2. **MongoDB Access**:
   - If using MongoDB Atlas: Ensure IP whitelist includes `0.0.0.0/0` (all IPs)
   - Or add Netlify's IP ranges to whitelist
   - Test connection string locally first

3. **Debug the API**:
   - Open Browser DevTools (F12)
   - Go to Network tab
   - Try to login/signup
   - Look for the `/api/login` request
   - Check the response status and body
   - If 404: Function not found
   - If 500: Function error (check Netlify Logs)

4. **Check Netlify Logs**:
   - Go to Netlify Dashboard → Logs
   - Look for function deployment errors
   - Check serverless function logs for MongoDB/JWT errors

5. **Test the API Directly**:
   - Try visiting: `https://your-site.netlify.app/.netlify/functions/api`
   - Should return: `{"success":true,"message":"Backend running successfully"}`

## If MongoDB fails:

Replace MONGO_URI with proper format:
```
mongodb+srv://username:password@cluster.mongodb.net/access_learning?retryWrites=true&w=majority
```

## If still failing:

1. Check function can access MongoDB: Create a test endpoint
2. Verify JWT_SECRET is set (not empty)
3. Test from a different network/device
4. Check browser console for CORS errors
5. Verify netlify.toml is deployed (git push after changes)
