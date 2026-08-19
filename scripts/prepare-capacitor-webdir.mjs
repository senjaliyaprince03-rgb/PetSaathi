import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const webDir = path.join(projectRoot, ".capacitor-web");

mkdirSync(webDir, { recursive: true });

writeFileSync(
  path.join(webDir, "index.html"),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0f172a" />
    <title>PetSaathi</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f8fafc;
        color: #172033;
      }

      body {
        min-height: 100vh;
        margin: 0;
        display: grid;
        place-items: center;
      }

      main {
        width: min(88vw, 420px);
        text-align: center;
      }

      h1 {
        margin: 0 0 8px;
        font-size: 28px;
        line-height: 1.15;
      }

      p {
        margin: 0;
        color: #475569;
        font-size: 15px;
        line-height: 1.55;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>PetSaathi</h1>
      <p>The mobile app shell is ready. Sync with a live PetSaathi web URL to load the full experience.</p>
    </main>
  </body>
</html>
`,
  "utf8",
);

console.log("Prepared Capacitor webDir at .capacitor-web");
