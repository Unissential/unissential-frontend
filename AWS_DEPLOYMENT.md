# AWS Deployment Guide for Unissential

## Overview

This guide covers deploying the Unissential Docker containers to AWS using multiple approaches:
- AWS ECS (Elastic Container Service)
- AWS EKS (Elastic Kubernetes Service)
- AWS Amplify (for frontend only)

## Prerequisites

- AWS Account
- AWS CLI configured (`aws configure`)
- Docker CLI
- Docker images built locally
- Terraform or CloudFormation (optional)

## Architecture Overview

```
                    ┌─────────────────────┐
                    │    Route 53 (DNS)   │
                    │ unissential.com     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  CloudFront (CDN)   │
                    │   (Optional)        │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Application Load    │
                    │ Balancer (ALB)      │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
    ┌───▼────┐         ┌──────▼───────┐      ┌───────▼──┐
    │Frontend │         │  Backend     │      │ Workers  │
    │(ECS)    │         │  (ECS)       │      │ (ECS)    │
    └────────┘         └──────────────┘      └──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ RDS PostgreSQL      │
                    │ (Multi-AZ)          │
                    └─────────────────────┘

    Optional: S3 + CloudFront for static assets
    Optional: ElastiCache for Redis caching
    Optional: SQS for job queues
```

## Approach 1: AWS ECS (Recommended for Quick Start)

### Step 1: Create ECR Repositories

```bash
# Create repositories
aws ecr create-repository \
  --repository-name unissential/frontend \
  --region us-east-1

aws ecr create-repository \
  --repository-name unissential/backend \
  --region us-east-1

# Get login token and push images
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Tag images
docker tag unissential-frontend:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/unissential/frontend:latest
docker tag unissential-backend:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/unissential/backend:latest

# Push to ECR
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/unissential/frontend:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/unissential/backend:latest
```

### Step 2: Create RDS PostgreSQL Database

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier unissential-postgres \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 16.0 \
  --master-username admin \
  --master-user-password "<STRONG_PASSWORD>" \
  --allocated-storage 20 \
  --storage-type gp2 \
  --publicly-accessible false \
  --multi-az true \
  --backup-retention-period 7 \
  --region us-east-1
```

### Step 3: Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster \
  --cluster-name unissential-prod \
  --region us-east-1

# Register task definition (see ecsTaskDefinition.json below)
aws ecs register-task-definition \
  --cli-input-json file://ecsTaskDefinition.json \
  --region us-east-1
```

### Step 4: Create ECS Services

```bash
# Create backend service
aws ecs create-service \
  --cluster unissential-prod \
  --service-name unissential-backend \
  --task-definition unissential-backend:1 \
  --desired-count 2 \
  --launch-type EC2 \
  --region us-east-1

# Create frontend service
aws ecs create-service \
  --cluster unissential-prod \
  --service-name unissential-frontend \
  --task-definition unissential-frontend:1 \
  --desired-count 2 \
  --launch-type EC2 \
  --region us-east-1
```

### Step 5: Configure Load Balancer

```bash
# Create Application Load Balancer
aws elbv2 create-load-balancer \
  --name unissential-alb \
  --subnets subnet-xxx subnet-yyy \
  --security-groups sg-xxx \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4 \
  --region us-east-1

# Create target groups
aws elbv2 create-target-group \
  --name unissential-backend \
  --protocol HTTP \
  --port 5000 \
  --vpc-id vpc-xxx \
  --region us-east-1

aws elbv2 create-target-group \
  --name unissential-frontend \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxx \
  --region us-east-1

# Create listeners
aws elbv2 create-listener \
  --load-balancer-arn <ALB_ARN> \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=<FRONTEND_TG_ARN> \
  --region us-east-1

aws elbv2 create-listener \
  --load-balancer-arn <ALB_ARN> \
  --protocol HTTP \
  --port 5000 \
  --default-actions Type=forward,TargetGroupArn=<BACKEND_TG_ARN> \
  --region us-east-1
```

### ECS Task Definition (ecsTaskDefinition.json)

```json
{
  "family": "unissential-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["EC2"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "unissential-backend",
      "image": "<ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/unissential/backend:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "hostPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "5000"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<ACCOUNT_ID>:secret:DATABASE_URL"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<ACCOUNT_ID>:secret:JWT_SECRET"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/unissential-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:5000/api/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ],
  "executionRoleArn": "arn:aws:iam::<ACCOUNT_ID>:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::<ACCOUNT_ID>:role/ecsTaskRole"
}
```

## Approach 2: AWS EKS (Kubernetes)

### Step 1: Create EKS Cluster

```bash
# Create cluster
aws eks create-cluster \
  --name unissential-eks \
  --version 1.27 \
  --role-arn arn:aws:iam::<ACCOUNT_ID>:role/eks-service-role \
  --resources-vpc-config subnetIds=subnet-xxx,subnet-yyy \
  --region us-east-1

# Update kubeconfig
aws eks update-kubeconfig \
  --name unissential-eks \
  --region us-east-1
```

### Step 2: Create Node Group

```bash
aws eks create-nodegroup \
  --cluster-name unissential-eks \
  --nodegroup-name unissential-nodes \
  --subnets subnet-xxx subnet-yyy \
  --node-role arn:aws:iam::<ACCOUNT_ID>:role/NodeInstanceRole \
  --instance-types t3.medium \
  --desired-size 2 \
  --min-size 1 \
  --max-size 4 \
  --region us-east-1
```

### Step 3: Deploy Services

