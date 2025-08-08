const { spawn } = require('child_process');
const path = require('path');

// Set development environment
process.env.NODE_ENV = 'development';

// Start Vite dev server
const vite = spawn('npm', ['run', 'dev:renderer'], {
  stdio: 'inherit',
  shell: true
});

// Wait a bit for Vite to start, then launch Electron
setTimeout(() => {
  const electron = spawn('npm', ['run', 'dev:main'], {
    stdio: 'inherit',
    shell: true
  });

  electron.on('close', (code) => {
    console.log(`Electron process exited with code ${code}`);
    vite.kill();
    process.exit(code);
  });
}, 3000);

vite.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  vite.kill();
  process.exit(0);
}); 