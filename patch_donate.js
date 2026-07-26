const fs = require('fs');
const path = './src/pages/public/Donate.tsx';
let code = fs.readFileSync(path, 'utf8');
if (!code.includes('QUICK_AMOUNTS')) {
  code = code.replace('export default function Donate() {', 'const QUICK_AMOUNTS = [100, 500, 1000, 2500, 5000, 10000];\n\nexport default function Donate() {');
  fs.writeFileSync(path, code);
  console.log('Successfully patched Donate.tsx');
} else {
  console.log('QUICK_AMOUNTS already exists');
}
