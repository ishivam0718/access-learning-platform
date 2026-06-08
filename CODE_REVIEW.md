# Code Review - Issues Found & Fixes

## 🔴 CRITICAL ISSUES

### 1. **Email Unique Constraint Error Handling**
**Problem:** When duplicate email is added, Mongoose throws error that crashes function
**Location:** api.js lines 144, 210
**Fix needed:** Add proper try-catch for duplicate key error

### 2. **Google Client ID can be NULL**
**Problem:** If GOOGLE_CLIENT_ID is not set, OAuth2Client(null) will fail silently
**Location:** api.js line 14
**Current:** Already has warning log, but should fail explicitly

### 3. **Weak JWT Secret Default**
**Problem:** Default JWT_SECRET is exposed
**Location:** api.js line 6
**Fix:** Already improved, but must be set in Netlify

---

## 🟡 MEDIUM ISSUES

### 4. **Missing Email Validation**
**Problem:** No validation that email is valid format
**Location:** api.js signup/login, Frontend/js/signup.js
**Impact:** Can create accounts with invalid emails

### 5. **No XSS Protection on User Data**
**Problem:** User name displayed in dashboard without sanitization
**Location:** Frontend/js/dashboard.js lines 286-288
**Risk:** If name contains HTML, it could execute

### 6. **Missing Rate Limiting**
**Problem:** No protection against brute force attacks
**Location:** All API endpoints
**Impact:** Can spam login attempts

### 7. **CORS allows all origins**
**Problem:** Any domain can call your API
**Location:** api.js line 56
**Note:** Acceptable for now, but should restrict to domain later

---

## 🟢 MINOR ISSUES

### 8. **Test code in index.js**
**Status:** ✅ Already removed

### 9. **Console logging sensitive data**
**Location:** Various console.log statements
**Recommendation:** Remove in production

### 10. **No input length limits**
**Problem:** User can submit very long names/emails
**Location:** All endpoints
**Impact:** Could cause issues with database

---

## PRIORITY FIXES (Do These Now)

1. Add email validation (regex check)
2. Fix duplicate email error handling
3. Remove console.log of sensitive data
4. Add name sanitization for display
5. Ensure GOOGLE_CLIENT_ID is required (not optional)
