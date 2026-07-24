import os
import re

with open('apps/erp/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Modal B positioning
modal_b_start = content.find('{/* ── HERO Instancia B ── */}')
if modal_b_start != -1:
    search_str = 'className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-6 w-full"'
    replace_str = 'className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-6 w-full mt-12 md:mt-24"'
    
    # only replace in the next few lines
    b_block = content[modal_b_start:modal_b_start+1000]
    new_b_block = b_block.replace(search_str, replace_str)
    content = content.replace(b_block, new_b_block)

# Fix Modal C positioning
modal_c_start = content.find('{/* ── HERO Instancia C ── */}')
if modal_c_start != -1:
    search_str = 'className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-6 w-full"'
    replace_str = 'className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-6 w-full mt-12 md:mt-24"'
    c_block = content[modal_c_start:modal_c_start+1000]
    new_c_block = c_block.replace(search_str, replace_str)
    content = content.replace(c_block, new_c_block)

# Find Modal C block
modal_c_start = content.find('{/* Modal / Lightbox para Instancia C */}')
footer_start = content.find('{/* Footer mínimo */}')

if modal_c_start != -1 and footer_start != -1:
    c_block = content[modal_c_start:footer_start]
    
    # Replace cyan colors with orange
    # Cyan Hex: #33E8FF -> Orange Hex: #f97316 (or #f97316)
    # cyan-500 -> orange-500
    # cyan-400 -> orange-400
    # rgba(51,232,255 -> rgba(249,115,22
    
    c_block = c_block.replace('#33E8FF', '#f97316')
    c_block = c_block.replace('#0ea5e9', '#ea580c') # secondary color in gradient
    c_block = c_block.replace('cyan-500', 'orange-500')
    c_block = c_block.replace('cyan-400', 'orange-400')
    c_block = c_block.replace('rgba(51,232,255', 'rgba(249,115,22')
    
    # The text should be "MAXIREST ONE - CRECIMIENTO" or something similar instead of "MAXIREST ONE - NUEVA GENERACIÓN"
    c_block = c_block.replace('MAXIREST ONE - NUEVA GENERACIÓN', 'MAXIREST ONE - CRECIMIENTO')
    
    # In C modal, it might say "La revolución digital gastronómica." -> I can leave it, or change it? The user said "la instancia de CRECIMIENTO"
    
    content = content[:modal_c_start] + c_block + content[footer_start:]

with open('apps/erp/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done modifying Modal B and Modal C.")
