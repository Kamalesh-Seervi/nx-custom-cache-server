# nx-custom-cache-server

[![npm version](https://badge.fury.io/js/%40nx-cache%2Fserver-plugin.svg)](https://www.npmjs.com/package/nx-custom-cache-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Professional Nx plugin for generating high-performance cache servers with cloud storage backends**

Generate production-ready Nx cache servers with support for Google Cloud Storage (GCP) and AWS S3 backends. Built with Express.js, includes Prometheus metrics, Docker support, and comprehensive security features.

## 🚀 Quick Start

```bash
# Install the plugin (with interactive setup)
npm install --save-dev nx-custom-cache-server

# Or generate directly
npx nx g nx-custom-cache-server:init my-cache-server
```

**✨ New Feature**: After installation, you'll get an interactive prompt to set up your cache server immediately!

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌩️ **Multi-Cloud** | Support for GCP (Cloud Storage) and AWS (S3) |
| ⚡ **High Performance** | Streaming uploads/downloads, optimized for large artifacts |
| 📊 **Observability** | Prometheus metrics, structured logging, health checks |
| 🔒 **Security** | Bearer token auth, input validation, secure defaults |
| 🐳 **Production Ready** | Docker support, graceful shutdown, error handling |
| 🎯 **Developer Friendly** | Interactive CLI, comprehensive docs, TypeScript support |

## 🏗️ Architecture & Core Logic

### How Nx Cache Servers Work

Nx cache servers act as remote storage for build artifacts, enabling teams to share compiled outputs across different machines and CI/CD pipelines. This dramatically reduces build times by avoiding redundant computations.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Nx Cache Server Architecture                      │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │ Developer A │    │ Developer B │    │   CI/CD     │
    │   Machine   │    │   Machine   │    │  Pipeline   │
    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
           │                  │                  │
           │ nx build/test    │ nx build/test    │ nx build/test
           │                  │                  │
           ▼                  ▼                  ▼
    ┌─────────────────────────────────────────────────────┐
    │              Nx Cache Server (Express.js)           │
    │  ┌─────────────────────────────────────────────────┐ │
    │  │             REST API Endpoints                  │ │
    │  │  PUT /artifacts/:hash  │  GET /artifacts/:hash  │ │
    │  │  ─────────────────────────────────────────────  │ │
    │  │  • Bearer Token Auth  │  • Stream Download     │ │
    │  │  • Artifact Upload    │  • Cache Hit/Miss      │ │
    │  │  • Hash Validation    │  • Prometheus Metrics  │ │
    │  └─────────────────────────────────────────────────┘ │
    │  ┌─────────────────────────────────────────────────┐ │
    │  │              Storage Abstraction Layer          │ │
    │  │     GCP Provider     │     AWS Provider         │ │
    │  │  ──────────────────────────────────────────────  │ │
    │  │  • Google Cloud      │  • AWS S3 SDK           │ │
    │  │    Storage SDK       │  • Multipart Upload     │ │
    │  │  • Stream Upload     │  • Stream Download       │ │
    │  │  • Bucket Operations │  • Object Operations     │ │
    │  └─────────────────────────────────────────────────┘ │
    └─────────────────┬───────────────────────────────────┘
                      │
                      ▼
    ┌─────────────────────────────────────────────────────┐
    │              Cloud Storage Backend                  │
    │  ┌─────────────────────┐  ┌─────────────────────┐   │
    │  │  Google Cloud       │  │      AWS S3         │   │
    │  │    Storage          │  │     Bucket          │   │
    │  │                     │  │                     │   │
    │  │  my-nx-cache/       │  │  my-nx-cache/       │   │
    │  │  ├── abc123.tar.gz  │  │  ├── abc123.tar.gz  │   │
    │  │  ├── def456.tar.gz  │  │  ├── def456.tar.gz  │   │
    │  │  └── ...            │  │  └── ...            │   │
    │  └─────────────────────┘  └─────────────────────┘   │
    └─────────────────────────────────────────────────────┘
```

### Cache Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Nx Cache Request Flow                              │
└─────────────────────────────────────────────────────────────────────────────┘

1. Build Request                    2. Cache Check                3. Result
┌─────────────┐                    ┌─────────────┐              ┌─────────────┐
│   nx build  │ ──────────────────▶│ Compute     │─────────────▶│ Cache Hash  │
│   nx test   │                    │ Task Hash   │              │ (SHA-256)   │
└─────────────┘                    └─────────────┘              └──────┬──────┘
                                                                        │
                                                                        ▼
                                   ┌─────────────────────────────────────────┐
                                   │        Cache Server Check                │
                                   │                                         │
4a. Cache Hit                      │  GET /artifacts/{hash}                  │      4b. Cache Miss
┌─────────────┐                    │  Authorization: Bearer {token}         │    ┌─────────────┐
│ Download    │◀───────────────────┤                                         │───▶│ Execute     │
│ Artifacts   │                    │  Response:                              │    │ Task        │
│ (Fast!)     │                    │  • 200: Stream cached artifacts        │    │ (Compile)   │
└─────────────┘                    │  • 404: Cache miss                     │    └──────┬──────┘
                                   └─────────────────────────────────────────┘           │
                                                                                         │
                                                                           5. Upload Results
                                                                                         │
                                   ┌─────────────────────────────────────────┐           │
                                   │        Upload to Cache                  │◀──────────┘
                                   │                                         │
                                   │  PUT /artifacts/{hash}                  │
                                   │  Authorization: Bearer {token}         │
                                   │  Content-Type: application/octet-stream │
                                   │                                         │
                                   │  • Stream upload (memory efficient)    │
                                   │  • Atomic operations                    │
                                   │  • Prometheus metrics recorded         │
                                   └─────────────────────────────────────────┘
```

### Plugin Generator Logic

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Plugin Generator Workflow                              │
└─────────────────────────────────────────────────────────────────────────────┘

npm install nx-custom-cache-server
           │
           ▼
┌─────────────────────┐
│   Postinstall       │
│   Interactive       │  ──────┐
│   Prompt            │        │
└─────────────────────┘        │
           │                   │
           ▼                   │
┌─────────────────────┐        │    Direct Usage:
│ User Input:         │        │    npx nx g nx-custom-cache-server:init
│ • Project Name      │        │                │
│ • Cloud Provider    │        │                ▼
│ • Include Docker?   │◀───────┘    ┌─────────────────────┐
│ • Include Metrics?  │              │   Schema Validation │
│ • Custom Directory  │              │   • Required fields │
│ • Project Tags      │              │   • Default values  │
└──────────┬──────────┘              │   • Type checking   │
           │                         └──────────┬──────────┘
           ▼                                    │
┌─────────────────────────────────────────────────────────┐
│                Generator Engine                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │            File Template Processing                 │ │
│  │                                                     │ │
│  │  Provider Templates:                                │ │
│  │  ├── GCP Templates                                  │ │
│  │  │   ├── main.js.template                          │ │
│  │  │   ├── package.json.template                     │ │
│  │  │   └── .env.example.template                     │ │
│  │  └── AWS Templates                                  │ │
│  │      ├── main.js.template                          │ │
│  │      ├── package.json.template                     │ │
│  │      └── .env.example.template                     │ │
│  │                                                     │ │
│  │  Optional Features:                                 │ │
│  │  ├── Dockerfile.template (if includeDocker)        │ │
│  │  ├── prometheus-config.js (if includeMetrics)      │ │
│  │  └── grafana-dashboard.json (if includeMetrics)    │ │
│  └─────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              Nx Project Configuration               │ │
│  │                                                     │ │
│  │  • Update workspace.json                            │ │
│  │  • Create project.json                              │ │
│  │  • Set up build targets                             │ │
│  │  • Configure serve targets                          │ │
│  │  • Add project tags                                 │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│                Generated Project                        │
│                                                         │
│  apps/my-cache-server/                                  │
│  ├── src/main.js              # Express server         │
│  ├── package.json             # Dependencies           │
│  ├── .env.example            # Environment template    │
│  ├── README.md               # Project documentation   │
│  ├── Dockerfile              # Container config        │
│  └── monitoring/             # Observability tools     │
│      └── grafana-dashboard.json                        │
│                                                         │
│  Ready to run:                                          │
│  • npm install                                          │
│  • npm run dev                                          │
│  • npm start                                            │
└─────────────────────────────────────────────────────────┘
```

### Core Components

#### 1. **Authentication Layer**
```javascript
// Bearer token validation middleware
app.use('/artifacts', authenticateToken);

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token === process.env.NX_CACHE_ACCESS_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
```

#### 2. **Storage Abstraction**
```javascript
// Provider-agnostic storage interface
class StorageProvider {
  async uploadArtifact(hash, stream) { /* Implementation */ }
  async downloadArtifact(hash) { /* Implementation */ }
  async artifactExists(hash) { /* Implementation */ }
}

// GCP Implementation
class GCPStorage extends StorageProvider { /* ... */ }
// AWS Implementation  
class AWSStorage extends StorageProvider { /* ... */ }
```

#### 3. **Caching Logic**
- **Hash Generation**: Nx computes SHA-256 hash based on inputs, source code, and dependencies
- **Cache Key**: `{task-name}-{hash}-{platform}-{node-version}`
- **Atomic Operations**: Ensures cache consistency during concurrent access
- **Streaming**: Memory-efficient handling of large artifacts (up to several GB)

#### 4. **Monitoring & Metrics**
```javascript
// Prometheus metrics collected
const metrics = {
  cache_hits_total: 'Counter of cache hits',
  cache_misses_total: 'Counter of cache misses', 
  upload_duration_seconds: 'Histogram of upload times',
  download_duration_seconds: 'Histogram of download times',
  artifact_size_bytes: 'Histogram of artifact sizes',
  active_connections: 'Gauge of active connections'
};
```

### Performance Characteristics

| Metric | Typical Performance |
|--------|-------------------|
| **Cache Hit Response** | < 100ms (metadata check) |
| **Small Artifacts** | < 1s download (< 10MB) |
| **Large Artifacts** | ~100MB/s transfer rate |
| **Concurrent Users** | 100+ simultaneous connections |
| **Storage Efficiency** | Deduplication by content hash |
| **Memory Usage** | < 512MB (streaming design) |

## 📦 Installation

```bash
npm install --save-dev nx-custom-cache-server
```

## 🛠️ Usage

### Basic Usage

```bash
# Interactive mode (recommended for first-time users)
npx nx g nx-custom-cache-server:init

# Direct usage with options
npx nx g nx-custom-cache-server:init my-cache-server --provider=gcp
```

### Command Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | `string` | - | Name of the cache server project |
| `provider` | `'gcp' \| 'aws'` | `'gcp'` | Cloud storage provider |
| `directory` | `string` | - | Custom directory for the project |
| `includeDocker` | `boolean` | `true` | Include Docker configuration |
| `includeMetrics` | `boolean` | `true` | Include Prometheus metrics |
| `tags` | `string` | - | Nx project tags (comma-separated) |

### Examples

```bash
# GCP with all features (default)
npx nx g nx-custom-cache-server:init my-gcp-cache

# AWS without Docker
npx nx g nx-custom-cache-server:init my-aws-cache \
  --provider=aws \
  --includeDocker=false

# Minimal setup for development
npx nx g nx-custom-cache-server:init dev-cache \
  --includeMetrics=false \
  --includeDocker=false

# Custom directory with tags
npx nx g nx-custom-cache-server:init prod-cache \
  --directory=backend \
  --tags=cache,backend,production
```

## 🌩️ Cloud Provider Setup

### Google Cloud Platform (GCP)

<details>
<summary>Click to expand GCP setup instructions</summary>

#### Prerequisites
- Google Cloud project with Cloud Storage API enabled
- Service account with Storage Admin role (recommended)

#### Setup Steps

1. **Create a GCS bucket:**
```bash
gsutil mb gs://your-nx-cache-bucket
```

2. **Set up authentication:**
```bash
# Option 1: Service account (recommended for production)
export GOOGLE_CLOUD_KEY_FILE=/path/to/service-account.json

# Option 2: Application Default Credentials (development)
gcloud auth application-default login
```

3. **Environment variables:**
```bash
export NX_CACHE_ACCESS_TOKEN=$(openssl rand -hex 32)
export GOOGLE_CLOUD_PROJECT_ID=your-project-id
export GCS_BUCKET_NAME=your-nx-cache-bucket
```

#### Required Permissions
- `storage.objects.create`
- `storage.objects.get`
- `storage.objects.list`

</details>

### Amazon Web Services (AWS)

<details>
<summary>Click to expand AWS setup instructions</summary>

#### Prerequisites
- AWS account with S3 access
- IAM user or role with S3 permissions

#### Setup Steps

1. **Create an S3 bucket:**
```bash
aws s3 mb s3://your-nx-cache-bucket
```

2. **Set up authentication:**
```bash
# Option 1: Environment variables
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key

# Option 2: AWS Profile
export AWS_PROFILE=your-profile

# Option 3: IAM Role (when running on EC2/ECS)
# No additional setup needed
```

3. **Environment variables:**
```bash
export NX_CACHE_ACCESS_TOKEN=$(openssl rand -hex 32)
export AWS_REGION=us-east-1
export S3_BUCKET_NAME=your-nx-cache-bucket
```

#### Required IAM Permissions
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:HeadObject"
      ],
      "Resource": "arn:aws:s3:::your-nx-cache-bucket/*"
    }
  ]
}
```

</details>

## 🚀 Generated Project Structure

```
apps/your-cache-server/
├── src/
│   └── main.js              # Express server with cloud storage integration
├── package.json             # Dependencies and scripts
├── README.md               # Project-specific documentation
├── Dockerfile              # Multi-stage Docker build (optional)
├── .env.example            # Environment variable template
├── .gitignore              # Git ignore rules
└── monitoring/             # Grafana dashboard (if metrics enabled)
    └── grafana-dashboard.json
```

## 💻 Development

### Running the Generated Server

```bash
cd apps/your-cache-server

# Install dependencies
npm install

# Development with auto-reload
npm run dev

# Production
npm start
```

### Environment Configuration

Create a `.env` file based on `.env.example`:

**For GCP:**
```env
NX_CACHE_ACCESS_TOKEN=your-secure-token-here
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project-id
GCS_BUCKET_NAME=your-gcs-bucket-name
PORT=3000
LOG_LEVEL=info
```

**For AWS:**
```env
NX_CACHE_ACCESS_TOKEN=your-secure-token-here
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=your-bucket-name
PORT=3000
LOG_LEVEL=info
```

## 🎯 Nx Integration

To use this cache server with your Nx workspace, set the following environment variables:

```
NX_SELF_HOSTED_REMOTE_CACHE_SERVER=http://your-server:3000
NX_SELF_HOSTED_REMOTE_CACHE_ACCESS_TOKEN=your-secure-token
```

## 🐳 Docker Deployment

### Build and Run

```bash
# Build the image
docker build -t nx-cache-server .

# Run with environment file
docker run -p 3000:3000 --env-file .env nx-cache-server

# Or with inline environment variables
docker run -p 3000:3000 \
  -e NX_CACHE_ACCESS_TOKEN=your-token \
  -e GOOGLE_CLOUD_PROJECT_ID=your-project \
  -e GCS_BUCKET_NAME=your-bucket \
  nx-cache-server
```

### Docker Compose

```yaml
version: '3.8'
services:
  nx-cache:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NX_CACHE_ACCESS_TOKEN=${NX_CACHE_ACCESS_TOKEN}
      - GOOGLE_CLOUD_PROJECT_ID=${GOOGLE_CLOUD_PROJECT_ID}
      - GCS_BUCKET_NAME=${GCS_BUCKET_NAME}
    volumes:
      - ./service-account.json:/app/service-account.json:ro
    restart: unless-stopped
```
