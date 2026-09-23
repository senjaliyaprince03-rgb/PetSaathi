import fs from "fs";
import { exec } from "child_process";

async function showQr() {
  const apiKey = process.env.OPENWA_API_KEY || "petsaathi_secret_openwa_key_2026";
  const baseUrl = (process.env.OPENWA_BASE_URL || "http://localhost:2785").replace(/\/+$/, "");

  try {
    const listRes = await fetch(`${baseUrl}/api/sessions`, {
      headers: { "X-API-Key": apiKey },
    });
    const sessions = await listRes.json();
    const session = sessions.find((s) => s.name === "petsaathi-bot" || s.id === "petsaathi-bot") || sessions[0];

    if (!session) {
      console.error("No session found. Run `npm run whatsapp:bot -- --init` first.");
      return;
    }

    const qrRes = await fetch(`${baseUrl}/api/sessions/${session.id}/qr`, {
      headers: { "X-API-Key": apiKey },
    });
    const qrData = await qrRes.json();

    if (!qrData.qrCode) {
      console.log(`Session status: ${session.status}. If already connected, no QR code is needed.`);
      return;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PetSaathi WhatsApp Pairing QR Code</title>
  <meta http-equiv="refresh" content="20">
  <style>
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
      text-align: center;
    }
    .card {
      background: #1e293b;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
      border: 1px solid #334155;
      max-width: 420px;
    }
    h1 {
      font-size: 22px;
      margin-top: 0;
      margin-bottom: 8px;
      color: #38bdf8;
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .qr-box {
      background: white;
      padding: 16px;
      border-radius: 12px;
      display: inline-block;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    img {
      display: block;
      width: 280px;
      height: 280px;
    }
    .steps {
      text-align: left;
      margin-top: 20px;
      background: #0f172a;
      padding: 14px 18px;
      border-radius: 8px;
      font-size: 13px;
      color: #cbd5e1;
    }
    .steps ol {
      margin: 0;
      padding-left: 18px;
    }
    .steps li {
      margin-bottom: 6px;
    }
    .note {
      font-size: 12px;
      color: #64748b;
      margin-top: 16px;
      margin-bottom: 0;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>🐾 PetSaathi WhatsApp Bot</h1>
    <p>Scan this QR code with WhatsApp to connect your bot.</p>
    <div class="qr-box">
      <img src="${qrData.qrCode}" alt="WhatsApp QR Code" />
    </div>
    <div class="steps">
      <ol>
        <li>Open <strong>WhatsApp</strong> on your phone</li>
        <li>Tap <strong>Settings</strong> or <strong>Menu (⋮)</strong></li>
        <li>Tap <strong>Linked Devices</strong> > <strong>Link a Device</strong></li>
        <li>Point your phone at this screen</li>
      </ol>
    </div>
    <p class="note">This page automatically refreshes every 20s if the code rotates.</p>
  </div>
</body>
</html>`;

    const filePath = "c:/Users/Prince/Downloads/OpenWA/scan-qr.html";
    fs.writeFileSync(filePath, htmlContent, "utf-8");
    console.log(`Saved QR viewer to: ${filePath}`);

    // Open in default browser
    exec(`start "" "${filePath}"`);
    console.log("Opened QR code viewer in browser!");
  } catch (err) {
    console.error("Failed to load QR code:", err.message);
  }
}

showQr();
