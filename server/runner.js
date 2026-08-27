import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('🚀 Starting AI Photobooth Server & Vite Frontend...');

const serverProc = spawn('node', ['server/index.js'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true
});

const viteProc = spawn(npmCmd, ['run', 'dev:frontend'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  console.log('\n🛑 Shutting down processes...');
  try {
    serverProc.kill();
    viteProc.kill();
  } catch (e) {}
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
