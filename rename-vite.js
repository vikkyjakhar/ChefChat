import fs from 'fs';
import path from 'path';

const file = 'vite.config.ts';
const filePath = path.join(process.cwd(), file);
let content = fs.readFileSync(filePath, 'utf-8');
content = content.replace(/\.figma/g, 'ui_files');
fs.writeFileSync(filePath, content, 'utf-8');
