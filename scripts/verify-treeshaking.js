#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to find JavaScript files in .next directory
function findJSFiles(dir) {
  const files = [];

  if (!fs.existsSync(dir)) {
    console.log('⚠️  Build directory not found. Run `npm run build` first.');
    return files;
  }

  function scanDir(currentDir) {
    const entries = fs.readdirSync(currentDir);

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.endsWith('.js')) {
        files.push(fullPath);
      }
    }
  }

  scanDir(dir);
  return files;
}

// Function to check for unused Lucide icons
function checkTreeShaking() {
  console.log('🔍 Verifying Tree-shaking for Lucide Icons and ShadCN UI...\n');

  const buildDir = path.join(process.cwd(), '.next/static/chunks');
  const jsFiles = findJSFiles(buildDir);

  if (jsFiles.length === 0) {
    console.log(
      '❌ No JavaScript files found. Please run `npm run build` first.'
    );
    return;
  }

  // Icons we intentionally import
  const usedIcons = [
    'Calendar',
    'Users',
    'Vote',
    'FileText',
    'Settings',
    'ChevronRight',
    'Heart',
    'Star',
    'Download',
    'Share',
    'PlusCircle',
  ];

  // Common icons that should NOT be in bundle if tree-shaking works
  const unusedIcons = [
    'Airplane',
    'Anchor',
    'Archive',
    'Bell',
    'Camera',
    'Cloud',
    'Database',
    'Globe',
    'Home',
    'Lock',
    'Mail',
    'Map',
    'Phone',
  ];

  console.log('📦 Analyzing bundle contents...\n');

  let totalSize = 0;
  let foundUsedIcons = [];
  let foundUnusedIcons = [];

  jsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const stats = fs.statSync(file);
    totalSize += stats.size;

    // Check for used icons (should be present)
    usedIcons.forEach(icon => {
      if (content.includes(icon) && !foundUsedIcons.includes(icon)) {
        foundUsedIcons.push(icon);
      }
    });

    // Check for unused icons (should NOT be present)
    unusedIcons.forEach(icon => {
      if (content.includes(icon) && !foundUnusedIcons.includes(icon)) {
        foundUnusedIcons.push(icon);
      }
    });
  });

  console.log(`📊 Bundle Analysis Results:`);
  console.log(`   Total chunk size: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`   JavaScript files analyzed: ${jsFiles.length}\n`);

  console.log('✅ Used icons found in bundle (expected):');
  if (foundUsedIcons.length > 0) {
    foundUsedIcons.forEach(icon => console.log(`   - ${icon}`));
  } else {
    console.log('   (None found - might be minified)');
  }

  console.log('\n🚫 Unused icons found in bundle (tree-shaking issue if any):');
  if (foundUnusedIcons.length > 0) {
    foundUnusedIcons.forEach(icon => console.log(`   ❌ ${icon}`));
    console.log('\n⚠️  Some unused icons were found in the bundle.');
    console.log(
      '   This might indicate tree-shaking is not working optimally.'
    );
  } else {
    console.log('   ✅ None found - Tree-shaking is working correctly!');
  }

  console.log('\n🎯 Tree-shaking Verification:');
  if (foundUnusedIcons.length === 0) {
    console.log(
      '   ✅ PASSED - Only imported icons are included in the bundle'
    );
  } else {
    console.log('   ❌ PARTIAL - Some unused icons were found in the bundle');
  }

  console.log('\n📋 Recommendations:');
  console.log(
    '   - Only import specific icons you need: import { IconName } from "lucide-react"'
  );
  console.log('   - Avoid import * as Icons from "lucide-react"');
  console.log(
    '   - ShadCN UI components use class-variance-authority for optimal bundling'
  );
  console.log(
    '   - CSS custom properties allow theme switching without JS bundle bloat'
  );
}

// Run the check
checkTreeShaking();
