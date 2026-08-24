import re

file_path = "apps/erp/app/page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add states
state_injection = """  const [showTipsAuditoria, setShowTipsAuditoria] = useState(false);
  const [tipsTab, setTipsTab] = useState('intro');
  const [tipsObsOpen, setTipsObsOpen] = useState<Record<string, boolean>>({});
"""
content = content.replace(
    '  const [mostrarInstanciaC, setMostrarInstanciaC] = useState(false);',
    '  const [mostrarInstanciaC, setMostrarInstanciaC] = useState(false);\n' + state_injection
)

# 2. Update isModalOpen
content = content.replace(
    'const isModalOpen = mostrarInstanciaA || mostrarInstanciaB || mostrarInstanciaC || showAuditoria || mostrarPropuesta;',
    'const isModalOpen = mostrarInstanciaA || mostrarInstanciaB || mostrarInstanciaC || showAuditoria || mostrarPropuesta || showTipsAuditoria;'
)

# 3. Add button before footer in Auditoria Operativa
button_html = """
              {/* Botón Ejecuta tu propia auditoria */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowTipsAuditoria(true)}
                  className="group relative px-6 py-3 rounded-2xl bg-[#020617] border border-[#33E8FF]/30 hover:border-[#33E8FF] transition-all duration-300 shadow-[0_0_15px_rgba(51,232,255,0.15)] hover:shadow-[0_0_25px_rgba(51,232,255,0.4)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#33E8FF]/0 via-[#33E8FF]/10 to-[#33E8FF]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <span className="relative z-10 font-black tracking-widest text-[#33E8FF] uppercase text-sm md:text-base">Ejecuta tu propia AUDITORIA</span>
                </button>
              </div>
"""
content = content.replace(
    '              {/* Footer tag */}',
    button_html + '\n              {/* Footer tag */}'
)

