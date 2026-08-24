import re

file_path = "apps/erp/app/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add states
state_injection = """  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [mrTechPassword, setMrTechPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showAuditoriaMRTech, setShowAuditoriaMRTech] = useState(false);
  const [mrTechTab, setMrTechTab] = useState('intro');
  const [mrTechObsOpen, setMrTechObsOpen] = useState<Record<string, boolean>>({});
"""
content = content.replace(
    "  const [tipsObsOpen, setTipsObsOpen] = useState<Record<string, boolean>>({});",
    "  const [tipsObsOpen, setTipsObsOpen] = useState<Record<string, boolean>>({});\n" + state_injection
)

# 2. Update isModalOpen
content = content.replace(
    "showAuditoria || mostrarPropuesta || showTipsAuditoria;",
    "showAuditoria || mostrarPropuesta || showTipsAuditoria || showAuditoriaMRTech || showPasswordModal;"
)

# 3. Add button below "Ejecuta tu propia AUDITORIA"
button_mrtech = """
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 mt-4 rounded-full font-black tracking-widest uppercase text-sm text-[#020617] bg-[#33E8FF] hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(51,232,255,0.4)] hover:shadow-[0_0_35px_rgba(51,232,255,0.8)]"
                >
                  AUDITORIA MR Tech
                </button>
"""
content = content.replace(
    "Ejecuta tu propia AUDITORIA\n                </button>",
    "Ejecuta tu propia AUDITORIA\n                </button>\n" + button_mrtech
)

# 4. Extract TIPS DE AUDITORIA and Duplicate it
parts = content.split("{/* ── Modal TIPS DE AUDITORIA ── */}")
before_modal = parts[0]
tips_modal_content = parts[1].split("    </main>")[0]

mrtech_modal = tips_modal_content.replace(
    "showTipsAuditoria", "showAuditoriaMRTech"
).replace(
    "setShowTipsAuditoria", "setShowAuditoriaMRTech"
).replace(
    "tipsTab", "mrTechTab"
).replace(
    "setTipsTab", "setMrTechTab"
).replace(
    "tipsObsOpen", "mrTechObsOpen"
).replace(
    "setTipsObsOpen", "setMrTechObsOpen"
).replace(
    'TIPS DE<br/><span className="text-[#33E8FF]">AUDITORÍA</span>',
    'AUDITORÍA<br/><span className="text-[#33E8FF]">MR TECH</span>'
)

# Add password Modal
password_modal = """
      {/* ── Modal CONTRASEÑA MR TECH ── */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-[#020617]/95 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-slate-900/60 border border-[#33E8FF]/30 p-8 rounded-3xl shadow-[0_0_40px_rgba(51,232,255,0.15)] flex flex-col items-center gap-6 text-center"
            >
              <button
                onClick={() => { setShowPasswordModal(false); setPasswordError(false); setMrTechPassword(''); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              
              <div className="w-16 h-16 rounded-full bg-[#33E8FF]/10 flex items-center justify-center border border-[#33E8FF]/30 shadow-[0_0_15px_rgba(51,232,255,0.3)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="#33E8FF" strokeWidth="2" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-black text-white tracking-widest uppercase">Acceso Restringido</h3>
                <p className="text-slate-400 text-sm">Ingrese la contraseña para acceder a la Auditoría MR Tech</p>
              </div>

              <div className="w-full flex flex-col gap-3">
                <input
                  type="password"
                  value={mrTechPassword}
                  onChange={(e) => { setMrTechPassword(e.target.value); setPasswordError(false); }}
                  placeholder="Contraseña..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (mrTechPassword === 'mrtech26&') {
                        setShowPasswordModal(false);
                        setShowAuditoriaMRTech(true);
                        setMrTechPassword('');
                        setPasswordError(false);
                      } else {
                        setPasswordError(true);
                      }
                    }
                  }}
                  className={`w-full bg-black/40 border ${passwordError ? 'border-red-500' : 'border-[#33E8FF]/50'} text-white p-4 rounded-xl font-medium text-center focus:outline-none focus:border-[#33E8FF] focus:ring-1 focus:ring-[#33E8FF] transition-all`}
                />
                <AnimatePresence>
                  {passwordError && (
                    <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-500 text-xs font-bold uppercase tracking-wider">Contraseña incorrecta</motion.span>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => {
                    if (mrTechPassword === 'mrtech26&') {
                      setShowPasswordModal(false);
                      setShowAuditoriaMRTech(true);
                      setMrTechPassword('');
                      setPasswordError(false);
                    } else {
                      setPasswordError(true);
                    }
                  }}
                  className="w-full mt-2 bg-[#33E8FF] hover:bg-white text-slate-900 font-black tracking-widest uppercase py-4 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(51,232,255,0.4)]"
                >
                  Ingresar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
"""

new_content = before_modal + "{/* ── Modal TIPS DE AUDITORIA ── */}" + tips_modal_content + "{/* ── Modal AUDITORIA MR TECH ── */}\n" + mrtech_modal + password_modal + "    </main>\n" + parts[1].split("    </main>")[1]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Done")
