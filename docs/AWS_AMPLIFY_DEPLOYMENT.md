# AWS Amplify Deployment Guide

## Complete Setup for Production Deployment

---

## Step 1: Prepare Your GitHub Repository

### 1.1 Branch Strategy

```bash
# Create production branches
main          # Production (auto-deploy)
staging       # Staging (auto-deploy)
develop       # Development (manual PR)
feature/*     # Feature branches (preview)
```

### 1.2 Add Deployment Configuration Files

```bash
# Already created:
✅ amplify.yml
✅ .github/workflows/ci-cd.yml
✅ .env.example
✅ .env.production
```

### 1.3 Update .gitignore

```bash
# Ensure secrets are never committed
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
echo ".env.production.local" >> .gitignore
echo "/.next/" >> .gitignore
echo "/node_modules/" >> .gitignore
```

---

## Step 2: Set Up AWS Account

### 2.1 Create AWS Account

1. Go to [AWS Console](https://aws.amazon.com/console/)
2. Sign up for new account
3. Set up billing alerts (very important!)

### 2.2 Create IAM User for Amplify

```bash
# In AWS Console > IAM > Users > Create User

User name: unissential-amplify
Access type: Programmatic access + AWS Management Console

Attach policies:
- AmplifyFullAccess
- S3FullAccess
- CloudFrontFullAccess
```

### 2.3 Get AWS Credentials

```bash
# Save these in a safe place:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION (us-east-1)
```

### 2.4 Create S3 Bucket for Uploads

```bash
# AWS Console > S3 > Create bucket

Bucket name: unissential-uploads-prod
Region: us-east-1
Block Public Access: OFF (for public uploads)
Versioning: ON

# Add bucket policy for public read
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::unissential-uploads-prod/*"
    }
  ]
}

# Enable CORS for uploads
[
  {
    "AllowedOrigins": ["https://app.unissential.com"],
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "ExposeHeaders": ["ETag"]
  }
]
```

---

## Step 3: Set Up AWS Amplify Console

### 3.1 Connect GitHub Repository

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "Create app" > "Host web app"
3. Select "GitHub" as repository
4. Authorize Amplify to access your GitHub
5. Select `Unissential` repository
6. Select `main` branch for production

### 3.2 Configure Build Settings

```yaml
# App settings > Build and test

Build command: npm run build
Test command: npm run lint
Artifact directory: .next
```

### 3.3 Set Environment Variables

**Production Environment:**
```
NEXT_PUBLIC_APP_NAME: Unissential
NEXT_PUBLIC_APP_URL: https://app.unissential.com
NEXT_PUBLIC_API_URL: https://api.unissential.com
NEXT_PUBLIC_AWS_REGION: us-east-1
NEXT_PUBLIC_AWS_S3_BUCKET: unissential-uploads-prod
```

**Staging Environment:**
```
NEXT_PUBLIC_APP_NAME: Unissential Staging
NEXT_PUBLIC_APP_URL: https://staging.unissential.com
NEXT_PUBLIC_API_URL: https://staging-api.unissential.com
NEXT_PUBLIC_AWS_REGION: us-east-1
NEXT_PUBLIC_AWS_S3_BUCKET: unissential-uploads-staging
```

### 3.4 Enable Preview Deployments

Settings > Preview > Enable automatic preview for pull requests

---

## Step 4: GitHub Secrets Configuration

### 4.1 Add Secrets to GitHub

```bash
# Go to: GitHub > Settings > Secrets and variables > Actions

# Add these secrets:
AWS_ACCESS_KEY_ID: (from step 2.3)
AWS_SECRET_ACCESS_KEY: (from step 2.3)
AMPLIFY_TOKEN: (generate in Amplify)
NEXT_PUBLIC_API_URL: https://api.unissential.com
```

### 4.2 Generate Amplify Token

```bash
# AWS Amplify Console > Personal access tokens > Create new token

# Copy token and add to GitHub secrets as AMPLIFY_TOKEN
```

---

## Step 5: Custom Domain Setup

### 5.1 Connect Custom Domain

```bash
# AWS Amplify Console > Domain management > Connect domain

Domain: app.unissential.com

# Route53 DNS records will be auto-created
# (if using Route53) or show nameservers to update with registrar
```

### 5.2 Add Subdomain for Staging

```bash
# Add subdomain in Amplify
Subdomain: staging.app.unissential.com
```

### 5.3 Enable HTTPS/SSL

```bash
# Automatically provisioned by Amplify (free)
# AWS Certificate Manager handles SSL certificates
```

---

## Step 6: Set Up Monitoring & Alerts

### 6.1 CloudWatch Monitoring

```bash
# AWS Console > CloudWatch > Create alarm

Monitor: Amplify Build Success Rate
Threshold: < 95% = Alert
SNS Topic: dev-team@unissential.com
```

### 6.2 Enable Logging

```yaml
# amplify.yml
frontend:
  logs:
    retention: 24 # Keep logs for 24 hours
```

### 6.3 Monitor 4xx/5xx Errors

```bash
# CloudFront > Distributions > Monitoring

# Alert if 5xx errors > 1% of requests
# Alert if 4xx errors spike > normal baseline
```

---

## Step 7: Testing Deployment

### 7.1 Local Testing

```bash
# Test build locally before pushing
npm run build

# Start production build
npm run start

# Test at http://localhost:3000
```

### 7.2 Test on Staging

```bash
# Push to staging branch
git checkout staging
git merge develop
git push origin staging

# Wait for Amplify deploy
# Visit https://staging.unissential.com
# Test all features
```

### 7.3 Deploy to Production

```bash
# After staging tested successfully
git checkout main
git merge staging
git push origin main

# Monitor deployment in Amplify console
# Takes ~5-10 minutes
```

---

## Production Checklist

Before each production deployment:

### Code Quality
- [ ] All tests passing
- [ ] ESLint clean
- [ ] No TypeScript errors
- [ ] No console.logs
- [ ] No hardcoded secrets

### Performance
- [ ] Lighthouse score > 90
- [ ] Bundle size < 200KB (gzipped)
- [ ] Images optimized
- [ ] Code splitting working

### Security
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] No sensitive data in environment variables
- [ ] Authentication tokens secure
- [ ] API rate limiting active

