# nx-custom-cache-server

[![npm version](https://badge.fury.io/js/%40nx-cache%2Fserver-plugin.svg)](https://www.npmjs.com/package/nx-custom-cache-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Professional Nx plugin for generating high-performance cache servers with cloud storage backends**

Generate production-ready Nx cache servers with support for Google Cloud Storage (GCP) and AWS S3 backends. Built with Express.js, includes Prometheus metrics, Docker support, and comprehensive security features.

## 🚀 Quick Start

```bash
# Install the plugin
npm install --save-dev nx-custom-cache-server

# Generate a cache server
npx nx g nx-custom-cache-server:init my-cache-server
```

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌩️ **Multi-Cloud** | Support for GCP (Cloud Storage) and AWS (S3) |
| ⚡ **High Performance** | Streaming uploads/downloads, optimized for large artifacts |
| 📊 **Observability** | Prometheus metrics, structured logging, health checks |
| 🔒 **Security** | Bearer token auth, input validation, secure defaults |
| 🐳 **Production Ready** | Docker support, graceful shutdown, error handling |
| 🎯 **Developer Friendly** | Interactive CLI, comprehensive docs, TypeScript support |

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
├── .env.example           # Environment variable template
├── .gitignore             # Git ignore rules
└── monitoring/            # Grafana dashboard (if metrics enabled)
    └── grafana-dashboard.json
```

## � Development

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

Configure your Nx workspace to use the cache server:

```json
// nx.json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "@nx/nx/tasks-runners/default",
      "options": {
        "remoteCache": {
          "enabled": true,
          "url": "http://localhost:3000",
          "options": {
            "accessToken": "your-secure-token-here"
          }
        }
      }
    }
  }
}
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

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3000/health
# Returns: OK
```

### Prometheus Metrics
```bash
curl http://localhost:3000/metrics
```

### Available Metrics
- **HTTP Metrics:** Request duration, count, status codes
- **Cache Operations:** Upload/download rates, artifact sizes
- **Cloud Storage:** Operation latencies, success/failure rates
- **System:** Memory usage, active connections
- **Authentication:** Success/failure counts

## 🔒 Security Best Practices

1. **Strong Tokens:** Use cryptographically secure tokens
   ```bash
   openssl rand -hex 32
   ```

2. **Network Security:** Use HTTPS in production
3. **Access Control:** Restrict server access to authorized networks
4. **Cloud Permissions:** Use minimal required permissions
5. **Environment Variables:** Never commit secrets to version control

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### Development Setup

```bash
git clone https://github.com/your-username/nx-cache-server-plugin.git
cd nx-cache-server-plugin
npm install
npm run build
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues:** [GitHub Issues](https://github.com/your-username/nx-cache-server-plugin/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-username/nx-cache-server-plugin/discussions)
- **Documentation:** [Wiki](https://github.com/your-username/nx-cache-server-plugin/wiki)

---

<div align="center">

**Made with ❤️ for the Nx community**

[⭐ Star us on GitHub](https://github.com/your-username/nx-cache-server-plugin) • [📦 View on npm](https://www.npmjs.com/package/nx-custom-cache-server)

</div>
