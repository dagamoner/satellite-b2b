const fs = require('fs');

const pages = [
  'apps/corporate/app/page.tsx',
  'apps/satelital/app/page.tsx',
  'apps/erp/app/page.tsx',
  'apps/ia/app/page.tsx',
  'apps/informatica/app/page.tsx',
  'apps/cyber/app/page.tsx'
];

for (const p of pages) {
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf-8');
    
    // Fix the Nav blocks
    let leftBlockRegex = /\{\/\*\s*Left Block[\s\S]*?(?=\{\/\*\s*Center Block)/;
    let rightBlockRegex = /\{\/\*\s*Right Block[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/nav>)/;
    
    let leftMatch = content.match(leftBlockRegex);
    let rightMatch = content.match(rightBlockRegex);
    
    if (leftMatch && rightMatch) {
      let rightContent = rightMatch[0];
      let leftContent = leftMatch[0];
      
      let newLeft = rightContent.replace('Right Block', 'Left Block')
                     .replace('justify-end', 'justify-start');
      
      let newRight = leftContent.replace('Left Block', 'Right Block')
                      .replace('justify-start', 'justify-end');
                      
      content = content.replace(leftBlockRegex, '___LEFT_PLACEHOLDER___');
      content = content.replace(rightBlockRegex, newRight);
      content = content.replace('___LEFT_PLACEHOLDER___', newLeft);
      
      console.log('Swapped nav in ' + p);
    }
    
    // Fix ecosystem hover
    // Look for onMouseEnter={() => setSelectedEcosistema(i)}
    // And onMouseLeave={() => setSelectedEcosistema(null)}
    if (content.includes('setSelectedEcosistema(i)')) {
      content = content.replace(/onMouseEnter=\{\(\) => setSelectedEcosistema\(i\)\}/g, 
        `onClick={(e) => {\n                    if (clickedEcosistema !== i) {\n                      e.preventDefault();\n                      setClickedEcosistema(i);\n                    }\n                  }}`);
      console.log('Fixed ecosystem click logic in ' + p);
    }
    
    fs.writeFileSync(p, content);
  }
}
