# 🔒 Security Checklist

## Critical: Keep THESE Secret (Set in Netlify Dashboard ONLY)

- ❌ **JWT_SECRET** - Never hardcode, never commit
- ❌ **MONGO_URI** - Never hardcode, never commit  
- ❌ **GOOGLE_CLIENT_ID** - Only use in frontend (it's meant to be public)
- ❌ **Any API Keys** - Always use environment variables

## Safe to Expose (Frontend Code)

- ✅ Frontend HTML/CSS/JS - Code is always visible to clients
- ✅ API endpoints (`/api/login`, `/api/signup`) - Clients need to know these
- ✅ GOOGLE_CLIENT_ID - Intentionally public for OAuth
- ✅ General project structure

## What You MUST Do Now

### 1. Check if Repository is Public
```bash
# If on GitHub, go to Settings → check visibility
# If Public: Anyone can see your code (that's ok!)
# But secrets in .env file would be BAD
```

### 2. Verify No Secrets Committed
```bash
# Check git history for .env file
git log --all --full-history -- .env
# Should show: nothing

# Search for hardcoded secrets
git log -p -S "mongodb+srv://" 
git log -p -S "MONGO_URI="
```

### 3. Set Secrets in Netlify Dashboard (NOT in code)
- Go to: Netlify → Your Site → Site Settings → Environment
- Add variables there (hidden from public)

### 4. Clean Up Code
- ✅ Already removed test signup function
- ✅ .gitignore is set up correctly
- ✅ .env.example shows structure without values

## If Secrets Are Already Exposed

1. **Regenerate all secrets:**
   - New JWT_SECRET
   - New MongoDB connection string
   - New Google Client ID

2. **Remove from git history:**
   ```bash
   git filter-branch --force --index-filter \
   "git rm -r --cached --ignore-unmatch .env" \
   --prune-empty --tag-name-filter cat -- --all
   git push --force
   ```

3. **Revoke old credentials:**
   - Delete MongoDB user and create new one
   - Regenerate Google OAuth credentials
   - Update JWT_SECRET in Netlify

## Best Practices

1. ✅ Use `.gitignore` for: `.env`, `.env.local`, credentials
2. ✅ Use Netlify environment variables for secrets
3. ✅ Keep API code on backend only (Netlify Functions)
4. ✅ Frontend can show API endpoints (they're not secrets)
5. ✅ Never log sensitive data to console in production
