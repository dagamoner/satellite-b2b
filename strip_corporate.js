const fs = require('fs');
const file = 'apps/satelital/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove Corporate Hero and Ecosistema
// The target block starts right after {/* Hero Section */} and ends just before <h1 id="conectividad-sin-fronteras"
const heroSectionStart = content.indexOf('{/* Hero Section */}');
if (heroSectionStart > -1) {
    const h1Index = content.indexOf('<h1 id="conectividad-sin-fronteras"');
    if (h1Index > heroSectionStart) {
        // Find the start of the section tag right after {/* Hero Section */}
        const sectionTagStart = content.indexOf('<section', heroSectionStart);
        // Find the start of the <motion.div right after that
        const motionDivStart = content.indexOf('<motion.div', sectionTagStart);
        
        // We want to keep the <section> tag, but remove everything from <motion.div down to just before <h1
        if (motionDivStart > -1 && motionDivStart < h1Index) {
            const before = content.substring(0, motionDivStart);
            const after = content.substring(h1Index);
            content = before + after;
        }
    }
}

// 2. Remove Immersive Overlay
const immersiveStart = content.indexOf('{/* Immersive Overlay for Selected Ecosystem */}');
if (immersiveStart > -1) {
    // It's wrapped in an AnimatePresence which ends at </AnimatePresence>
    // Just find the nearest </AnimatePresence> after immersiveStart
    const animateEnd = content.indexOf('</AnimatePresence>', immersiveStart);
    if (animateEnd > -1) {
        const before = content.substring(0, immersiveStart);
        const after = content.substring(animateEnd + '</AnimatePresence>'.length);
        content = before + after;
    }
}

// 3. Remove selectedEcosistema state
content = content.replace(/const \[selectedEcosistema, setSelectedEcosistema\] = useState<number \| null>\(null\);\n?/g, '');

// 4. Remove handleAdvance
content = content.replace(/const handleAdvance = useCallback\(\(\) => \{[\s\S]*?\}, \[selectedEcosistema\]\);\n?/g, '');

// 5. Remove useEffect that resets selectedEcosistema
content = content.replace(/useEffect\(\(\) => \{\n\s*setSelectedEcosistema\(null\);\n\s*\}, \[\]\);\n?/g, '');

fs.writeFileSync(file, content);
console.log('Cleanup completed successfully.');
