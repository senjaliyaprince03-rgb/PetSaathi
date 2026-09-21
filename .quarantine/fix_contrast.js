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
  
  content = content.replace(/text-ink\/(?:[1-7][0-9]|[1-9])\b/g, 'text-ink/80');
  content = content.replace(/text-indigo\/(?:[1-7][0-9]|[1-9])\b/g, 'text-indigo/80');
  content = content.replace(/text-paper\/(?:[1-7][0-9]|[1-9])\b/g, 'text-paper/80');
  content = content.replace(/text-coral\/(?:[1-7][0-9]|[1-9])\b/g, 'text-coral/80');
  content = content.replace(/text-white\/(?:[1-7][0-9]|[1-9])\b/g, 'text-white/80');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
});

console.log("Updated contrast in " + changedFiles + " files.");
