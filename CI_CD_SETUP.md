# CI Pipeline Setup for PhoolPatte

This guide walks you through the CI pipeline for automated testing. Deployment is handled manually via Claude Code.

## What's Been Set Up

✅ **GitHub Actions CI Pipeline** (`.github/workflows/ci-cd.yml`)
- Automatically runs on every push to `master` branch
- Runs backend & frontend tests
- Builds both applications
- Reports results on GitHub

✅ **Backend Testing** (Jest)
- Jest configuration ready at `backend/jest.config.js`
- Sample test file at `backend/src/__tests__/sample.test.ts`
- Run locally: `cd backend && npm test`

✅ **Frontend Testing** (Vitest)
- Vitest configuration ready at `frontend/vitest.config.ts`
- Run locally: `cd frontend && npm test`
- Watch mode: `cd frontend && npm run test:watch`

---

## Step 1: Install Dependencies Locally

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

---

## Step 2: Test Locally

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Build Everything
```bash
cd backend && npm run build
cd ../frontend && npm run build
```

---

## Step 3: Push to Master and Watch Tests Run

Once you've committed your code:

```bash
git add .
git commit -m "Set up CI pipeline"
git push origin master
```

**Monitor the tests:**
1. Go to GitHub → Your repository → Actions tab
2. Watch the workflow run in real-time
3. Check test results and build status

---

## Understanding the Workflow

### What happens on every push to master:

1. **Test Job**
   - Sets up Node.js environment
   - Spins up PostgreSQL test database
   - Runs backend tests (`npm test`)
   - Runs frontend tests (`npm test`)
   - Builds both applications
   - ✅ Ready for manual deployment

---

## Step 4: Deploy Manually Via Claude Code

Once tests pass on GitHub Actions, deploy to staging through Claude Code:

```bash
# SSH into EC2
ssh -i ~/Downloads/testkey.pem ec2-user@32.236.8.241

# Pull latest code
cd /home/ec2-user/PhoolPatte-master
git pull origin master

# Build and deploy backend
cd backend
npm install --production
npm run build
pm2 restart phoolpatte-backend || pm2 start dist/index.js --name phoolpatte-backend
cd ..

# Build and deploy frontend
cd frontend
npm install --production
npm run build
# Frontend serving setup (nginx, vercel, etc)
```

Or have Claude Code help you deploy with a simple request!

---

## Adding More Tests

### Backend Tests
Create test files following this pattern:
```
backend/src/__tests__/feature.test.ts
backend/src/routes/__tests__/auth.test.ts
```

Example:
```typescript
describe('Authentication', () => {
  it('should validate user login', () => {
    // Your test here
    expect(true).toBe(true);
  });
});
```

### Frontend Tests
```
frontend/src/__tests__/App.test.tsx
frontend/src/components/__tests__/Header.test.tsx
```

Example:
```typescript
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders', () => {
    render(<App />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

---

## Troubleshooting

### Tests fail locally but pass in CI (or vice versa)
- Check Node.js version matches: `node --version`
- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
- Check environment variables in `.env` or `.env.test`

### Tests fail in GitHub Actions
- Check postgres service is running (logs will show connection errors)
- Verify all dependencies are installed: `npm install`
- Check DATABASE_URL and NODE_ENV are set correctly in workflow

### PM2 won't restart on EC2
- SSH into EC2: `pm2 list` to see all processes
- Check logs: `pm2 logs phoolpatte-backend`
- Manually restart: `pm2 restart phoolpatte-backend` or `pm2 restart all`

---

## Next Steps

1. **Add more unit tests** for critical paths
2. **Add integration tests** for API endpoints
3. **Add E2E tests** for user flows
4. **Set up code coverage tracking**
5. **Add staging health checks** in the workflow

---

## Quick Reference

```bash
# Local testing
npm test                    # Run tests once
npm run test:watch         # Watch mode (frontend only)

# Local building
npm run build              # Build application

# GitHub Actions
git push origin master     # Triggers CI tests

# Manual deployment via Claude Code
ssh -i testkey.pem ec2-user@32.236.8.241
cd /home/ec2-user/PhoolPatte-master
git pull origin master

# EC2 Management
pm2 logs                   # View live logs
pm2 list                   # List running processes
pm2 restart phoolpatte-backend
```
