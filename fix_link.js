const fs = require('fs');
const file = 'apps/satelital/app/page.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('setSelectedEcosistema(null)'));
if (idx > -1) {
    lines[idx] = '                   window.location.href = "https://www.mrtechnology.it.com";';
    lines.splice(idx+1, 3);
    fs.writeFileSync(file, lines.join('\n'));
    console.log('Replaced successfully');
}
