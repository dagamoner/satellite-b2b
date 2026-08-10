import os

with open('apps/erp/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_str = '      {/* Modal / Lightbox para Instancia B */}'
end_str = '      {/* Footer mínimo */}'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    block = content[start_idx:end_idx]
    
    # Replace variables and titles
    new_block = block.replace('Instancia B', 'Instancia C')
    new_block = new_block.replace('mostrarInstanciaB', 'mostrarInstanciaC')
    new_block = new_block.replace('mostrarPreciosB', 'mostrarPreciosC')
    
    # Replace the "B" in the gradient text to "C"
    new_block = new_block.replace('>\n                            B\n                          </span>', '>\n                            C\n                          </span>')
    
    # Insert new block before footer
    new_content = content[:end_idx] + new_block + content[end_idx:]
    
    with open('apps/erp/app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Done adding Modal C.")
else:
    print("Could not find start or end strings.")
