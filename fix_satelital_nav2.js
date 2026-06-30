const fs = require('fs');
const file = 'apps/satelital/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove useState for selectedEcosistema
content = content.replace(/const\s+\[selectedEcosistema,\s+setSelectedEcosistema\]\s+=\s+useState<number\s+\|\s+null>\(null\);\s*/, '');

// 2. Remove handleAdvance
content = content.replace(/const\s+handleAdvance\s+=\s+useCallback\(\(\)\s+=>\s+\{[\s\S]*?\},\s+\[selectedEcosistema\]\);\s*/, '');

// 3. Remove useEffect for Action when logos are selected
content = content.replace(/\/\/\s+Action\s+when\s+logos\s+are\s+selected\s*useEffect\(\(\)\s+=>\s+\{[\s\S]*?\},\s+\[selectedEcosistema,\s+handleAdvance\]\);\s*/, '');

// 4. Update Header Ecosistema Button onClick
content = content.replace(
    /onClick=\{\(\)\s+=>\s+\{\s*setSelectedEcosistema\(null\);\s*setTimeout\(\(\)\s+=>\s+\{\s*document\.getElementById\('ecosistema'\)\?\.scrollIntoView\(\{ behavior: 'smooth', block: 'center' \}\);\s*\},\s*100\);\s*\}\}/g,
    'onClick={() => { window.location.href = "https://www.mrtechnology.it.com"; }}'
);

// 5. Update Logo .map() onClick and isSelected/isOther
content = content.replace(
    /const\s+isSelected\s+=\s+selectedEcosistema\s+===\s+i;\s*const\s+isOther\s+=\s+selectedEcosistema\s+!==\s+null\s+&&\s+!isSelected;\s*/g,
    'const isSelected = false; const isOther = false;\n'
);

content = content.replace(
    /onClick=\{\(e\)\s+=>\s+\{\s*e\.stopPropagation\(\);\s*setSelectedEcosistema\(isSelected\s+\?\s+null\s+:\s+i\);\s*\}\}/g,
    `onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const urls = ["https://satelital.mrtechnology.it.com", "https://informatica.mrtechnology.it.com", "https://erp.mrtechnology.it.com", "https://ai.mrtechnology.it.com", "https://ciberseguridad.mrtechnology.it.com"];
                    window.location.href = urls[i] || "";
                  }}`
);

// 6. Remove Immersive Overlay
const overlayStartStr = '{/* Immersive Overlay for Selected Ecosystem */}';
const startIdx = content.indexOf(overlayStartStr);
if (startIdx !== -1) {
    const endIdx = content.indexOf('</AnimatePresence>', startIdx);
    if (endIdx !== -1) {
        content = content.slice(0, startIdx) + content.slice(endIdx + '</AnimatePresence>'.length);
    }
}

fs.writeFileSync(file, content);
console.log('Fixed satelital correctly.');
