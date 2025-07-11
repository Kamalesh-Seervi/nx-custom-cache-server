#!/usr/bin/env node

const readline = require('readline');
const { execSync } = require('child_process');

console.log(`
🎉 Thank you for installing nx-custom-cache-server!

📦 Package: nx-custom-cache-server
🔧 Version: 1.0.0
⚡ Generate high-performance Nx cache servers with cloud storage backends
`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function interactiveSetup() {
  try {
    console.log('🚀 Quick Start Options:\n');
    
    const shouldSetup = await askQuestion('Would you like to generate a cache server now? (y/N): ');
    
    if (shouldSetup.toLowerCase() === 'y' || shouldSetup.toLowerCase() === 'yes') {
      console.log('\n📋 Let\'s set up your cache server:\n');
      
      const projectName = await askQuestion('Project name (my-cache-server): ') || 'my-cache-server';
      
      console.log('\n☁️ Choose your cloud provider:');
      console.log('  1. Google Cloud Platform (GCS)');
      console.log('  2. AWS S3');
      
      const providerChoice = await askQuestion('\nEnter choice (1 or 2): ');
      const provider = providerChoice === '2' ? 'aws' : 'gcp';
      
      const includeDocker = await askQuestion('\nInclude Docker configuration? (Y/n): ');
      const dockerFlag = includeDocker.toLowerCase() === 'n' || includeDocker.toLowerCase() === 'no' ? ' --includeDocker=false' : '';
      
      const includeMetrics = await askQuestion('Include Prometheus metrics? (Y/n): ');
      const metricsFlag = includeMetrics.toLowerCase() === 'n' || includeMetrics.toLowerCase() === 'no' ? ' --includeMetrics=false' : '';
      
      const command = `npx nx g nx-custom-cache-server:init ${projectName} --provider=${provider}${dockerFlag}${metricsFlag}`;
      
      console.log(`\n🔧 Running: ${command}\n`);
      
      try {
        execSync(command, { stdio: 'inherit' });
        console.log(`\n✅ Cache server "${projectName}" created successfully!`);
        console.log(`\n📖 Next steps:`);
        console.log(`   1. cd apps/${projectName}`);
        console.log(`   2. Set up environment variables (see .env.example)`);
        console.log(`   3. npm install && npm start`);
      } catch (error) {
        console.log('\n❌ Generation failed. You can run it manually:');
        console.log(`   ${command}`);
      }
    } else {
      console.log('\n📚 Manual Usage:');
      console.log('   npx nx g nx-custom-cache-server:init my-cache-server');
      console.log('\n🔧 Options:');
      console.log('   --provider=gcp|aws          # Choose cloud provider');
      console.log('   --includeDocker=true|false  # Include Docker config');
      console.log('   --includeMetrics=true|false # Include Prometheus metrics');
      console.log('\n💡 Examples:');
      console.log('   npx nx g nx-custom-cache-server:init gcp-cache --provider=gcp');
      console.log('   npx nx g nx-custom-cache-server:init aws-cache --provider=aws');
      console.log('\n📖 Documentation: https://github.com/Kamalesh-Seervi/nx-custom-cache-server#readme');
    }
    
  } catch (error) {
    console.log('\n📖 Manual setup instructions:');
    console.log('   npx nx g nx-custom-cache-server:init my-cache-server');
  } finally {
    rl.close();
  }
}

// Only run interactive setup if this is a direct install (not in CI)
if (process.env.CI !== 'true' && process.env.npm_config_yes !== 'true') {
  interactiveSetup().catch(() => {
    console.log('\n📖 Quick reference:');
    console.log('   npx nx g nx-custom-cache-server:init my-cache-server');
    rl.close();
  });
} else {
  console.log('📖 Usage: npx nx g nx-custom-cache-server:init my-cache-server');
  console.log('📚 Docs: https://github.com/Kamalesh-Seervi/nx-custom-cache-server#readme');
}
