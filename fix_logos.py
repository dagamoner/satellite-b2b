import re

file_path = 'apps/erp/app/page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define the start and end markers for the cards block
start_marker = '              {/* Cards \u2014 3 columnas */}'
end_marker = '              </div>\n\n              {/* Separador + CTA WhatsApp */}'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("ERROR: Could not find markers")
    print("start_idx:", start_idx)
    print("end_idx:", end_idx)
else:
    # The replacement block
    new_cards = '''              {/* Cards \u2014 3 columnas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">

                {/* Card 1: Auditor\u00eda de Calidad - IZQUIERDA */}
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="relative group rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl border border-[#a855f7]/25 rounded-2xl transition-all duration-500 group-hover:border-[#a855f7]/55" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#a855f7] to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="absolute -inset-1 bg-[#a855f7]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  <div className="relative z-10 flex flex-col">
                    <div className="w-full flex items-center justify-center bg-black/40 rounded-t-2xl overflow-hidden" style={{ minHeight: '130px' }}>
                      <img
                        src="/Logo Auditoria Operativa.png"
                        alt="Auditor\u00eda de Calidad"
                        className="w-full h-auto object-contain transition-all duration-500 group-hover:scale-105"
                        style={{ mixBlendMode: \'screen\', filter: \'brightness(1.1) contrast(1.05)\' }}
                      />
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                      <h3 className="text-lg font-black text-white tracking-wide drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                        Auditor\u00eda de Calidad
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed" style={{ textAlign: \'justify\' }}>
                        Evaluamos minuciosamente cada eslab\u00f3n de la cadena operativa: desde el ingreso de materia prima hasta la entrega en mesa. Detectamos mermas, desv\u00edos en recetas y fallas operativas cr\u00edticas.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {[\'Cadena Operativa\', \'Mermas\', \'Recetas\'].map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase text-[#a855f7] border border-[#a855f7]/30 bg-[#a855f7]/8">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Card 2: Integraci\u00f3n Tecnol\u00f3gica - CENTRO */}
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative group rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl border border-[#33E8FF]/25 rounded-2xl transition-all duration-500 group-hover:border-[#33E8FF]/55" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#33E8FF] to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#33E8FF]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="absolute -inset-1 bg-[#33E8FF]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  <div className="relative z-10 flex flex-col">
                    <div className="w-full flex items-center justify-center bg-black/40 rounded-t-2xl overflow-hidden" style={{ minHeight: \'130px\' }}>
                      <img
                        src="/Logo Integracion Tecnologica.png"
                        alt="Integraci\u00f3n Tecnol\u00f3gica"
                        className="w-full h-auto object-contain transition-all duration-500 group-hover:scale-105"
                        style={{ mixBlendMode: \'screen\', filter: \'brightness(1.1) contrast(1.05)\' }}
                      />
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                      <h3 className="text-lg font-black text-white tracking-wide drop-shadow-[0_0_8px_rgba(51,232,255,0.4)]">
                        Integraci\u00f3n Tecnol\u00f3gica
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed" style={{ textAlign: \'justify\' }}>
                        Dise\u00f1amos e implementamos el ecosistema digital ideal para su marca (POS, KDS, ERP). Integramos datos operativos para una toma de decisiones informada, r\u00e1pida y automatizada.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {[\'POS\', \'KDS\', \'ERP\', \'Automatizaci\u00f3n\'].map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase text-[#33E8FF] border border-[#33E8FF]/30 bg-[#33E8FF]/8">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Card 3: Consultor\u00eda Estrat\u00e9gica - DERECHA */}
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative group rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl border border-[#f97316]/25 rounded-2xl transition-all duration-500 group-hover:border-[#f97316]/55" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f97316] to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f97316]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="absolute -inset-1 bg-[#f97316]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  <div className="relative z-10 flex flex-col">
                    <div className="w-full flex items-center justify-center bg-black/40 rounded-t-2xl overflow-hidden" style={{ minHeight: \'130px\' }}>
                      <img
                        src="/Logo Consultoria Estrategica.png"
                        alt="Consultor\u00eda Estrat\u00e9gica"
                        className="w-full h-auto object-contain transition-all duration-500 group-hover:scale-105"
                        style={{ mixBlendMode: \'screen\', filter: \'brightness(1.1) contrast(1.05)\' }}
                      />
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                      <h3 className="text-lg font-black text-white tracking-wide drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">
                        Consultor\u00eda Estrat\u00e9gica
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed" style={{ textAlign: \'justify\' }}>
                        Ingenier\u00eda de men\u00fas, fijaci\u00f3n de precios, reestructuraci\u00f3n financiera y dise\u00f1o de planes de expansi\u00f3n. Acompa\u00f1amos a los gerentes y due\u00f1os a lograr rentabilidad sustentable.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {[\'Ingenier\u00eda de Men\u00fas\', \'Precios\', \'Expansi\u00f3n\', \'Rentabilidad\'].map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase text-[#f97316] border border-[#f97316]/30 bg-[#f97316]/8">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

              </div>
'''
    content = content[:start_idx] + new_cards + content[end_idx + len('              </div>') :]

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Done replacing cards block!")
    print("New content length:", len(content))
