const { spawn } = require('child_process');
const http = require('http');

const SERVER_PORT = process.env.PORT || 3000;
const HEALTH_URL = `http://localhost:${SERVER_PORT}/health`;
const WAIT_TIMEOUT = 20000; // 20 seconds
const WAIT_INTERVAL = 500; // ms

let serverProcess;

function waitForServer(url, timeout = WAIT_TIMEOUT) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    function check() {
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          retry();
        }
      }).on('error', retry);
    }
    function retry() {
      if (Date.now() - start > timeout) {
        reject(new Error('Server did not become ready in time.'));
      } else {
        setTimeout(check, WAIT_INTERVAL);
      }
    }
    check();
  });
}

async function run() {
  let serverStarted = false;
  // Try to check if server is already running
  try {
    await waitForServer(HEALTH_URL, 2000);
    console.log('Server already running.');
  } catch {
    // Not running, so start it
    console.log('Starting server...');
    serverProcess = spawn('node', ['server.js'], { stdio: 'inherit' });
    serverStarted = true;
    try {
      await waitForServer(HEALTH_URL);
      console.log('Server is ready.');
    } catch (e) {
      if (serverProcess) serverProcess.kill();
      throw e;
    }
  }

  // Run Playwright tests
  const testProcess = spawn('npx', ['playwright', 'test'], { stdio: 'inherit' });
  testProcess.on('exit', (code) => {
    if (serverStarted && serverProcess) serverProcess.kill();
    process.exit(code);
  });
}

run().catch((err) => {
  console.error(err);
  if (serverProcess) serverProcess.kill();
  process.exit(1);
}); 