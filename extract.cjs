const fs = require('fs');
const content = fs.readFileSync('src/server/server-readme.ts', 'utf-8');
const code = content.split('`')[1];
fs.writeFileSync('server.js', code);
