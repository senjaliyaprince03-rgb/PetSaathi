const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('./src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

let changedFiles = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Replace text-gray-400 and text-gray-500 with text-gray-700
  content = content.replace(/text-gray-[45]00\b/g, 'text-gray-700');
  // Also slate, zinc, neutral, stone
  content = content.replace(/text-(slate|zinc|neutral|stone)-[45]00\b/g, 'text--700');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
});

console.log("Updated standard tailwind grays in " + changedFiles + " files.");
