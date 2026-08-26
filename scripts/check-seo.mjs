const pages = ['/', '/services', '/membership', '/journal', '/contact', '/book'];

for (const p of pages) {
  try {
    const res = await fetch('http://127.0.0.1:3110' + p);
    const html = await res.text();
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const descMatch = html.match(/name="description" content="([^"]+)"/);
    const hasOgImg = html.includes('property="og:image"') || html.includes('name="og:image"');
    
    console.log(`${p.padEnd(15)} | title: ${(titleMatch ? titleMatch[1].slice(0, 35) + '...' : 'MISSING').padEnd(40)} | desc: ${(descMatch ? descMatch[1].slice(0, 40) + '...' : 'MISSING').padEnd(45)} | og:image: ${hasOgImg ? 'EXISTS' : 'MISSING'}`);
  } catch (err) {
    console.log(`${p.padEnd(15)} | ERROR: ${err.message}`);
  }
}
