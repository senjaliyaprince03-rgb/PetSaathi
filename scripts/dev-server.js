// eslint-disable-next-line @typescript-eslint/no-require-imports
const { spawn } = require('node:child_process');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const net = require('node:net');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('node:path');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true, quiet: true });

const host = process.env.HOST || '127.0.0.1';
// Playwright passes --port after the npm script; honor it before falling back to PORT.
const portFlagIndex = process.argv.findIndex((argument) => argument === '--port' || argument === '-p');
const requestedPort = portFlagIndex >= 0 ? process.argv[portFlagIndex + 1] : process.env.PORT;
const parsedPort = Number(requestedPort || 3110);
const basePort = Number.isInteger(parsedPort) && parsedPort >= 1024 && parsedPort <= 65_535 ? parsedPort : 3110;

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

async function resolvePort(startPort) {
  for (let port = startPort; port < startPort + 10; port += 1) {
    const available = await isPortAvailable(port);
    if (available) {
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

  const args = ['dev', '--turbo', '--hostname', host, '--port', String(nextPort)];
  const childEnv = { ...process.env, PORT: String(nextPort), NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --max-old-space-size=4096`.trim() };
  const { preparePrismaEnvironment } = await import('./prepare-prisma-uri.mjs');
  await preparePrismaEnvironment(childEnv);
  const child = spawn(process.platform === 'win32' ? 'cmd.exe' : 'sh', process.platform === 'win32'
    ? ['/d', '/s', '/c', `npx next ${args.join(' ')}`]
    : ['-lc', `npx next ${args.join(' ')}`], {
      stdio: 'inherit',
      env: childEnv,
    });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

start();
