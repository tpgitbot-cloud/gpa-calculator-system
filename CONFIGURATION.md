# Configuration Guide

## Environment Setup

This project requires NO environment variables for basic functionality.

### Optional Environment Variables

If you want to customize behavior, you can add these to a `.env.local` file (not committed to Git):

```bash
# .env.local (optional - not needed for basic functionality)

# API Configuration
NEXT_PUBLIC_API_TIMEOUT=30000

# File Upload Configuration
NEXT_PUBLIC_MAX_FILE_SIZE=5242880  # 5MB in bytes

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=false
```

## Configuration Files

### package.json
- Defines all dependencies
- Scripts for dev/build/start
- Project metadata

### next.config.ts
- Next.js specific configuration
- No custom options needed for this project

### tailwind.config.ts
- Tailwind CSS configuration
- Theme customization
- Default: Uses Tailwind defaults (no custom theme)

### tsconfig.json
- TypeScript configuration
- Strict mode enabled
- Path aliases configured (@/*)

### .eslintrc.json
- ESLint configuration
- Enforces code quality
- React hooks validation

## Build Configuration

### Development Mode

```bash
npm run dev
```

Features:
- Hot Module Replacement (HMR)
- Source maps for debugging
- Fast refresh on code changes
- Detailed error messages

### Production Mode

```bash
npm run build
npm start
```

Features:
- Fully optimized build
- Code splitting
- Static generation where possible
- Minified output

## Vercel Configuration

Create `vercel.json` if needed (optional):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {},
  "regions": ["iad1"]
}
```

But this is automatically detected, so not needed!

## API Configuration

### Upload API (`/api/upload`)
Settings:
- Max file size: 5MB (soft limit, can be increased)
- Supported format: .xlsx only
- Auto column detection enabled
- Error messages in JSON format

### Calculate API (`/api/calculate`)
Settings:
- GPA calculation per student
- Grade to points mapping (hardcoded - Anna University standard)
- Top 10 students extracted
- Decimal precision: 2 places

### Download API (`/api/download`)
Settings:
- Output format: .xlsx
- Filename: GPA_Result.xlsx
- Includes all student data and calculated GPA

## Customization

### Changing Grades

To modify Anna University grade scale, edit `/app/api/calculate/route.ts`:

```typescript
const gradeToPoint: { [key: string]: number } = {
  O: 10,      // Change these values
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  U: 0,
};
```

### Changing Colors/Theme

Edit `/app/globals.css` and `/components/*.tsx` files:

```css
/* Change primary color from blue to another color */
.bg-blue-600 /* change to bg-purple-600, bg-indigo-600, etc */
```

Or use Tailwind's color system:
- bg-red-600, bg-green-600, bg-purple-600, etc.

### Changing Table Styling

Edit `/components/ResultsTable.tsx`:

```typescript
// Modify colors for top students
isTopStudent ? "top-student" : ""

// Modify colors for failed students
student.hasFail ? "failed-student" : ""
```

### Changing File Upload Limits

Edit `/app/api/upload/route.ts`:

```typescript
if (file.size > 5242880) {  // 5MB limit, change this value
  return NextResponse.json(
    { success: false, error: "File too large" },
    { status: 400 }
  );
}
```

## Performance Tuning

### For Large Files (> 100 students)

1. Implement pagination in ResultsTable
2. Add lazy loading for grade columns
3. Use React.memo for table rows

### For Slow Networks

1. Compress Excel files before upload
2. Implement progress tracking
3. Add retry mechanism

### Memory Optimization

Current implementation:
- Processes entire file in memory (acceptable for < 1000 students)
- For larger files, implement streaming/chunking

## Monitoring & Debugging

### Enable Debug Mode

Add to `.env.local`:
```bash
NEXT_PUBLIC_ENABLE_DEBUG=true
```

Then check browser console for extra logs.

### Check Build Size

```bash
npm run build
```

Look at output for bundle size:
```
Route (app)                Size       First Load JS
┌ ○ /                   4.02 kB    106 kB
```

### Performance Monitoring

1. **Development**: Check Network tab in DevTools
2. **Production**: Vercel provides analytics automatically

## Security Configuration

### Current Security Features

✅ Input validation on file upload
✅ Type safety with TypeScript
✅ XSS protection via React
✅ CORS headers configured properly
✅ No external API calls
✅ No database = no SQL injection

### Additional Security (if needed)

For production with authentication:

```typescript
// Add to API routes
import { headers } from "next/headers";

// Example: Check authorization header
const authHeader = headers().get("authorization");
```

## Scaling Configuration

### For Vercel

Current setup automatically scales:
- Serverless functions auto-scale
- No database needed
- Request caching built-in

### For self-hosted

Edit `next.config.ts`:

```typescript
// Add for self-hosted scenarios
const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  generateEtags: true,
};
```

## Internationalization (i18n)

To add multiple languages, install:

```bash
npm install next-intl
```

Then configure as needed (currently English only).

## Version Management

### Check Dependencies

```bash
npm outdated
```

### Update Dependencies

```bash
npm update          # Minor updates
npm install @latest # Major updates (manual)
```

### Lock Dependencies

`package-lock.json` is automatically generated and committed to Git.

## Troubleshooting Configuration Issues

### "Module not found"
- Run: `npm install`
- Clear cache: `rm -rf .next node_modules`

### "Port 3000 already in use"
- Use different port: `npm run dev -- -p 3001`

### "TypeScript errors after build"
- Ensure all files use proper types
- Check tsconfig.json is correctly configured

### "Vercel build fails"
- Check Vercel logs
- Ensure package-lock.json is committed
- No private environment variables needed

## Recommended IDE Setup

### VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-react-extension"
  ]
}
```

Install with:
```bash
code --install-extension dbaeumer.vscode-eslint
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

---

**No configuration needed to get started! Run `npm run dev` immediately.**