# 4. Add the massive TIPS DE AUDITORIA modal before </main>
tips_modal = """
      {/* ── Modal TIPS DE AUDITORIA ── */}
      <AnimatePresence>
        {showTipsAuditoria && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex flex-col bg-[#020617]/98 backdrop-blur-2xl overflow-y-auto"
          >
            <div className="pointer-events-none fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#33E8FF]/5 blur-[120px] rounded-full" />
            
            {/* Botón Regresar */}
            <button
              onClick={() => { setShowTipsAuditoria(false); setTipsTab('intro'); setTipsObsOpen({}); }}
              className="fixed top-6 right-6 md:top-10 md:right-10 flex items-center gap-3 group z-[260] cursor-pointer"
            >
              <span className="text-white group-hover:text-[#33E8FF] font-black text-sm md:text-base tracking-[0.2em] drop-shadow-md transition-colors duration-300">REGRESAR</span>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full relative flex items-center justify-center border border-white/20 group-hover:border-[#33E8FF] overflow-hidden transition-colors duration-300 shadow-[0_0_15px_rgba(51,232,255,0.2)] group-hover:shadow-[0_0_20px_rgba(51,232,255,0.6)]">
                <div className="absolute inset-0 bg-[#33E8FF] opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
                <img src="/ecosistema.jpg" alt="Regresar" className="w-full h-full object-cover relative z-10" style={{ mixBlendMode: 'screen' }} />
              </div>
            </button>

            <div className="w-full max-w-6xl mx-auto px-4 md:px-8 pt-20 pb-16 flex flex-col md:flex-row gap-8">
              
              {/* Sidebar Tabs */}
              <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2">
                <h2 className="text-2xl font-black text-white tracking-widest mb-6 border-b border-white/10 pb-4">
                  TIPS DE<br/><span className="text-[#33E8FF]">AUDITORÍA</span>
                </h2>
                
                {[
                  { id: 'intro', label: 'Introducción' },
                  { id: 'ventas', label: 'Ventas' },
                  { id: 'pedidos', label: 'Pedidos / Compras' },
                  { id: 'stock', label: 'Stock' },
                  { id: 'caja', label: 'Caja' },
                  { id: 'limpieza', label: 'Limpieza' },
                  { id: 'encargado', label: 'Encargado' },
                  { id: 'rrhh', label: 'RRHH' },
                  { id: 'varios', label: 'Varios' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setTipsTab(tab.id)}
                    className={`text-left px-5 py-3 rounded-xl font-black text-xs tracking-widest uppercase transition-all duration-300 border ${
                      tipsTab === tab.id
                        ? 'bg-[#33E8FF]/15 border-[#33E8FF]/60 text-[#33E8FF] shadow-[0_0_15px_rgba(51,232,255,0.2)]'
                        : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Main Content Area */}
              <div className="flex-1 bg-slate-900/40 border border-white/5 rounded-2xl p-6 md:p-10 min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tipsTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Contenido Dinámico por Tab */}
                    {tipsTab === 'intro' && (
                      <>
                        <h3 className="text-2xl font-black text-white tracking-wide mb-4">INTRODUCCIÓN</h3>
                        <div className="flex flex-col gap-4 text-slate-300 text-sm md:text-base leading-relaxed">
                          <p><strong className="text-[#33E8FF]">Tiempo aprox:</strong> 3 o 4 horas de acuerdo a turnos y horarios determinados para la misma.</p>
                          <p><strong className="text-[#33E8FF]">Personal implicado:</strong> Jefe cocina, cocinero referente, encargado, cajero, jefe de mozos o mozo referente.</p>
                          <p><strong className="text-[#33E8FF]">Horarios:</strong> inicio de turno fuerte hasta primeras ventas.</p>
                        </div>
                      </>
                    )}

                    {tipsTab !== 'intro' && (
                      <>
                        <h3 className="text-2xl font-black text-white tracking-wide mb-4 uppercase">{tipsTab.replace('-', ' ')}</h3>
                        <div className="flex flex-col gap-3">
                          {/* Lista de Checkboxes generada */}
                          {tipsTab === 'ventas' && ['Recepción de cliente.', 'Tiempo de atención y armado de mesas.', 'Inicio de venta, presentación', 'Conocimiento de carta.', 'Sugerencias del día.', 'Atención a la mesa y re-venta. (Continuo)', 'Cierre de venta, encuesta, QR Reseña, etc.'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}
                          
                          {tipsTab === 'pedidos' && ['Circuito de pedidos.', 'Recepción de mercadería.', 'Cuentas corrientes y pagos.', 'Producción y almacenamiento correcto.', 'Rotación y rotulado de mercadería.', 'Sugerencias del chef para rotar mercadería.'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {tipsTab === 'stock' && ['Recetas y subrecetas.', 'Procesos de producción y elaboración de platos.', 'Inventarios.', 'Mermas', 'Movimiento de stock/Remitos. (Desperdicios, platos devueltos, perdidas)', 'Menú personal/consumos internos.'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {tipsTab === 'caja' && ['Cierres X.', 'Gastos/Ingresos.', 'Pago personal eventual/completo.', 'Procedimientos de apertura y cierre de caja.'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {tipsTab === 'limpieza' && ['Orden y limpieza cocina', 'Orden y limpieza barra/heladeras', 'Limpieza y orden de salón', 'Limpieza baños.', 'Planillas para bromatología (Limpieza y temperaturas de heladera)'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {tipsTab === 'encargado' && ['Preparación de salón.', 'Distribución de plazas.', 'Comunicación cocina/salón', 'Briefing', 'Función operativa.', 'Distribución y control de tareas.', 'Armado y comunicación de reservas'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {tipsTab === 'rrhh' && ['Entrevistas', 'Capacitación', 'Sueldos e Incentivos', 'Manuales de Procedimientos', 'Incentivos', 'Uniformes', 'Organigrama', 'Evaluaciones'].map((item, i) => (
                            <label key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10 group">
                              <input type="checkbox" className="w-5 h-5 accent-[#33E8FF] rounded bg-slate-800 border-white/20 cursor-pointer" />
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm">{item}</span>
                            </label>
                          ))}

                          {tipsTab === 'varios' && (
                            <div className="flex flex-col items-center justify-center py-10 gap-6">
                              <p className="text-slate-400 text-center max-w-lg leading-relaxed">
                                Ha llegado al final de la auditoría. Asegúrese de haber completado y registrado observaciones en cada una de las secciones anteriores.
                              </p>
                              <button className="px-8 py-4 bg-[#33E8FF] text-slate-900 font-black rounded-xl uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(51,232,255,0.4)] hover:shadow-[0_0_35px_rgba(51,232,255,0.8)] hover:scale-105 hover:bg-white transition-all duration-300">
                                Generar Reporte Virtual
                              </button>
                            </div>
                          )}

                          {tipsTab !== 'varios' && (
                            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-4">
                              <label className="inline-flex items-center gap-3 cursor-pointer select-none self-start bg-[#33E8FF]/10 border border-[#33E8FF]/30 rounded-full px-5 py-2.5 hover:bg-[#33E8FF]/20 transition-all">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 accent-[#33E8FF] cursor-pointer" 
                                  checked={tipsObsOpen[tipsTab] || false}
                                  onChange={(e) => setTipsObsOpen({ ...tipsObsOpen, [tipsTab]: e.target.checked })}
                                />
                                <span className="text-[#33E8FF] font-black text-[11px] uppercase tracking-widest">Agregar Observaciones</span>
                              </label>

                              <AnimatePresence>
                                {tipsObsOpen[tipsTab] && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <textarea 
                                      maxLength={100} 
                                      placeholder="Escriba las observaciones aquí (máx 100 caracteres)..." 
                                      className="w-full h-24 bg-black/40 border border-[#33E8FF]/50 text-white p-4 rounded-xl font-medium text-sm focus:outline-none focus:border-[#33E8FF] focus:ring-1 focus:ring-[#33E8FF] transition-all resize-none"
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
"""
content = content.replace('    </main>', tips_modal + '\n    </main>')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully injected TIPS DE AUDITORIA modal and states.")