```bash
# Create namespace
kubectl create namespace unissential

# Create secrets
kubectl create secret generic db-secret \
  --from-literal=DATABASE_URL=postgresql://user:password@rds-endpoint:5432/db \
  -n unissential

kubectl create secret generic jwt-secret \
  --from-literal=JWT_SECRET=your-secret-key \
  -n unissential

# Deploy backend
kubectl apply -f k8s/backend-deployment.yaml -n unissential
kubectl apply -f k8s/backend-service.yaml -n unissential

# Deploy frontend
kubectl apply -f k8s/frontend-deployment.yaml -n unissential
kubectl apply -f k8s/frontend-service.yaml -n unissential

# Deploy ingress
kubectl apply -f k8s/ingress.yaml -n unissential
```

### Sample Kubernetes Deployment (k8s/backend-deployment.yaml)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: unissential-backend
  namespace: unissential
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/unissential/backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "5000"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: DATABASE_URL
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: JWT_SECRET
        livenessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: unissential
spec:
  type: ClusterIP
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 5000
    targetPort: 5000
```

## Approach 3: AWS Amplify (Frontend Only)

### Step 1: Connect GitHub Repository

```bash
# Configure amplify.yml in repository root
cat > amplify.yml << 'EOF'
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
  cache:
    paths:
      - node_modules/**/*

backend:
  phases:
    build:
      commands:
        - echo "Backend is deployed via ECS/EKS"
EOF
```

### Step 2: Deploy via Console

1. Go to AWS Amplify console
2. Click "New app" → "Host web app"
3. Connect GitHub repository
4. Configure build settings
5. Deploy

### Step 3: Configure Custom Domain

```bash
# Add custom domain in Amplify console
# unissential.com → amplify.com CNAME record
```

## Environment Variables in AWS

### AWS Secrets Manager

```bash
# Store secrets
aws secretsmanager create-secret \
  --name unissential/jwt-secret \
  --secret-string "your-secret-key-here"

aws secretsmanager create-secret \
  --name unissential/database-url \
  --secret-string "postgresql://user:password@rds:5432/db"

# Retrieve secrets
aws secretsmanager get-secret-value \
  --secret-id unissential/jwt-secret
```

### AWS Systems Manager Parameter Store

```bash
# Store parameters
aws ssm put-parameter \
  --name /unissential/NODE_ENV \
  --value "production" \
  --type "String"

# Retrieve parameters
aws ssm get-parameter --name /unissential/NODE_ENV
```

## Monitoring & Logging

### CloudWatch Logs

```bash
# Create log group
aws logs create-log-group --log-group-name /unissential/backend

# View logs
aws logs tail /unissential/backend --follow
```

### CloudWatch Alarms

```bash
# Create alarm for backend health
aws cloudwatch put-metric-alarm \
  --alarm-name unissential-backend-health \
  --alarm-description "Backend health check" \
  --metric-name HealthyHostCount \
  --namespace AWS/ApplicationELB \
  --statistic Average \
  --period 300 \
  --threshold 1 \
  --comparison-operator LessThanThreshold
```

### AWS X-Ray

```bash
# Enable X-Ray tracing in backend
npm install aws-xray-sdk-core

# In app.ts
import AWSXRay from 'aws-xray-sdk-core';
const http = AWSXRay.captureHTTPsGlobal(require('http'));
const postgres = AWSXRay.captureDBClient(require('pg'));
```

## Cost Optimization

1. **Use Spot Instances** (ECS): Save ~70% on compute
2. **RDS Reserved Instances**: Multi-year commitments
3. **CloudFront**: Cache static assets globally
4. **ElastiCache**: Reduce database queries
5. **Auto-scaling**: Scale based on demand
6. **VPC**: Use NAT Gateway optimization

## CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push backend
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: unissential/backend
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:latest ./backend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
      
      - name: Build and push frontend
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: unissential/frontend
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:latest .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster unissential-prod \
            --service unissential-backend \
            --force-new-deployment
```

## Disaster Recovery

### Database Backup

```bash
# Create RDS snapshot
aws rds create-db-snapshot \
  --db-instance-identifier unissential-postgres \
  --db-snapshot-identifier unissential-postgres-backup-$(date +%s)

# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier unissential-postgres-restored \
  --db-snapshot-identifier unissential-postgres-backup-<timestamp>
```

### Multi-Region Deployment

1. Set up primary region (us-east-1)
2. Set up secondary region (us-west-2)
3. Use Route 53 for failover
4. Replicate databases across regions

## Scaling Strategy

### Horizontal Scaling

- **Auto Scaling Groups** (ECS)
- **Horizontal Pod Autoscaler** (EKS)
- Target: CPU > 70% → scale up
- Target: CPU < 30% → scale down

### Vertical Scaling

- Increase EC2/RDS instance type
- Increase memory allocation
- Increase container resource limits

## Security Best Practices

1. **Use VPC Endpoints** for AWS service access
2. **Enable WAF** on ALB
3. **Use KMS** for encryption at rest
4. **Enable VPC Flow Logs** for monitoring
5. **Implement Security Groups** with least privilege
6. **Use Secrets Manager** for sensitive data
7. **Enable CloudTrail** for audit logs
8. **Regular vulnerability scans** of ECR images

## Next Steps

1. **Choose deployment approach** (ECS recommended for quick start)
2. **Set up AWS infrastructure** using provided scripts
3. **Configure CI/CD pipeline** for automated deployments
4. **Set up monitoring** and alerting
5. **Plan scaling strategy** based on usage patterns
6. **Document runbooks** for common operations

## Support & Resources

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS EKS Documentation](https://docs.aws.amazon.com/eks/)
- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [AWS Best Practices](https://aws.amazon.com/architecture/well-architected/)
