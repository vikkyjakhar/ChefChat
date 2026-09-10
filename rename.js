import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'README.md',
  'server.js',
  'src/App.tsx',
  'src/components/JoinScreen.tsx',
  'src/server/server-readme.ts',
  'src/hooks/useChat.ts',
  'src/lib/crypto.ts',
  '.figma/make/site.json'
];

for (const file of filesToUpdate) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    // Replace all occurrences of ChefChat with ui_files
    content = content.replace(/ChefChat/g, 'ui_files');
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`Skipped ${file} - not found`);
  }
}
