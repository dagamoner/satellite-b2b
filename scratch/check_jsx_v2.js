import fs from 'fs';

const content = fs.readFileSync('apps/marketing/app/page.tsx', 'utf8');

function checkJSX(code) {
    let line = 1;
    let col = 1;
    let stack = [];
    let inTag = false;
    let tagBuffer = "";
    let isClosing = false;
    let isSelfClosing = false;
    let inComment = false;
    let inString = false;
    let stringChar = "";

    for (let i = 0; i < code.length; i++) {
        const char = code[i];
        const next = code[i+1];

        if (char === '\n') { line++; col = 1; } else { col++; }

        if (inComment) {
            if (char === '*' && next === '/') { inComment = false; i++; }
            else if (char === '-' && next === '-' && code[i+2] === '>') { inComment = false; i += 2; }
            continue;
        }

        if (inString) {
            if (char === stringChar) inString = false;
            continue;
        }

        if (!inTag) {
            if (char === '<' && next === '!' && code[i+2] === '-' && code[i+3] === '-') { inComment = true; i += 3; continue; }
            if (char === '<' && next === '/') { inTag = true; isClosing = true; tagBuffer = ""; i++; continue; }
            if (char === '<' && /[a-zA-Z]/.test(next)) { inTag = true; isClosing = false; tagBuffer = ""; continue; }
            if (char === '{' && next === '/' && code[i+2] === '*') { inComment = true; i += 2; continue; }
        } else {
            if (char === '"' || char === "'") { inString = true; stringChar = char; continue; }
            if (char === '/' && next === '>') { isSelfClosing = true; }
            if (char === '>') {
                let tagName = tagBuffer.split(/\s/)[0];
                if (isClosing) {
                    if (stack.length === 0) {
                        console.log(`Extra closing tag </${tagName}> at ${line}:${col}`);
                    } else {
                        let last = stack.pop();
                        if (last !== tagName) {
                            console.log(`Mismatch: <${last}> closed by </${tagName}> at ${line}:${col}`);
                        }
                    }
                } else if (!isSelfClosing) {
                    stack.push(tagName);
                }
                inTag = false;
                isSelfClosing = false;
                isClosing = false;
                continue;
            }
            if (!/\s/.test(char) || tagBuffer.length > 0) {
                if (!isSelfClosing) tagBuffer += char;
            }
        }
    }
    console.log("Finished. Stack size:", stack.length);
    if (stack.length > 0) console.log("Remaining stack:", stack);
}

checkJSX(content);
