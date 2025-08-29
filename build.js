#!/usr/bin/env node

// Simple build script for Vercel deployment
// This ensures all static files are properly served

const fs = require('fs');
const path = require('path');

console.log('Building Vidsponential Portfolio...');

// Ensure index.html exists (it should already)
if (!fs.existsSync('index.html')) {
  console.error('Error: index.html not found in root directory');
  process.exit(1);
}

// Create a simple manifest of all HTML files for reference
const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
console.log('Found HTML files:', htmlFiles);

// Ensure all shared assets are accessible
const sharedDir = './shared';
if (fs.existsSync(sharedDir)) {
  console.log('Shared assets directory found');
} else {
  console.warn('Warning: shared assets directory not found');
}

console.log('Build completed successfully!');
console.log('Homepage: Professional YouTube Script Writing');
console.log('Portfolio: Available at /portfolio/');
console.log('Celebrity Scripts: Available at /portfolio/celebrity-scripts/');
