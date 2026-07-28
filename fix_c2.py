import os

file_path = 'apps/erp/app/page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the button for C
# We need to find the specific block for the C button
btn_start_str = '{/* Botón Ir Instancia C */}'
btn_end_str = '</button>'

# find the exact button block
start_idx_btn = content.find(btn_start_str)
# find the next </button> after start_idx_btn
end_idx_btn = content.find(btn_end_str, start_idx_btn) + len(btn_end_str)

new_btn_str = """{/* Botón Ir Instancia C */}
                    <button 
                      onClick={() => setMostrarInstanciaC(true)}
                      className="absolute z-[50] group flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer outline-none"
                      style={{ top: '65%', right: '-18%', width: '18%' }}
                      title="Ver Instancia C"
                    >
                      <div className="absolute inset-0 bg-[#f97316] opacity-0 group-hover:opacity-80 blur-2xl transition-all duration-300 pointer-events-none scale-90" />
                      <img 
                        src="/ir instancia C.png" 
                        alt="Ir a Instancia C"
                        className="w-full h-auto object-contain relative z-10 transition-all duration-300 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)] group-hover:drop-shadow-[0_0_30px_rgba(249,115,22,1)]"
                        style={{ mixBlendMode: 'screen', filter: 'brightness(1.2) contrast(1.2)' }}
                      />
                    </button>"""

if start_idx_btn != -1:
    content = content[:start_idx_btn] + new_btn_str + content[end_idx_btn:]

# 2. Replace the Modal C block
modal_c_start = content.find('{/* Modal / Lightbox para Instancia C */}')
footer_start = content.find('{/* Footer mínimo */}')

new_modal_c_str = """      {/* Modal / Lightbox para Instancia C */}
      <AnimatePresence>
        {mostrarInstanciaC && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-transparent p-4 md:p-6"
            onClick={() => {
              if (mostrarPreciosC) {
                setMostrarPreciosC(false);
              } else {
                setMostrarInstanciaC(false);
              }
            }}
          >
            {/* Botón Regresar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (mostrarPreciosC) {
                  setMostrarPreciosC(false);
                } else {
                  setMostrarInstanciaC(false);
                }
              }}
              className="fixed top-6 right-6 md:top-10 md:right-10 flex items-center gap-3 group z-[120] cursor-pointer"
            >
              <span className="text-white group-hover:text-[#f97316] font-black text-sm md:text-base tracking-[0.2em] drop-shadow-md transition-colors duration-300">REGRESAR</span>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full relative flex items-center justify-center border border-white/20 group-hover:border-[#f97316] overflow-hidden transition-colors duration-300 shadow-[0_0_15px_rgba(249,115,22,0.2)] group-hover:shadow-[0_0_20px_rgba(249,115,22,0.6)]">
                <div className="absolute inset-0 bg-[#f97316] opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
                <img src="/ecosistema.jpg" alt="Regresar" className="w-full h-full object-cover relative z-10" style={{ mixBlendMode: 'screen' }} />
              </div>
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl w-full flex flex-col items-center z-10 mt-2 h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">

                {/* ── Estado inicial: imagen hero + título ── */}
                {!mostrarPreciosC && (
                  <motion.div
                    key="selector-c"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col w-full max-w-5xl mx-auto pb-16 pt-12 md:pt-24 px-4"
                  >

                    {/* ── HERO Instancia C ── */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 w-full"
                    >
                      {/* Imagen con glow y levitación */}
                      <div className="relative flex items-center justify-center shrink-0">
                        <div className="absolute inset-0 rounded-full bg-[#f97316] blur-[55px] opacity-25 animate-pulse pointer-events-none scale-110" />
                        <motion.img
                          src="/ir instancia C.png"
                          alt="Instancia C - Maxirest"
                          className="relative z-10 w-32 md:w-44 h-auto object-contain drop-shadow-[0_0_35px_rgba(249,115,22,0.7)]"
                          style={{ mixBlendMode: "screen", filter: "brightness(1.15) contrast(1.1)" }}
                          animate={{ y: [0, -9, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>

                      {/* Textos futuristas */}
                      <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
                        {/* Badge */}
                        <div className="flex items-center gap-2">
                          <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#f97316] opacity-80" />
                          <span className="text-[9px] font-black tracking-[0.4em] uppercase text-[#f97316] drop-shadow-[0_0_8px_rgba(249,115,22,0.9)]">
                            MAXIREST ONE - CRECIMIENTO
                          </span>
                          <span className="h-px w-6 bg-gradient-to-l from-transparent to-[#f97316] opacity-80" />
                        </div>

                        {/* Título */}
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                          <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]">INSTANCIA </span>
                          <span
                            className="text-transparent bg-clip-text"
                            style={{ backgroundImage: "linear-gradient(135deg, #f97316 0%, #ea580c 40%, #f97316 100%)" }}
                          >
                            C
                          </span>
                        </h2>

                        <p className="text-[#f97316] font-bold text-lg md:text-xl tracking-wide drop-shadow-[0_0_5px_rgba(249,115,22,0.6)]">
                          La revolución digital gastronómica.
                        </p>

                        {/* Separador decorativo */}
                        <div className="flex items-center gap-3 mt-1 w-full">
                          <div className="flex-1 h-px bg-gradient-to-r from-[#f97316]/40 to-transparent" />
                          <motion.svg
                            viewBox="0 0 24 24" fill="#f97316"
                            className="w-2.5 h-2.5 opacity-70 drop-shadow-[0_0_5px_rgba(249,115,22,1)]"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                          >
                            <path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" />
                          </motion.svg>
                          <div className="flex-1 h-px bg-gradient-to-l from-[#f97316]/40 to-transparent" />
                        </div>
                      </div>
                    </motion.div>

                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
"""

if modal_c_start != -1 and footer_start != -1:
    content = content[:modal_c_start] + new_modal_c_str + "\n" + content[footer_start:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done refactoring Modal C and C button!")
