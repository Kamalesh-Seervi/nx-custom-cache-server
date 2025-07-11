# Release Guide for nx-cache-server-custom

## 📦 What gets published to npm registry

### ✅ Included Files:
```
nx-custom-cache-server/
├── dist/                              # Compiled JavaScript (REQUIRED)
│   ├── generators/init/
│   │   ├── files-gcp/                # GCP template files
│   │   ├── files-aws/                # AWS template files  
│   │   ├── generator.js              # Main generator logic
│   │   └── schema.js                 # Schema definitions
│   └── index.js                      # Entry point
├── scripts/
│   └── postinstall.js               # Interactive setup script
├── generators.json                   # Nx generator config (REQUIRED)
├── executors.json                    # Nx executor config
├── README.md                         # Documentation
├── LICENSE                           # License file
└── CHANGELOG.md                      # Version history
```

### ❌ NOT Included (stays in repo only):
- `src/` - TypeScript source code
- `node_modules/` - Dependencies
- `.github/` - GitHub workflows  
- `examples/` - Example documentation
- Development files (`.gitignore`, `tsconfig.json`, etc.)

## 🚀 How to Release

### 1. Prepare Release
```bash
# Update version in package.json
npm version patch|minor|major

# Update CHANGELOG.md with new features
# Commit changes
git add .
git commit -m "Release v1.0.1"
```

### 2. Create Release Tag
```bash
# Create and push tag (triggers GitHub Actions)
git tag v1.0.1
git push origin v1.0.1
```

### 3. GitHub Actions automatically:
- ✅ Builds the package (`npm run build`)
- ✅ Publishes to npm registry
- ✅ Creates GitHub release

## 🔧 Prerequisites

### NPM_TOKEN Secret
1. Go to npmjs.com → Account → Access Tokens
2. Create "Automation" token
3. Add to GitHub Secrets as `NPM_TOKEN`

### GITHUB_TOKEN
- ✅ Automatically provided by GitHub Actions (no setup needed)

## 👤 User Installation Flow

### 1. User installs:
```bash
npm install --save-dev nx-custom-cache-server
```

### 2. Postinstall script runs:
- Shows welcome message
- Offers interactive setup
- Provides usage examples

### 3. User generates server:
```bash
npx nx g nx-cache-server-custom:init my-cache-server
```

## 🧪 Testing Before Release

```bash
# Build locally
npm run build

# Test pack (simulates npm publish)
npm pack

# Install local package for testing
npm install ./nx-cache-server-custom-1.0.0.tgz
```

## 📋 Release Checklist

- [ ] Update `package.json` version
- [ ] Update `CHANGELOG.md`
- [ ] Test build: `npm run build`
- [ ] Commit changes
- [ ] Create and push tag: `git tag v1.0.x && git push origin v1.0.x`
- [ ] Monitor GitHub Actions workflow
- [ ] Verify npm package published
- [ ] Test installation: `npm install nx-custom-cache-server`