### Testing
- [ ] User flows tested
- [ ] Mobile responsive tested
- [ ] Browser compatibility tested
- [ ] Payment flow tested (if applicable)

### Monitoring
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Uptime monitoring active
- [ ] Alerts configured

---

## Post-Deployment Verification

### Verify Production Deployment

```bash
# 1. Check site loads
curl https://app.unissential.com

# 2. Check SSL certificate
echo | openssl s_client -connect app.unissential.com:443

# 3. Check performance metrics
# Visit Lighthouse: https://web.dev/measure/

# 4. Check error tracking
# Visit Sentry dashboard

# 5. Check analytics
# Visit analytics service
```

### Monitor for Issues

```bash
# First 24 hours after deployment:
- Monitor error rates
- Check user activity
- Watch performance metrics
- Monitor API response times
- Check server logs

# If issues detected:
1. Rollback: git revert & push to main
2. Fix locally and re-test on staging
3. Redeploy when ready
```

---

## Scaling for Growth

### 6 Months Later: Add Backend API

```bash
# 1. Set up AWS API Gateway
# 2. Add Lambda functions for endpoints
# 3. Connect RDS database
# 4. Update NEXT_PUBLIC_API_URL
# 5. Implement authentication
```

### 1 Year Later: Add More Services

```bash
# Services to add:
- WebSocket server (for real-time chat)
- Search service (Elasticsearch)
- Task queue (AWS SQS/SNS)
- File processing (AWS Lambda)
- Analytics service (AWS QuickSight)
```

---

## Cost Estimation

### Monthly AWS Costs (Estimate)

```
Amplify (builds + hosting):     $1-5
S3 (file storage):              $5-20
CloudFront (CDN):               $0-10
DynamoDB (if used):             $0-25
Total:                          $10-60/month

* Scales with traffic
* Free tier available for first 12 months
```

### Ways to Reduce Costs

- Use AWS Free Tier (eligible for 12 months)
- Compress images (CDN bandwidth)
- Set S3 lifecycle policies (delete old uploads)
- Use caching headers (reduce requests)
- Monitor CloudFront usage

---

## Troubleshooting Common Issues

### Issue: Build Fails

**Solution:**
```bash
# Check Amplify build logs
Amplify Console > Build > View logs

# Common causes:
- Missing environment variables
- Node version mismatch
- Dependency conflicts
```

### Issue: Deploy Takes Too Long

**Solution:**
```yaml
# amplify.yml
# Add caching
cache:
  paths:
    - 'node_modules/**/*'
    - '.next/cache/**/*'
```

### Issue: Site Loads Slowly

**Solution:**
```bash
# 1. Enable compression
# 2. Enable caching headers
# 3. Optimize images
# 4. Enable CloudFront
```

### Issue: SSL Certificate Errors

**Solution:**
```bash
# Amplify handles auto-renewal
# If issue persists:
1. Amplify Console > Domain > Resend verification
2. Wait 5 minutes for verification
3. Clear browser cache
```

---

## Next Steps

1. **Week 1:** Complete AWS setup
2. **Week 2:** Deploy to staging
3. **Week 3:** Deploy to production
4. **Ongoing:** Monitor metrics and scale

---

*Last Updated: May 2026*
*AWS Amplify + Next.js 15 Production Setup*
