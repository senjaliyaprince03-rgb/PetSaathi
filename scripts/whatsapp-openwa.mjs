#!/usr/bin/env node
/**
 * PetSaathi WhatsApp Automation & OpenWA Manager
 * Facilitates session creation, QR code linking, webhook setup, and chatbot testing.
 */

import "dotenv/config";

const BASE_URL = (process.env.OPENWA_BASE_URL || "http://localhost:2785").replace(/\/+$/, "");
const API_KEY = process.env.OPENWA_API_KEY || process.env.API_MASTER_KEY || "petsaathi_secret_openwa_key_2026";
const SESSION_NAME = process.env.OPENWA_SESSION_ID || "petsaathi-bot";
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");
const WEBHOOK_SECRET = process.env.OPENWA_WEBHOOK_SECRET || "";

function getHeaders() {
  const headers = {
    "Content-Type": "application/json",
    "Bypass-Tunnel-Reminder": "true",
    "ngrok-skip-browser-warning": "true",
  };
  if (API_KEY) headers["X-API-Key"] = API_KEY;
  return headers;
}

async function checkHealth() {
  console.log(`\n🔍 Checking OpenWA Gateway at: ${BASE_URL}...`);
  try {
    const res = await fetch(`${BASE_URL}/api/health`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      console.error(`❌ Gateway answered with HTTP ${res.status}`);
      return false;
    }
    const data = await res.json();
    console.log(`✅ OpenWA Gateway is ONLINE!`);
    console.log(`   Status: ${data.status || "ok"}`);
    if (data.version) console.log(`   Version: ${data.version}`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to connect to OpenWA at ${BASE_URL}`);
    console.error(`   Make sure the OpenWA server is running:`);
    console.error(`   👉 cd c:\\Users\\Prince\\Downloads\\OpenWA && npm run dev`);
    console.error(`   👉 Or: docker compose -f docker-compose.dev.yml up -d\n`);
    return false;
  }
}

async function listSessions() {
  try {
    const res = await fetch(`${BASE_URL}/api/sessions`, {
      headers: getHeaders(),
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function initSession() {
  const isHealthy = await checkHealth();
  if (!isHealthy) return;

  console.log(`\n🚀 Initializing WhatsApp session: '${SESSION_NAME}'...`);
  const sessions = await listSessions();
  let session = sessions.find((s) => s.name === SESSION_NAME || s.id === SESSION_NAME);

  if (!session) {
    console.log(`   Creating new session '${SESSION_NAME}'...`);
    const createRes = await fetch(`${BASE_URL}/api/sessions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name: SESSION_NAME }),
    });
    if (!createRes.ok) {
      const err = await createRes.text();
      console.error(`❌ Session creation failed: ${err}`);
      return;
    }
    session = await createRes.json();
    console.log(`   Session created (ID: ${session.id})`);
  } else {
    console.log(`   Found existing session (ID: ${session.id}, Status: ${session.status})`);
  }

  // Start the session
  console.log(`   Starting session engine...`);
  try {
    await fetch(`${BASE_URL}/api/sessions/${session.id}/start`, {
      method: "POST",
      headers: getHeaders(),
    });
  } catch (e) {
    // If already started, ignore
  }

  // Poll status & QR
  console.log(`\n⏳ Checking session status (waiting for QR code or ready)...`);
  for (let i = 0; i < 15; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    try {
      const statusRes = await fetch(`${BASE_URL}/api/sessions/${session.id}`, {
        headers: getHeaders(),
      });
      if (statusRes.ok) {
        const s = await statusRes.json();
        console.log(`   Status [${i + 1}/15]: ${s.status}`);

        if (s.status === "ready") {
          console.log(`\n🎉 WhatsApp is CONNECTED & READY!`);
          await setupWebhook(session.id);
          return;
        }

        if (s.status === "qr_ready" || s.qr) {
          console.log(`\n📲 QR CODE IS READY FOR SCANNING!`);
          console.log(`   👉 Open the OpenWA Dashboard in your browser:`);
          console.log(`      http://localhost:2785`);
          console.log(`   👉 Scan the QR code shown on screen using WhatsApp on your phone.`);
          console.log(`      (WhatsApp > Settings / Menu > Linked Devices > Link a Device)`);
          return;
        }
      }
    } catch {}
  }

  console.log(`\n💡 To complete pairing:`);
  console.log(`   1. Open WhatsApp on your mobile device`);
  console.log(`   2. Go to Settings > Linked Devices > Link a Device`);
  console.log(`   3. Scan the QR code in the dashboard: http://localhost:2785\n`);
}

