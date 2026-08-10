import fs from 'fs';

const content = fs.readFileSync('apps/marketing/app/page.tsx', 'utf8');

function checkBalance(text) {
    const stack = [];
    const regex = /<(\/?[a-zA-Z][a-zA-Z0-9]*)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        const tag = match[1];
        if (tag.startsWith('/')) {
            const closing = tag.substring(1);
            if (stack.length === 0) {
                console.log(`Extra closing tag: </${closing}> near index ${match.index}`);
            } else {
                const last = stack.pop();
                if (last !== closing) {
                    console.log(`Mismatch: <${last}> closed by </${closing}> near index ${match.index}`);
                }
            }
        } else {
            // Ignore self-closing tags (roughly)
            // This is a very simple check, might miss some cases
            const endOfTag = text.indexOf('>', match.index);
            if (text[endOfTag - 1] !== '/') {
                stack.push(tag);
            }
        }
    }
    console.log('Remaining stack:', stack);
}

checkBalance(content);
