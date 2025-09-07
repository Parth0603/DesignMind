# HomeCanvas Backend Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables Setup
Create a `.env` file in the `backend/` directory with the following variables:

```bash
# Required
GEMINI_API_KEY=your_actual_gemini_api_key
PORT=3001
NODE_ENV=production

# Update for production
FRONTEND_URL=https://your-frontend-domain.com
```

### 2. Frontend API Configuration
Update your frontend to point to the backend API:

**In your frontend `src/services/` files, change:**
```javascript
// From:
const API_BASE_URL = 'http://localhost:3001/api';

// To:
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-domain.com/api';
```

**Add to frontend `.env` file:**
```bash
REACT_APP_API_URL=https://your-backend-domain.com/api
```

### 3. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your backend `.env` file

### 4. Install Backend Dependencies
```bash
cd backend
npm install
```

### 5. Test Locally
```bash
# Start backend
cd backend
npm run dev

# Start frontend (in another terminal)
cd ../
npm run dev
```

## Deployment Options

### Option 1: Railway (Recommended)
1. Push code to GitHub
2. Connect Railway to your GitHub repo
3. Deploy backend from `/backend` folder
4. Set environment variables in Railway dashboard
5. Deploy frontend to Vercel/Netlify

### Option 2: Render
1. Create new Web Service on Render
2. Connect GitHub repo
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables

### Option 3: Heroku
1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Set buildpack: `heroku buildpacks:set heroku/nodejs`
4. Configure environment variables: `heroku config:set GEMINI_API_KEY=your_key`
5. Deploy: `git push heroku main`

## Production Optimizations

### 1. Add Process Manager (PM2)
```bash
npm install -g pm2
```

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'homecanvas-backend',
    script: 'src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
```

### 2. Add Health Monitoring
The backend includes a `/health` endpoint for monitoring.

### 3. Database Integration (Optional)
If you want to add user accounts or save designs:

```bash
npm install mongoose  # for MongoDB
# or
npm install pg        # for PostgreSQL
```

### 4. File Storage (Optional)
For storing generated images:

```bash
npm install aws-sdk   # for AWS S3
# or
npm install cloudinary # for Cloudinary
```

## Security Checklist

- ✅ Rate limiting enabled
- ✅ CORS configured
- ✅ Helmet security headers
- ✅ File upload validation
- ✅ Environment variables secured
- ⚠️ Add HTTPS in production
- ⚠️ Add API authentication if needed

## Monitoring & Logging

### Add Logging Service
```bash
npm install winston
```

### Add Error Tracking
```bash
npm install @sentry/node
```

## Frontend Changes Required

### 1. Update API Calls
Replace all localhost URLs in your frontend services:

**File: `src/services/geminiAPI.js`**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
```

**File: `src/services/aiChat.js`**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
```

### 2. Add Error Handling
Update your frontend to handle backend errors gracefully.

### 3. Add Loading States
Ensure your frontend shows proper loading states for API calls.

## Testing Deployment

### 1. API Endpoints to Test
- `GET /health` - Health check
- `POST /api/images/generate` - Image generation
- `POST /api/images/analyze` - Room analysis
- `POST /api/chat/message` - AI chat

### 2. Load Testing
```bash
npm install -g artillery
artillery quick --count 10 --num 5 https://your-api-url.com/health
```

## Troubleshooting

### Common Issues:
1. **CORS errors**: Check FRONTEND_URL in backend .env
2. **API key errors**: Verify GEMINI_API_KEY is set correctly
3. **File upload fails**: Check file size limits and types
4. **Memory issues**: Increase server memory or optimize image processing

### Logs to Check:
- Server startup logs
- API request/response logs
- Error logs from Gemini API calls

## Cost Optimization

1. **Gemini API**: Monitor usage and set quotas
2. **Server resources**: Start with minimal specs, scale as needed
3. **Image processing**: Consider caching processed images
4. **CDN**: Use CDN for static assets

## Next Steps After Deployment

1. Set up monitoring and alerts
2. Add user authentication
3. Implement design saving/sharing
4. Add analytics tracking
5. Set up automated backups
6. Configure CI/CD pipeline

---

**Ready to Deploy!** 🚀

Your backend is now ready for deployment. Follow the checklist above and choose your preferred deployment platform.