async function listWebhooks(sessionNameOrId = SESSION_NAME) {
  const sessions = await listSessions();
  const session = sessions.find((s) => s.name === sessionNameOrId || s.id === sessionNameOrId);
  const targetId = session ? session.id : sessionNameOrId;

  try {
    const res = await fetch(`${BASE_URL}/api/sessions/${targetId}/webhooks`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      console.error(`❌ Failed to list webhooks: HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    console.log(`\n📋 Registered Webhooks for Session [${session?.name || targetId}]:`);
    if (!Array.isArray(data) || data.length === 0) {
      console.log(`   No webhooks registered.`);
    } else {
      data.forEach((w, idx) => {
        console.log(`   ${idx + 1}. URL: ${w.url}`);
        console.log(`      ID: ${w.id} | Active: ${w.active} | Events: ${w.events?.join(", ")}`);
      });
    }
    return data;
  } catch (err) {
    console.error(`❌ Error fetching webhooks: ${err.message}`);
    return [];
  }
}

async function clearWebhooks(sessionNameOrId = SESSION_NAME) {
  const sessions = await listSessions();
  const session = sessions.find((s) => s.name === sessionNameOrId || s.id === sessionNameOrId);
  const targetId = session ? session.id : sessionNameOrId;

  console.log(`\n🧹 Clearing existing webhooks for Session [${session?.name || targetId}]...`);
  try {
    const res = await fetch(`${BASE_URL}/api/sessions/${targetId}/webhooks`, {
      headers: getHeaders(),
    });
    const webhooks = await res.json();
    if (!Array.isArray(webhooks) || webhooks.length === 0) {
      console.log(`   No webhooks to remove.`);
      return;
    }

    for (const w of webhooks) {
      const delRes = await fetch(`${BASE_URL}/api/sessions/${targetId}/webhooks/${w.id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (delRes.ok || delRes.status === 204) {
        console.log(`   🗑️ Deleted webhook: ${w.url} (${w.id})`);
      } else {
        console.warn(`   ⚠️ Could not delete ${w.id}: HTTP ${delRes.status}`);
      }
    }
    console.log(`✅ Webhook list cleaned up!`);
  } catch (err) {
    console.error(`❌ Error clearing webhooks: ${err.message}`);
  }
}

async function setupWebhook(customUrlOrFlag = null, sessionNameOrId = SESSION_NAME) {
  const sessions = await listSessions();
  const session = sessions.find((s) => s.name === sessionNameOrId || s.id === sessionNameOrId);
  const targetId = session ? session.id : sessionNameOrId;

  let webhookUrl = "";
  if (customUrlOrFlag === "--local") {
    // Inside Docker, host.docker.internal connects to the Windows localhost Next.js app (default port 3110)
    const localPort = process.env.PORT || "3110";
    webhookUrl = `http://host.docker.internal:${localPort}/api/webhooks/whatsapp/openwa`;
  } else if (customUrlOrFlag && customUrlOrFlag.startsWith("http")) {
    webhookUrl = customUrlOrFlag.includes("/api/webhooks")
      ? customUrlOrFlag
      : `${customUrlOrFlag.replace(/\/+$/, "")}/api/webhooks/whatsapp/openwa`;
  } else {
    webhookUrl = `${APP_URL}/api/webhooks/whatsapp/openwa`;
  }

  console.log(`\n🔗 Registering Webhook to PetSaathi: ${webhookUrl} (Session ID: ${targetId})...`);

  try {
    const payload = {
      url: webhookUrl,
      events: ["message.received", "session.status"],
      ...(WEBHOOK_SECRET ? { secret: WEBHOOK_SECRET } : {}),
    };

    const res = await fetch(`${BASE_URL}/api/sessions/${targetId}/webhooks`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn(`   Webhook registration notice: ${err}`);
    } else {
      console.log(`✅ Webhook registered successfully!`);
      console.log(`   Destination: ${webhookUrl}`);
      console.log(`   PetSaathi AI will now automatically receive and reply to WhatsApp messages.`);
    }
  } catch (err) {
    console.error(`❌ Webhook setup error: ${err.message}`);
  }
}

async function sendTestMessage(recipient, text) {
  if (!recipient || !text) {
    console.error("Usage: node scripts/whatsapp-openwa.mjs --send <phoneNumber> <messageText>");
    console.error("Example: node scripts/whatsapp-openwa.mjs --send 919876543210 'Hello from PetSaathi!'");
    return;
  }

  const chatId = recipient.includes("@") ? recipient : `${recipient.replace(/[^0-9]/g, "")}@c.us`;
  console.log(`\n📤 Sending message to ${chatId}...`);

  const sessions = await listSessions();
  const session = sessions.find((s) => s.name === SESSION_NAME || s.id === SESSION_NAME);
  const targetId = session ? session.id : SESSION_NAME;

  try {
    const res = await fetch(`${BASE_URL}/api/sessions/${targetId}/messages/send-text`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        chatId,
        text,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`❌ Failed to send: HTTP ${res.status} - ${err}`);
      return;
    }

    const data = await res.json();
    console.log(`✅ Message dispatched successfully! Message ID: ${data.id || data.messageId || "ok"}`);
  } catch (err) {
    console.error(`❌ Error sending message: ${err.message}`);
  }
}

async function simulateChatbot(question) {
  console.log(`\n🧪 Simulating Inbound WhatsApp Message to PetSaathi AI...`);
  console.log(`   Customer Question: "${question}"`);

  const webhookEndpoint = `${APP_URL}/api/webhooks/whatsapp/openwa`;
  const mockPayload = {
    event: "message.received",
    sessionId: SESSION_NAME,
    data: {
      chatId: "919876543210@c.us",
      from: "919876543210@c.us",
      body: question,
      fromMe: false,
      type: "chat",
      timestamp: Math.floor(Date.now() / 1000),
    },
  };

  try {
    const res = await fetch(webhookEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockPayload),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const resJson = await res.json();
    console.log(`   Webhook Response Status: ${res.status}`);
    console.log(`   Result:`, JSON.stringify(resJson, null, 2));
  } catch (err) {
    console.warn(`⚠️  Web endpoint (${webhookEndpoint}) unreachable (${err.message}).`);
    console.log(`🤖 Invoking PetSaathi NVIDIA AI Router directly to test chatbot response...`);
    try {
      const { askNvidia } = await import("../ai/router.mjs");
      const systemInstruction = 
        `You are PetSaathi AI, the friendly and reliable pet care assistant for PetSaathi (India's premier community pet-care platform). ` +
        `PetSaathi offers daily dog walking with live GPS tracking, pet sitting, in-home grooming, and veterinary teleconsultations in Indian residential societies. ` +
        `Keep WhatsApp responses conversational, warm, concise, and structured with clean bullet points or line breaks suitable for mobile reading. ` +
        `If asked about dog walking or pet care in Indian societies, mention PetSaathi's verified walkers, GPS route tracking, and flexible morning/evening plans.`;

      const userPrompt = `${systemInstruction}\n\nCustomer question on WhatsApp: "${question}"`;
      const reply = await askNvidia(
        { task: "fast", difficulty: "normal", isCustomerChat: true, portal: "customer" },
        userPrompt
      );
      console.log(`\n💬 PetSaathi AI WhatsApp Response:\n----------------------------------`);
      console.log(reply);
      console.log(`----------------------------------\n`);
    } catch (aiErr) {
      console.error(`❌ Direct AI test failed:`, aiErr.message);
    }
  }
}

// CLI Argument Parsing
const args = process.argv.slice(2);
const command = args[0] || "--help";

switch (command) {
  case "--status":
    checkHealth().then(async (online) => {
      if (online) {
        const sessions = await listSessions();
        console.log(`   Total Sessions: ${sessions.length}`);
        sessions.forEach((s) => console.log(`   - [${s.name || s.id}] Status: ${s.status}`));
      }
    });
    break;

  case "--init":
    initSession();
    break;

  case "--webhook":
    setupWebhook(args[1]);
    break;

  case "--webhooks":
  case "--list-webhooks":
    listWebhooks();
    break;

  case "--clear-webhooks":
    clearWebhooks();
    break;

  case "--send":
    sendTestMessage(args[1], args[2] || "Hello from PetSaathi AI WhatsApp Bot!");
    break;

  case "--simulate":
    simulateChatbot(args[1] || "Hello PetSaathi, what dog walking packages do you offer?");
    break;

  case "--help":
  default:
    console.log(`
PetSaathi OpenWA Manager CLI
----------------------------
Usage:
  node scripts/whatsapp-openwa.mjs [command]

Commands:
  --status                 Check if OpenWA Gateway is online and list sessions
  --init                   Create & start WhatsApp session, display QR code pairing instructions
  --webhook [url|--local]  Register PetSaathi's AI webhook with OpenWA (or pass --local / custom URL)
  --list-webhooks          List active webhooks configured in OpenWA
  --clear-webhooks         Remove all registered webhooks from OpenWA
  --send <phone> <text>    Send a test WhatsApp message to a customer
  --simulate <question>    Simulate an inbound customer WhatsApp message through PetSaathi AI
  --help                   Show this help message
`);
    break;
}
