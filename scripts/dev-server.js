// eslint-disable-next-line @typescript-eslint/no-require-imports
const { spawn } = require('node:child_process');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const net = require('node:net');

const host = process.env.HOST || '127.0.0.1';
const basePort = Number(process.env.PORT || 3110);

function isPortAvailable(portNumber) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(portNumber, host);
  });
}

function killProcessOnPort(portNumber) {
  if (process.platform !== 'win32') {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const child = spawn('powershell.exe', [
      '-NoProfile',
      '-Command',
      `$connections = Get-NetTCPConnection -LocalPort ${portNumber} -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' }; if ($connections) { foreach ($connection in $connections) { try { Stop-Process -Id $connection.OwningProcess -Force -ErrorAction SilentlyContinue } catch {} } }`,
    ], {
      stdio: 'ignore',
    });
    child.once('exit', () => resolve());
  });
}

async function resolvePort(startPort) {
  for (let port = startPort; port < startPort + 10; port += 1) {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }

    await killProcessOnPort(port);

    const availableAfterKill = await isPortAvailable(port);
    if (availableAfterKill) {
      return port;
    }
  }

  throw new Error(`Could not find a free port near ${startPort}`);
}

async function start() {
  const nextPort = await resolvePort(basePort);

  if (nextPort !== basePort) {
    console.warn(`Port ${basePort} is busy. Starting Next.js on ${nextPort} instead.`);
  }

  const args = ['dev', '--hostname', host, '--port', String(nextPort)];
  const child = spawn(process.platform === 'win32' ? 'cmd.exe' : 'sh', process.platform === 'win32'
    ? ['/d', '/s', '/c', `npx next ${args.join(' ')}`]
    : ['-lc', `npx next ${args.join(' ')}`], {
      stdio: 'inherit',
      env: { ...process.env, PORT: String(nextPort) },
    });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

start();
