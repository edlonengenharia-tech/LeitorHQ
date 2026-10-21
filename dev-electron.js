#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting AutoComix in development mode...\n');

// Start Vite dev server
const vite = spawn('npm', ['run', 'dev'], {
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, NODE_ENV: 'development' },
});

vite.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  // When Vite is ready, start Electron
  if (output.includes('Local:') || output.includes('localhost')) {
    setTimeout(() => {
      startElectron();
    }, 1000);
  }
});

vite.stderr.on('data', (data) => {
  console.error(data.toString());
});

function startElectron() {
  console.log('\nStarting Electron...');
  const electron = require('electron');
  const electronProcess = spawn(electron, [path.join(__dirname, 'electron', 'main.js')], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' },
  });

  electronProcess.on('close', (code) => {
    vite.kill();
    process.exit(code);
  });
}

process.on('SIGINT', () => {
  vite.kill();
  process.exit();
});
