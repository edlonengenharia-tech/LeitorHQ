#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Verifica se o build existe
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.log('Building the project first...');
  const build = spawn('npm', ['run', 'build'], { stdio: 'inherit', shell: true });
  build.on('close', (code) => {
    if (code !== 0) {
      console.error('Build failed!');
      process.exit(1);
    }
    startElectron();
  });
} else {
  startElectron();
}

function startElectron() {
  console.log('Starting AutoComix...');
  const electron = require('electron');
  const electronProcess = spawn(electron, [path.join(__dirname, 'electron', 'main.js')], {
    stdio: 'inherit',
    env: { ...process.env },
  });

  electronProcess.on('close', (code) => {
    process.exit(code);
  });
}
