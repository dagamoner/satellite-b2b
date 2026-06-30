const fs = require('fs');
const file = 'apps/satelital/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Convert string to array of lines for easier manipulation
let lines = content.split('\n');

// Find indices
const heroSectionIdx = lines.findIndex(l => l.includes('{/* Hero Section */}'));
const motionDivIdx = lines.findIndex((l, i) => i > heroSectionIdx && l.includes('<motion.div'));
const mainLogoIdx = lines.findIndex((l, i) => i > motionDivIdx && l.includes('{/* Main Logo */}'));
const h1Idx = lines.findIndex(l => l.includes('<h1 id="conectividad-sin-fronteras"'));

// Find closing </motion.div> for the motionDivIdx
// It's the one before {/* Immersive Overlay
const immersiveIdx = lines.findIndex(l => l.includes('{/* Immersive Overlay'));
let motionDivCloseIdx = -1;
for (let i = immersiveIdx - 1; i >= h1Idx; i--) {
    if (lines[i].includes('</motion.div>')) {
        motionDivCloseIdx = i;
        break;
    }
}

// Find end of Immersive Overlay (AnimatePresence)
const animatePresenceCloseIdx = lines.findIndex((l, i) => i > immersiveIdx && l.includes('</AnimatePresence>'));

if (heroSectionIdx > -1 && motionDivIdx > -1 && mainLogoIdx > -1 && h1Idx > -1 && motionDivCloseIdx > -1 && immersiveIdx > -1 && animatePresenceCloseIdx > -1) {
    // 1. Remove Immersive Overlay first (bottom to top so indices don't shift)
    lines.splice(immersiveIdx, animatePresenceCloseIdx - immersiveIdx + 1);
    
    // 2. Remove the closing </motion.div>
    lines.splice(motionDivCloseIdx, 1);
    
    // 3. Remove from Main Logo to just before h1
    lines.splice(mainLogoIdx, h1Idx - mainLogoIdx);
    
    // 4. Remove the opening <motion.div> block (lines motionDivIdx to mainLogoIdx - 1)
    // Wait, motionDiv opened at motionDivIdx, and has properties spanning a few lines.
    // The exact lines are from motionDivIdx up to mainLogoIdx - 1
    lines.splice(motionDivIdx, mainLogoIdx - motionDivIdx);
    
    // 5. Remove selectedEcosistema state
    lines = lines.filter(l => !l.includes('const [selectedEcosistema, setSelectedEcosistema] = useState<number | null>(null);'));
    
    // 6. Remove handleAdvance block
    const handleAdvanceStart = lines.findIndex(l => l.includes('const handleAdvance = useCallback(() => {'));
    if (handleAdvanceStart > -1) {
        let handleAdvanceEnd = handleAdvanceStart;
        while (!lines[handleAdvanceEnd].includes('}, [selectedEcosistema]);')) {
            handleAdvanceEnd++;
        }
        lines.splice(handleAdvanceStart, handleAdvanceEnd - handleAdvanceStart + 1);
    }
    
    // 7. Remove useEffect for selectedEcosistema
    const useEffectStart = lines.findIndex((l, i) => l.includes('useEffect(() => {') && lines[i+1] && lines[i+1].includes('setSelectedEcosistema(null);'));
    if (useEffectStart > -1) {
        lines.splice(useEffectStart, 3);
    }
    
    // Write back
    fs.writeFileSync(file, lines.join('\n'));
    console.log('Successfully cleaned up page.tsx');
} else {
    console.log('Could not find all required indices', {
        heroSectionIdx, motionDivIdx, mainLogoIdx, h1Idx, motionDivCloseIdx, immersiveIdx, animatePresenceCloseIdx
    });
}
