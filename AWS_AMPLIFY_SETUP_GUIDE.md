# AWS Amplify Deployment Guide for Unissential Frontend

**Last Updated**: 2024  
**Status**: Ready for Deployment  
**Prerequisites**: GitHub account with admin access, AWS account with billing enabled

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [AWS Amplify Setup Steps](#aws-amplify-setup-steps)
3. [Environment Variables Configuration](#environment-variables-configuration)
4. [Deployment Verification](#deployment-verification)
5. [Troubleshooting](#troubleshooting)
6. [Post-Deployment](#post-deployment)

---

## Pre-Deployment Checklist

Before beginning AWS Amplify setup, verify the following:

### Code Repository
- [x] Code is pushed to GitHub main branch
- [x] Repository is public or Amplify has access
- [x] No secrets in .gitignore-excluded files
- [x] amplify.yml exists in repository root
- [x] .github/workflows/ci.yml configured for PR validation

### Local Build
- [x] `npm run build` succeeds locally
- [x] `npm run lint` passes
- [x] TypeScript errors fixed (Priority 1)
- [x] ESLint errors resolved (Priority 1)

### Git Configuration
- [x] Repository: `https://github.com/Unissential/unissential-frontend.git`
- [x] Default branch: `main`
- [x] No uncommitted changes

---

## AWS Amplify Setup Steps

### Step 1: Sign In to AWS Console

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Sign in with your AWS account
3. Select your desired region (recommended: `us-east-1`)

### Step 2: Create New App

1. Click **"Create app"** button
2. Select **"Host web app"**
3. Choose **GitHub** as the source control provider
4. Click **"Continue"**

### Step 3: Connect GitHub Repository

1. You'll be prompted to authorize AWS Amplify with GitHub
2. Click **"Authorize aws-amplify"**
3. Review permissions and click **"Authorize"** (grant access to your repositories)

### Step 4: Select Repository and Branch

1. **Repository**: Select `Unissential/unissential-frontend`
2. **Branch**: Select `main`
3. Click **"Next"**

### Step 5: Configure Build Settings

1. **Build and deploy settings**:
   - Amplify will automatically detect your app type (Next.js)
   - It should show "Detected: Next.js"

2. **Review the detected configuration**:
   - If correct, click **"Next"**
   - If incorrect, click **"Edit"** and ensure it matches amplify.yml

3. **Sample detected build configuration**:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```

### Step 6: Save and Deploy

1. Review all settings
2. Click **"Save and deploy"**
3. Amplify will create the app and start the first build

**Expected time for first build**: 2-5 minutes

### Step 7: Monitor Initial Build

1. You'll see build progress in the Amplify console
2. Watch for these phases:
   - **Cloning repository** (1-2 min)
   - **Installing dependencies** (1-2 min)
   - **Building application** (1-2 min)
   - **Deploy successful** ✅

3. Once complete, you'll receive a deployment URL:
   ```
   https://<branch>.<app-id>.amplifyapp.com
   ```

---

## Environment Variables Configuration

### Setting Frontend Environment Variables

After the app is created in Amplify:

1. Go to **App Settings** → **Environment variables**
2. Add each environment variable from your `.env.example`:

   | Variable | Value | Scope |
   |----------|-------|-------|
   | `NEXT_PUBLIC_API_URL` | Your API URL | All environments |
   | `NEXT_PUBLIC_ENABLE_ANALYTICS` | `true` | All environments |
   | `NEXT_PUBLIC_ENABLE_BETA_FEATURES` | `false` | All environments |
   | `NEXT_PUBLIC_STRIPE_KEY` | Your Stripe key | Production |
   | `NEXT_PUBLIC_APP_NAME` | `Unissential` | All environments |
   | `NEXT_PUBLIC_APP_VERSION` | `1.0.0` | All environments |

3. Click **"Save"**

4. **Important**: Any changes to environment variables require a rebuild:
   - Redeploy manually, or
   - Push a new commit to main

### Environment-Specific Variables

If you want different values for different environments (staging vs production):

1. Click the branch selector in Amplify console
2. For each branch, set different values in Environment variables
3. Each branch deployment will use its own environment values

---

## Domain Configuration

### Option 1: Use Amplify Domain (Default)

Your app will be deployed to:
```
https://main.<app-id>.amplifyapp.com
```

This is automatically set up and requires no additional configuration.

### Option 2: Connect Custom Domain

1. Go to **App Settings** → **Domain management**
2. Click **"Add domain"**
3. Enter your custom domain (e.g., `unissential.com`)
4. Follow the DNS configuration steps:
   - Add CNAME record to your DNS provider
   - Wait for DNS propagation (5-10 minutes)

5. Verify domain connection

**Cost**: Custom domains require Route 53 or existing DNS provider

---

## Deployment Verification

### Check Deployment Status

1. **In Amplify Console**:
   - Go to **Deployments**
   - Look for recent deployment
   - Status should show: ✅ **Succeeded**

2. **Build Logs**:
   - Click on deployment to view full build logs
   - Verify all phases completed successfully

### Test Live Application

1. Click on the deployment URL or visit your custom domain
2. Test key pages:
   - [ ] Homepage loads
   - [ ] Marketplace page works (`/marketplace`)
   - [ ] Roommates page works (`/roommates`)
   - [ ] All links functional
   - [ ] API calls work (or show mock data fallback)

3. **Test on multiple browsers**:
   - Chrome
   - Firefox
   - Safari
   - Edge

### Verify Environment Variables

In browser console (F12):
```javascript
// Check if public env vars are available
console.log(process.env.NEXT_PUBLIC_API_URL)
// Should output your API URL, not undefined
```

### Check Performance Metrics

1. Go to **App Analytics** (optional)
2. Monitor:
   - Page load times
   - Error rates
   - User sessions

---

## GitHub Actions Integration

### How CI/CD Works

1. **Developer pushes to GitHub**:
   ```bash
   git push origin main
   ```

2. **GitHub Actions runs** (`.github/workflows/ci.yml`):
   - Installs dependencies
   - Runs ESLint
   - Type checks with TypeScript
   - Builds application
   - Posts results on PR (if PR)

3. **AWS Amplify auto-deploys**:
   - Amplify detects the push
   - Runs build using `amplify.yml`
   - Deploys to production URL
   - Takes 2-5 minutes

### View GitHub Actions Logs

1. Go to GitHub repository
2. Click **"Actions"** tab
3. Select the latest workflow run
4. View build logs and results

### Pull Request Workflow

When you create a pull request:

1. GitHub Actions runs code quality checks
2. Results display on the PR with ✅ or ❌
3. Amplify creates a **Preview Deployment**:
   - Unique URL: `https://pr-<number>.<app-id>.amplifyapp.com`
   - Shows changes before merging
   - Deleted when PR is closed

4. Approve and merge PR → Automatic production deploy

---

## Redeployment & Updates

### Manual Redeploy

If you need to redeploy without code changes:

1. Go to **Deployments** in Amplify console
2. Click the three dots menu on a previous deployment
3. Select **"Redeploy this version"**

### Redeploy After Environment Variable Changes

1. Update environment variables in App Settings
2. Any deployment will use new values
3. Option: Trigger redeploy manually

### Redeploy After amplify.yml Changes

1. Update `amplify.yml` in repository
2. Push to main
3. Amplify automatically uses new build configuration

---

## Troubleshooting

### Build Fails: "npm ci failed"

**Problem**: Dependency installation failed

**Solution**:
1. Check `.github/workflows/ci.yml` logs
2. Try locally: `npm ci --legacy-peer-deps`
3. If peer dependency conflicts exist, add to amplify.yml:
   ```yaml
   - npm ci --legacy-peer-deps
   ```

### Build Fails: "TypeScript type errors"

**Problem**: Type checking failed

**Solution**:
1. Check `AWS_AMPLIFY_DEPLOYMENT_ANALYSIS.md` for issue list
2. Fix TypeScript errors locally
3. Run `npx tsc --noEmit` to verify
4. Push fix to main

### Build Fails: "ESLint errors"

**Problem**: ESLint validation failed

**Solution**:
1. Run `npm run lint` locally
2. Fix errors (or use `npm run lint:fix`)
3. Run formatting: `npm run format`
4. Push changes

### Build Succeeds but Site Shows 404

**Problem**: Application deployed but routes not working

**Solution**:
1. Verify `.next/` folder structure in deployment
2. Check that amplify.yml includes `.next/` artifacts
3. Ensure Next.js build succeeded (check logs)
4. Try different route (some might not exist)

### Environment Variables Not Available

**Problem**: `process.env.NEXT_PUBLIC_*` returns undefined

**Solution**:
1. Verify variables are set in Amplify Console
2. Must be `NEXT_PUBLIC_*` prefix (browser-exposed)
3. After changing, trigger new deployment
4. Clear browser cache: Ctrl+Shift+Delete
5. Try in private/incognito window

### Staging vs Production Different Content

**Problem**: Different environments show different data

**Solution**:
1. Check if different environment variables are set per branch
2. Each branch must have full set of variables
3. Missing variables will cause different behavior

---

## Post-Deployment Checklist

After successful deployment:

- [ ] Application loads without errors
- [ ] All pages accessible
- [ ] API calls working (or mock data shown)
- [ ] Environment variables in browser console
- [ ] Performance acceptable (check Core Web Vitals)
- [ ] Security headers present
- [ ] No console errors
- [ ] Mobile responsive design works
- [ ] Forms and interactions working
- [ ] Images loading properly

---

## Monitoring & Maintenance

### Enable Logs and Monitoring

1. **Build Logs**:
   - Amplify keeps last 30 builds
   - Access via **Deployments** → Deployment details

2. **CloudWatch Logs** (optional):
   - Enable in App Settings
   - Integrates with AWS CloudWatch
   - Useful for production debugging

3. **Performance Monitoring**:
   - Amplify provides performance metrics
   - Monitor build times and error rates
   - Set up alerts for failures

### Regular Maintenance

**Weekly**:
- Review deployment logs
- Check for build failures
- Monitor error rates

**Monthly**:
- Update dependencies: `npm update`
- Review security audit: `npm audit`
- Check performance metrics

**Quarterly**:
- Review Next.js version updates
- Test new features
- Plan infrastructure improvements

---

## Scaling & Advanced Configuration

### As Traffic Grows

1. **Amplify auto-scales** - No configuration needed
2. **Cache optimization**:
   - Amplify CDN is global
   - Static content cached at edge
   - Performance improves automatically

### Custom Domain with SSL

1. Amplify provides **free SSL/TLS certificates**
2. Automatic renewal - no manual action needed
3. HTTPS enabled by default

### Branching Strategy

**Current setup**:
- `main` → Production deployment
- Other branches → Preview deployments

**Advanced**: Create separate environments:
- `main` → Production
- `develop` → Staging
- Feature branches → Preview

---

## Cost Estimation

### Amplify Pricing (as of 2024)

**Build & Hosting**:
- First 125 build minutes/month: Free
- After 125 minutes: $0.01 per build minute
- Bandwidth: $0.15 per GB (after 15GB free/month)
- Typical small app: **$0-5/month**

**Additional Services** (optional):
- Custom domain: ~$12/year
- Route 53 DNS: $0.50/month
- CloudWatch logs: Pay-per-use

### Cost Optimization

1. Use default Amplify domain (no Route 53 cost)
2. Build caching reduces build times
3. Next.js ISR reduces overall bandwidth
4. Free tier usually sufficient for MVP

---

## Support & Resources

### Official Documentation

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Next.js Deployment on Amplify](https://docs.aws.amazon.com/amplify/latest/userguide/deploy-nextjs.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

### Troubleshooting Resources

- [Amplify FAQ](https://docs.aws.amazon.com/amplify/latest/userguide/faq.html)
- [Common Issues & Solutions](https://docs.aws.amazon.com/amplify/latest/userguide/troubleshooting.html)
- [AWS Support](https://console.aws.amazon.com/support/)

### Getting Help

1. Check Amplify console logs first
2. Review AWS Amplify documentation
3. Search GitHub Issues
4. Post on AWS Forum or Stack Overflow
5. Contact AWS Support (requires paid plan)

---

## Next Steps

1. ✅ Read this guide
2. ✅ Ensure all code quality checks pass
3. ✅ Sign in to AWS Console
4. ✅ Follow "AWS Amplify Setup Steps" section
5. ✅ Configure environment variables
6. ✅ Monitor first deployment
7. ✅ Test live application
8. ✅ Set up custom domain (optional)

---

**After completing these steps, your Unissential frontend will be deployed and accessible at your Amplify URL!**

For questions or issues, refer to the [Troubleshooting](#troubleshooting) section or consult the official AWS Amplify documentation.

---

**Deployment Guide Version**: 1.0  
**Last Updated**: 2024  
**Status**: Ready for Production
