# Creating AWS S3 Cache Server

```bash
npx nx g nx-custom-cache-server:init my-aws-cache --provider=aws
```

This creates:
- Express.js server with AWS S3 backend
- Prometheus metrics endpoint
- Docker configuration
- Comprehensive documentation

## Environment Setup

1. **Create S3 bucket**:
```bash
aws s3 mb s3://my-nx-cache-bucket
```

2. **Set environment variables**:
```bash
export NX_CACHE_ACCESS_TOKEN=$(openssl rand -hex 32)
export AWS_REGION=us-east-1
export S3_BUCKET_NAME=my-nx-cache-bucket
```

3. **Start the server**:
```bash
cd apps/my-aws-cache
npm install
npm start
```

The server will be available at `http://localhost:3000`
