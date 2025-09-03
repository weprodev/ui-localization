#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Create a temporary directory for testing
const tempDir = path.join(__dirname, '../temp-test-package');
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

// Create a simple test project
const packageJsonPath = path.join(tempDir, 'package.json');
fs.writeFileSync(
  packageJsonPath,
  JSON.stringify({
    name: 'test-wpd-pkg-localization',
    version: '1.0.0',
    private: true,
    dependencies: {
      '@weprodev/wpd-pkg-localization': 'file:../',
      'i18next': '^23.7.6',
      'react': '^18.2.0',
      'react-i18next': '^13.5.0',
    },
  })
);

// Create a simple test file
const testFilePath = path.join(tempDir, 'test.js');
fs.writeFileSync(
  testFilePath,
  `const { initI18n, useTranslate } = require('@weprodev/wpd-pkg-localization');
console.log('Successfully imported @weprodev/wpd-pkg-localization');
console.log('Available exports:', Object.keys(require('@weprodev/wpd-pkg-localization')));
`
);

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { cwd: tempDir, stdio: 'inherit' });

  // Run the test file
  console.log('\nTesting package imports...');
  execSync('node test.js', { cwd: tempDir, stdio: 'inherit' });

  console.log('\n✅ Package test successful!');
} catch (error) {
  console.error('\n❌ Package test failed:', error);
  process.exit(1);
} finally {
  // Clean up
  fs.rmSync(tempDir, { recursive: true, force: true });
}
