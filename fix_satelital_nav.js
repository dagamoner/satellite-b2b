const fs = require('fs');
const file = 'apps/satelital/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove Immersive Overlay
const startAnimate = content.indexOf('<AnimatePresence>');
const endAnimate = content.indexOf('</AnimatePresence>') + '</AnimatePresence>'.length;
if (startAnimate !== -1 && endAnimate !== -1) {
    content = content.slice(0, startAnimate) + content.slice(endAnimate);
}

// 2. Fix Ecosistema Logo onClick
content = content.replace(
    /onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*setSelectedEcosistema\(isSelected \? null : i\);\s*\}\}/g,
    `onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = logo.url;
                  }}`
);

// 3. Fix Header Ecosistema Button
content = content.replace(
    /setSelectedEcosistema\(null\);\s*setTimeout\(\(\) => \{\s*document\.getElementById\('ecosistema'\)\?\.scrollIntoView\(\{ behavior: 'smooth', block: 'center' \}\);\s*\}, 100\);/g,
    `window.location.href = "https://www.mrtechnology.it.com";`
);

// 4. Remove useEffect that watched selectedEcosistema for the overlay
content = content.replace(
    /\s*\/\/ Action when logos are selected\s*useEffect\(\(\) => \{[\s\S]*?\}, \[selectedEcosistema\]\);/g,
    ''
);

// 5. Remove handleAdvance
content = content.replace(
    /\s*const handleAdvance = useCallback\(\(\) => \{[\s\S]*?\}, \[selectedEcosistema\]\);/g,
    ''
);

fs.writeFileSync(file, content);
console.log('Fixed satelital page navigation and removed overlay.');
