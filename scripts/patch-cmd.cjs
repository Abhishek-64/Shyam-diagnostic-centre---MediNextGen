const fs = require('fs');
const path = require('path');

const binDir = path.resolve(__dirname, '..', 'node_modules', '.bin');

if (!fs.existsSync(binDir)) {
  console.log('No node_modules/.bin found.');
  process.exit(0);
}

const files = fs.readdirSync(binDir);
let patched = 0;

for (const file of files) {
  if (!file.endsWith('.cmd')) continue;
  const filePath = path.join(binDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix unquoted SET dp0=%~dp0 which breaks on '&' in Windows folder paths
  if (content.includes('SET dp0=%~dp0')) {
    content = content.replace(/SET dp0=%~dp0/g, 'SET "dp0=%~dp0"');
    fs.writeFileSync(filePath, content, 'utf8');
    patched++;
  }
}

console.log(`Patched ${patched} .cmd files in node_modules/.bin for '&' path safety.`);
