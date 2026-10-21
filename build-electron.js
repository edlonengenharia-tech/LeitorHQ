#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Building AutoComix for distribution...\n');

// Step 1: Build the Vite project
console.log('📦 Step 1: Building Vite project...');
const build = spawn('npm', ['run', 'build'], {
  stdio: 'inherit',
  shell: true,
});

build.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Build failed!');
    process.exit(1);
  }

  console.log('\n✅ Vite build complete!\n');

  // Step 2: Check if electron-builder is available
  console.log('📦 Step 2: Creating distributable packages...');
  
  const electronBuilder = spawn('npx', ['electron-builder'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      // Set platform-specific options
      FORCE_COLOR: '1',
    },
  });

  electronBuilder.on('close', (code) => {
    if (code !== 0) {
      console.error('❌ Electron Builder failed!');
      process.exit(1);
    }

    console.log('\n✅ Build complete!');
    console.log('\n📁 Check the "release" directory for your distributable packages.\n');
    
    // Show what was created
    const releaseDir = path.join(__dirname, 'release');
    if (fs.existsSync(releaseDir)) {
      const files = fs.readdirSync(releaseDir);
      console.log('Created files:');
      files.forEach(file => {
        const stats = fs.statSync(path.join(releaseDir, file));
        const size = (stats.size / 1024 / 1024).toFixed(2);
        console.log(`  - ${file} (${size} MB)`);
      });
    }
  });
});
