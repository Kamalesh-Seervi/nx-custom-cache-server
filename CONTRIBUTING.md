# Contributing to nx-custom-cache-server

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/nx-cache-server-plugin.git
cd nx-cache-server-plugin

# Install dependencies
npm install

# Build the project
npm run build

# Test your changes locally
npm link
cd /path/to/test-nx-workspace
npm link nx-custom-cache-server
npx nx g nx-custom-cache-server:init test-server
```

## Project Structure

```
├── src/
│   ├── generators/
│   │   └── init/
│   │       ├── generator.ts          # Main generator logic
│   │       ├── schema.ts             # TypeScript interfaces
│   │       ├── schema.json           # JSON schema for CLI prompts
│   │       ├── files-gcp/            # GCP template files
│   │       └── files-aws/            # AWS template files
│   └── index.ts                      # Main entry point
├── dist/                             # Built files (generated)
├── generators.json                   # Nx generator configuration
├── package.json                      # Package configuration
└── README.md                         # Documentation
```

## Adding New Features

### Adding a New Cloud Provider

1. Create template files in `src/generators/init/files-{provider}/`
2. Update the schema in `schema.json` to include the new provider
3. Update the generator logic in `generator.ts`
4. Add documentation and examples

### Modifying Templates

Template files use EJS syntax for variable substitution:

```javascript
// Example template usage
const serverName = '<%= name %>';
<% if (includeMetrics) { %>
// Metrics code here
<% } %>
```

Available template variables:
- `name` - Project name
- `className` - PascalCase project name  
- `provider` - Cloud provider ('gcp' or 'aws')
- `includeDocker` - Boolean for Docker support
- `includeMetrics` - Boolean for Prometheus metrics

## Testing

### Manual Testing

1. Build the plugin: `npm run build`
2. Link locally: `npm link`
3. Create test workspace and test generation
4. Verify generated files work correctly

### Template Validation

Ensure template files:
- Use correct EJS syntax
- Include all necessary dependencies
- Have proper error handling
- Follow security best practices

## Coding Style

- Use TypeScript for all source files
- Follow existing code formatting
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Documentation

- Update README.md for user-facing changes
- Update CHANGELOG.md following semantic versioning
- Add inline comments for complex logic
- Update examples when changing templates

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/your-username/nx-cache-server-plugin/issues).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening)

## Feature Requests

We're open to new ideas! Please open an issue to discuss new features before implementing them.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue or discussion if you have any questions about contributing!
