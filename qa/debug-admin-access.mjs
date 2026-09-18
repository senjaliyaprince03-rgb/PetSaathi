import fs from "fs";

async function debug() {
  const adminRes = await fetch("http://127.0.0.1:3000/admin", {
    headers: { Cookie: "petsaathi_session=ZHs1KezkGG5uSklPMSYdDOEbLG2WFd00GeSR6tQoFU4" },
  });
  const text = await adminRes.text();
  fs.writeFileSync("qa/admin-response.html", text);
  console.log("Saved qa/admin-response.html, length:", text.length);
}

debug().catch(console.error);
