const fs = require('fs');

let content = fs.readFileSync('apps/marketing/app/page.tsx', 'utf8');

// Helper to replace classes safely inside className strings
function updateClasses(regex, replacer) {
    content = content.replace(/className=(["'{][^"'}]+["'}])/g, (match, classStr) => {
        return `className=${classStr.replace(regex, replacer)}`;
    });
}

// Ensure base text-white that were missed are updated
content = content.replace(/(?<=className="[^"]*)text-white(?=[^"]*")/g, (match, offset, string) => {
    // Avoid double replacing if dark:text-white is already there
    const contextStr = string.slice(Math.max(0, offset - 20), offset + 20);
    if (contextStr.includes('dark:text-white')) return 'text-white';
    return 'text-slate-900 dark:text-white';
});

// Update specific gray text colors that are unreadable in light mode
content = content.replace(/(?<=className="[^"]*)text-slate-400(?=[^"]*")/g, (match, offset, string) => {
    const contextStr = string.slice(Math.max(0, offset - 20), offset + 20);
    if (contextStr.includes('dark:text-slate-400')) return 'text-slate-400';
    return 'text-slate-600 dark:text-slate-400';
});

content = content.replace(/(?<=className="[^"]*)text-slate-300(?=[^"]*")/g, (match, offset, string) => {
    const contextStr = string.slice(Math.max(0, offset - 20), offset + 20);
    if (contextStr.includes('dark:text-slate-300')) return 'text-slate-300';
    return 'text-slate-700 dark:text-slate-300';
});

content = content.replace(/(?<=className="[^"]*)text-slate-200(?=[^"]*")/g, (match, offset, string) => {
    const contextStr = string.slice(Math.max(0, offset - 20), offset + 20);
    if (contextStr.includes('dark:text-slate-200')) return 'text-slate-200';
    return 'text-slate-800 dark:text-slate-200';
});

content = content.replace(/(?<=className="[^"]*)text-blue-300(?=[^"]*")/g, (match, offset, string) => {
    const contextStr = string.slice(Math.max(0, offset - 20), offset + 20);
    if (contextStr.includes('dark:text-blue-300')) return 'text-blue-300';
    return 'text-blue-700 dark:text-blue-300';
});

content = content.replace(/(?<=className="[^"]*)text-blue-200\/50(?=[^"]*")/g, (match, offset, string) => {
    return 'text-blue-800/60 dark:text-blue-200/50';
});

content = content.replace(/(?<=className="[^"]*)text-cyan-400(?=[^"]*")/g, (match, offset, string) => {
    const contextStr = string.slice(Math.max(0, offset - 20), offset + 20);
    if (contextStr.includes('dark:text-cyan-400')) return 'text-cyan-400';
    return 'text-cyan-700 dark:text-cyan-400';
});

content = content.replace(/(?<=className="[^"]*)text-cyan-300(?=[^"]*")/g, (match, offset, string) => {
    const contextStr = string.slice(Math.max(0, offset - 20), offset + 20);
    if (contextStr.includes('dark:text-cyan-300')) return 'text-cyan-300';
    return 'text-cyan-700 dark:text-cyan-300';
});

// Fix gradient for "y en el lugar que tu empresa se encuentre..."
const oldGrad = "from-blue-400 via-cyan-300 to-indigo-400";
const newGrad = "from-blue-700 via-cyan-600 to-indigo-700 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-400";
content = content.replace(oldGrad, newGrad);

fs.writeFileSync('apps/marketing/app/page.tsx', content);
console.log('Patch2 complete.');
