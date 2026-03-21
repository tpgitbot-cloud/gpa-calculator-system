# Deployment Guide - GPA Calculator System

## Vercel Deployment (Recommended)

### Option 1: One-Click Deploy (Easiest)

1. Push your code to GitHub, GitLab, or Bitbucket
2. Visit [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Click "Deploy"

That's it! Your app will be live in seconds.

### Option 2: CLI Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel
```

### Environment Variables
None required! This project works out of the box.

## Local Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation Steps

```bash
# Clone repository
git clone <your-repo-url>
cd gpa-calculator

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

## Production Deployment

### Build Locally

```bash
npm run build
npm start
```

Your app will run at `http://localhost:3000`

### Build Size
- Total size: ~4MB
- First Load JS: 106 kB
- Optimized for serverless environments

## Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t gpa-calculator .
docker run -p 3000:3000 gpa-calculator
```

## Deployment Platforms

### Vercel (Recommended)
- Zero configuration
- Automatic deployments from Git
- Serverless functions included
- Free tier available

### Netlify
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Deploy

### AWS
- Use AWS Amplify for easy deployment
- Or use EC2 with Node.js installation

### DigitalOcean
- Create droplet with Node.js
- Or use App Platform

### Heroku (Legacy)
- Requires paid tier for Node.js
- Use Vercel instead

## Production Configuration

### Performance Optimizations
- ✅ Static site generation enabled
- ✅ API routes cached appropriately
- ✅ Images optimized with next/image
- ✅ CSS minified automatically
- ✅ JavaScript minified automatically

### Security Best Practices
- ✅ Input validation on file upload
- ✅ Type-safe with TypeScript
- ✅ No SQL injection risks (no database)
- ✅ XSS protection via React
- ✅ CORS headers configured

### Monitoring & Logs

**On Vercel:**
- Real-time logs in Vercel Dashboard
- Error tracking with Sentry (optional)
- Performance monitoring built-in

**On other platforms:**
```bash
# Check error logs
npm start
```

## Troubleshooting Deployment

### Build fails with "Module not found"
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Application crashes on Vercel
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in package.json
3. No environment variables needed

### Slow performance
- Clear browser cache
- Check file sizes in build output
- Ensure stable internet connection

### Excel upload fails
- File must be .xlsx format
- File size under 5MB
- Valid data structure

## Monitoring URLs

After deployment:
1. **Main App**: https://your-app.vercel.app
2. **API Routes**:
   - Upload: https://your-app.vercel.app/api/upload
   - Calculate: https://your-app.vercel.app/api/calculate
   - Download: https://your-app.vercel.app/api/download

## Scaling for Large Files

The current setup handles:
- ✅ Up to 100 students instantly
- ✅ File sizes up to 5MB
- ✅ Multiple simultaneous uploads

For larger files:
- Consider implementing streaming
- Add job queue (Bull, RabbitMQ)
- Use AWS Lambda or Google Cloud Functions

## Backup & Recovery

### Backup your data
1. Keep your Excel files backed up
2. Use version control for code
3. Store configuration files safely

### Recovery
1. Database not needed (stateless)
2. Just redeploy from Git
3. No data loss risk

## Support & Help

- **Documentation**: See README.md
- **Issues**: Check GitHub issues
- **Email**: your-email@example.com

## Cost Estimation

**Vercel (Recommended):**
- Free tier: Perfect for this app
- Pro tier: $20/month (if needed)
- Enterprise: Custom pricing

**Other platforms:**
- AWS: ~$10-50/month
- DigitalOcean: $5-12/month
- Heroku: $25/month minimum (legacy)

## Next Steps

1. ✅ Push to Git repository
2. ✅ Connect to Vercel/deployment platform
3. ✅ Test with sample Excel file
4. ✅ Share deployed URL with users
5. ✅ Monitor performance & logs

---

**Ready to deploy? Go to [Vercel](https://vercel.com) and start now!**
