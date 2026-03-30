import fs from 'fs';
const content = fs.readFileSync('C:/Users/usuario/hospital-buin-paine-dashboard/src/App.tsx', 'utf8');
const lines = content.split('\n');
// Find the exact boundaries of Esp. Técnicas section
for (let i = 2880; i < 3000; i++) {
  console.log(`Line ${i + 1}: ${lines[i]}`);
}
