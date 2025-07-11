# Creating GCP Storage Cache Server

```bash
npx nx g nx-custom-cache-server:init my-gcp-cache --provider=gcp
```

This creates:
- Express.js server with Google Cloud Storage backend
- Prometheus metrics endpoint
- Docker configuration
- Comprehensive documentation

## Environment Setup

1. **Create GCS bucket**:
```bash
gsutil mb gs://my-nx-cache-bucket
```

2. **Set up authentication**:
```bash
# Using service account (recommended for production)
export GOOGLE_CLOUD_KEY_FILE=/path/to/service-account.json

# Or using Application Default Credentials (local development)
gcloud auth application-default login
```

3. **Set environment variables**:
```bash
export NX_CACHE_ACCESS_TOKEN=$(openssl rand -hex 32)
export GOOGLE_CLOUD_PROJECT_ID=my-project-id
export GCS_BUCKET_NAME=my-nx-cache-bucket
```

4. **Start the server**:
```bash
cd apps/my-gcp-cache
npm install
npm start
```

The server will be available at `http://localhost:3000`
