import re

file_path = "apps/erp/app/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Replace lock icon with image
old_icon = """              <div className="w-16 h-16 rounded-full bg-[#33E8FF]/10 flex items-center justify-center border border-[#33E8FF]/30 shadow-[0_0_15px_rgba(51,232,255,0.3)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="#33E8FF" strokeWidth="2" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>"""

new_icon = """              <div className="w-24 h-24 flex items-center justify-center mb-2 drop-shadow-[0_0_15px_rgba(51,232,255,0.5)]">
                <img src="/logo-ciberseguridad.jpg" alt="Ciberseguridad" className="w-full h-full object-contain" style={{ mixBlendMode: 'screen' }} />
              </div>"""

content = content.replace(old_icon, new_icon)

# 2. Modify buttons and remove whatsapp link
# Currently lines 941 to 965:
# <button 1>
# <button 2>
# <a whatsapp>

# We want to replace the buttons with a flex container and remove the <a> tag.
# We also want to remove the separator since we remove the whatsapp button. Wait, the separator might look good on its own? Actually no, "Eliminar hablemos por WSP", we should just leave the buttons.
# The separator is at 929-940. Let's look at the structure.
# <div className="mt-12 flex flex-col items-center gap-6">
#   <div className="flex items-center gap-4 w-full max-w-md"> ... separator ... </div>
#   <button 1 />
#   <button 2 />
#   <a whatsapp />
# </div>

# Let's just regex out the a-tag block.
a_tag_regex = re.compile(r'^\s*<a\s*href="https://www\.mrtechnology\.it\.com/#whatsapp-contact".*?</svg>\s*Hablemos por WhatsApp\s*</a>', re.MULTILINE | re.DOTALL)
content = a_tag_regex.sub('', content)

# Modify the two buttons to be wrapped in flex-col w-max items-stretch
btn1_old = """                <button
                  onClick={() => { setMostrarPropuesta(false); setShowTipsAuditoria(true); }}
                  className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full font-black tracking-widest uppercase text-sm text-[#33E8FF] bg-[#020617] border border-[#33E8FF]/30 hover:border-[#33E8FF] hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-[0_0_15px_rgba(51,232,255,0.15)] hover:shadow-[0_0_35px_rgba(51,232,255,0.6)]"
                >
                  Ejecuta tu propia AUDITORIA
                </button>"""

btn2_old = """                <button
                  onClick={() => { setMostrarPropuesta(false); setShowPasswordModal(true); }}
                  className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 mt-4 rounded-full font-black tracking-widest uppercase text-sm text-[#020617] bg-[#33E8FF] hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(51,232,255,0.4)] hover:shadow-[0_0_35px_rgba(51,232,255,0.8)]"
                >
                  AUDITORIA MR Tech
                </button>"""

# We remove mt-4 from btn2 since we'll use a gap container.
# We wrap them.
btn1_new = """                  <button
                    onClick={() => { setMostrarPropuesta(false); setShowTipsAuditoria(true); }}
                    className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full font-black tracking-widest uppercase text-sm text-[#33E8FF] bg-[#020617] border border-[#33E8FF]/30 hover:border-[#33E8FF] hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-[0_0_15px_rgba(51,232,255,0.15)] hover:shadow-[0_0_35px_rgba(51,232,255,0.6)]"
                  >
                    Ejecuta tu propia AUDITORIA
                  </button>"""

btn2_new = """                  <button
                    onClick={() => { setMostrarPropuesta(false); setShowPasswordModal(true); }}
                    className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full font-black tracking-widest uppercase text-sm text-[#020617] bg-[#33E8FF] hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(51,232,255,0.4)] hover:shadow-[0_0_35px_rgba(51,232,255,0.8)]"
                  >
                    AUDITORIA MR Tech
                  </button>"""

container = f"""                <div className="flex flex-col items-stretch gap-4 w-max mx-auto mt-6">
{btn1_new}
{btn2_new}
                </div>"""

content = content.replace(btn1_old + "\n\n" + btn2_old, container)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Formatting applied successfully.")
