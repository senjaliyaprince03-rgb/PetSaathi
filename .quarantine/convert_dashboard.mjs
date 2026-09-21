import fs from 'fs';

let html = fs.readFileSync('new_customer_dashboard.html', 'utf8');

// Basic JSX conversion
function htmlToJsx(str) {
  return str
    .replace(/class=/g, 'className=')
    .replace(/<!--/g, '{/*')
    .replace(/-->/g, '*/}')
    .replace(/<img([^>]+)>/g, (match, p1) => \<img\ />\)
    .replace(/<input([^>]+)>/g, (match, p1) => \<input\ />\)
    .replace(/<br>/g, '<br />');
}

const bodyStart = html.indexOf('<body');
const bodyEnd = html.indexOf('</body>');
const bodyContent = html.substring(html.indexOf('>', bodyStart) + 1, bodyEnd);

const navStart = bodyContent.indexOf('<nav');
const navEnd = bodyContent.indexOf('</nav>') + 6;
const navHtml = bodyContent.substring(navStart, navEnd);

const headerStart = bodyContent.indexOf('<header');
const headerEnd = bodyContent.indexOf('</header>') + 9;
const headerHtml = bodyContent.substring(headerStart, headerEnd);

const mainStart = bodyContent.indexOf('<main');
const mainEnd = bodyContent.indexOf('</main>') + 7;
const mainHtml = bodyContent.substring(mainStart, mainEnd);

fs.writeFileSync('nav.jsx', htmlToJsx(navHtml));
fs.writeFileSync('header.jsx', htmlToJsx(headerHtml));
fs.writeFileSync('main.jsx', htmlToJsx(mainHtml));
console.log('JSX extraction complete.');
