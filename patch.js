const fs = require('fs');
let content = fs.readFileSync('apps/marketing/app/page.tsx', 'utf8');

// Replace general text-white with text-slate-900 dark:text-white
content = content.replace(/text-white( mb-2 tracking-tight)/g, 'text-slate-900 dark:text-white$1');
content = content.replace(/text-white( tracking-tight)/g, 'text-slate-900 dark:text-white$1');
content = content.replace(/text-white( mb-10 leading-relaxed)/g, 'text-slate-800 dark:text-white$1');
content = content.replace(/text-white( drop-shadow-xl)/g, 'text-slate-900 dark:text-white$1');
content = content.replace(/text-white( drop-shadow-md)/g, 'text-slate-900 dark:text-white$1');

// Replace specific card texts
content = content.replace(/text-4xl font-black text-white/g, 'text-4xl font-black text-slate-900 dark:text-white');
content = content.replace(/text-2xl font-black text-white/g, 'text-2xl font-black text-slate-900 dark:text-white');

// Replace subtexts
content = content.replace(/text-slate-300( max-w-2xl)/g, 'text-slate-700 dark:text-slate-300$1');
content = content.replace(/text-slate-200( space-y-4)/g, 'text-slate-700 dark:text-slate-200$1');
content = content.replace(/text-slate-300( space-y-4)/g, 'text-slate-700 dark:text-slate-300$1');
content = content.replace(/text-slate-500( text-base mt-1)/g, 'text-slate-600 dark:text-slate-500$1');
content = content.replace(/text-blue-300( font-bold uppercase)/g, 'text-blue-600 dark:text-blue-300$1');
content = content.replace(/text-blue-200\/50/g, 'text-slate-500 dark:text-blue-200/50');
content = content.replace(/text-blue-300( mb-2)/g, 'text-blue-600 dark:text-blue-300$1');

// Fix border colors of glass cards
content = content.replace(/bg-\[\#020617\]\/40 backdrop-blur-xl/g, 'bg-white/40 dark:bg-[#020617]/40 backdrop-blur-xl');
content = content.replace(/border-slate-800\/80/g, 'border-slate-300/80 dark:border-slate-800/80');

fs.writeFileSync('apps/marketing/app/page.tsx', content);
console.log('Patch complete.');
