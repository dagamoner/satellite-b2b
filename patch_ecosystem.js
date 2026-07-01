const fs = require('fs');
const file = 'apps/corporate/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove background and blur from the centered logo wrapper
content = content.replace(
  '${clickedEcosistema !== null ? "fixed inset-0 z-40 bg-[#020617]/80 backdrop-blur-sm m-0" : "relative min-h-[12rem] md:min-h-[16rem]"}',
  '${clickedEcosistema !== null ? "fixed inset-0 z-40 m-0" : "relative min-h-[12rem] md:min-h-[16rem]"}'
);

// 2. Increase the scale from 1.5 to 2.2
content = content.replace(
  'scale: clickedEcosistema === i ? 1.5 : isSelected ? 1.2 : 1',
  'scale: clickedEcosistema === i ? 2.2 : isSelected ? 1.2 : 1'
);

// 3. Keep MR Tech logo visible in header (revert the clickedEcosistema !== null part for the left block)
content = content.replace(
  '<div className={`flex-1 flex items-center justify-start hidden md:flex ${isSatelital || clickedEcosistema !== null ? "invisible opacity-0" : "opacity-100"} transition-opacity duration-500`}>',
  '<div className={`flex-1 flex items-center justify-start hidden md:flex ${isSatelital ? "invisible opacity-0" : "opacity-100"} transition-opacity duration-500`}>'
);

// 4. Replace Leyenda ecosistema.png with Text
const imgTarget = `<img
               src="/Leyenda ecosistema.png"
               alt="Ecosistema by MR Tech"
               className="h-14 md:h-[4.5rem] w-auto object-contain relative z-10 pointer-events-none select-none"
               style={{
                 mixBlendMode: 'screen',
                 WebkitMaskImage: 'radial-gradient(ellipse 88% 82% at 50% 50%, black 60%, transparent 100%)',
                 maskImage: 'radial-gradient(ellipse 88% 82% at 50% 50%, black 60%, transparent 100%)',
               }}
             />`;

const textReplacement = `<div className="flex items-center justify-center relative z-10 pointer-events-none select-none h-14 md:h-[4.5rem]">
               <h2 className="text-[1.5rem] md:text-[2.2rem] font-black tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(51,232,255,0.6)]">
                 <span className="text-[#33E8FF]">ECOSISTEMA</span> <span className="text-white">BY MR TECH</span>
               </h2>
             </div>`;

content = content.replace(imgTarget, textReplacement);

fs.writeFileSync(file, content);
console.log('Patched ecosystem styles perfectly.');
