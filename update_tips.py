import re

file_path = "apps/erp/app/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update logo size in the Password Modal
content = content.replace("w-24 h-24 flex items-center", "w-40 h-40 flex items-center")

# 2. Update intro in TIPS DE AUDITORIA
new_intro = """                        <div className="flex flex-col gap-6 text-sm md:text-base leading-relaxed text-slate-300">
                          <p>Realiza tu propio check list de Tips claves de AUDITORIA.</p>
                          <p>Al finalizar podrás tener un reporte virtual de la situación de tu local.</p>
                          <p className="text-yellow-400">Dicho check list es solo demostrativo, desarrollando desde AUDITORIA MR Tech con personal profesional e idóneo el completo.</p>
                        </div>"""

old_intro_regex = re.compile(r"\{tipsTab === 'intro' && \(\s*<div className=\"flex flex-col gap-6 text-sm md:text-base leading-relaxed text-slate-300\">\s*<p>.*?</div>\s*\)}", re.DOTALL)

content = old_intro_regex.sub("{tipsTab === 'intro' && (\n" + new_intro + "\n)}", content)


# 3. Truncate arrays in TIPS DE AUDITORIA
# We only want to truncate the arrays for TIPS DE AUDITORIA (tipsTab), not mrTechTab.
# Let's find all the arrays in tipsTab.
tabs = ['ventas', 'pedidos', 'stock', 'caja', 'limpieza', 'encargado', 'rrhh', 'varios']

for tab in tabs:
    # Match the array literal
    regex = re.compile(r"(\{tipsTab === '" + tab + r"' && )(\[.*?\])(\.map\()")
    
    def repl(m):
        prefix = m.group(1)
        array_str = m.group(2)
        suffix = m.group(3)
        
        # safely evaluate the array string (since it contains strings)
        # we can just use python's ast.literal_eval if it's well formed
        import ast
        try:
            arr = ast.literal_eval(array_str)
            # truncate to 2 items
            arr = arr[:2]
            # format back
            new_arr_str = "[" + ", ".join(f"'{x}'" for x in arr) + "]"
            return prefix + new_arr_str + suffix
        except:
            return m.group(0)
            
    content = regex.sub(repl, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updates applied.")
