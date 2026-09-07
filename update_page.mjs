const fs = require('fs');
let page = fs.readFileSync('dashboard_page_backup.txt', 'utf8');

const startContent = page.indexOf('<div className="max-w-6xl mx-auto');
const endContent = page.lastIndexOf('</main>');

if (startContent > -1 && endContent > -1) {
  let content = page.substring(startContent, endContent).trim();
  let newPage = page.substring(0, page.indexOf('return ('));
  newPage += 'return (\n    <>\n' + content + '\n    </>\n  );\n}\n';
  fs.writeFileSync('c:/Users/Prince/Downloads/PetSaathi/src/app/(portal)/dashboard/page.tsx', newPage);
  console.log('Page updated successfully.');
}
