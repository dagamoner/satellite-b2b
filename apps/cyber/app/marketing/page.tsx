"use client";
import { Button } from "@repo/ui/button";
import Link from "next/link";

export default function MarketingLanding() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <img src="/logo.jpg" alt="MR Technology" className="w-10 h-10 rounded-full border border-slate-800" />
             <span className="font-bold text-xl tracking-wider text-slate-100">MR Technology</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#antenas" className="hover:text-blue-400 transition-colors">Equipos Starlink</a>
            <a href="#planes" className="hover:text-blue-400 transition-colors">Planes & Abonos</a>
            <a href="#consultoria" className="hover:text-blue-400 transition-colors">Servicios IT Específicos</a>
          </div>
          <Link href="/">
             <Button variant="outline" className="text-white border-slate-700 hover:bg-slate-800 shadow-md">Portal de Acceso B2B</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 md:pt-56 md:pb-32 px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
        
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-5xl leading-tight">
          Internet Rápido y Estable<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">donde sea que su empresa opere.</span>
        </h1>
        <p className="relative z-10 text-xl text-slate-400 max-w-3xl mb-10 leading-relaxed">
          Alta velocidad estable. Hardware revolucionario desde $299.000 con abonos desde $38.000. Respaldado por el mejor servicio técnico presencial en Mendoza.
        </p>
        <div className="relative z-10 flex flex-col sm:flex-row gap-4">
           <Button size="lg" className="px-10 py-7 text-lg rounded-full bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/20 font-bold">Comenzar Implementación</Button>
           <Button size="lg" variant="outline" className="px-10 py-7 text-lg rounded-full text-slate-200 border-slate-700 hover:bg-slate-900 border-2 font-bold">Ver Mapa de Disponibilidad</Button>
        </div>

        {/* Features banner */}
        <div className="relative z-10 mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-y border-slate-800/50 py-10 w-full max-w-6xl">
           <div><h4 className="text-3xl font-bold text-white mb-2">+99.9%</h4><p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Tiempo de Actividad</p></div>
           <div><h4 className="text-3xl font-bold text-white mb-2">Plug & Play</h4><p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Instalación Sencilla</p></div>
           <div><h4 className="text-3xl font-bold text-white mb-2">Clima Extremo</h4><p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Resiste Incidencias</p></div>
           <div><h4 className="text-3xl font-bold text-white mb-2">Ilimitados</h4><p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Datos Alta Velocidad</p></div>
        </div>
      </section>

      {/* Hardware Section */}
      <section id="antenas" className="py-24 bg-[#0a0f1c] border-t border-slate-800 px-6">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center text-white">Ingeniería en Hardware Satelital</h2>
            <div className="grid md:grid-cols-2 gap-12">
               {/* Mini X */}
               <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-10 hover:border-blue-500/40 transition-colors shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-3xl font-bold text-blue-400">Starlink Mini X</h3>
                     <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full font-bold tracking-widest uppercase">Hogar & Viajes</span>
                  </div>
                  <p className="text-slate-400 mb-8 leading-relaxed text-lg">Dicha antena se implementa tanto para el hogar como en formato itinerante. Compacta, cuenta con un router incorporado, menor consumo de energía, entrada DC y velocidades de descarga superiores a 200 MB/s.</p>
                  <ul className="space-y-4 mb-8 text-slate-300 font-medium">
                     <li className="flex gap-3 items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">✓</div>
                        <span>Ideal para usuarios hogareños y vehículos</span>
                     </li>
                     <li className="flex gap-3 items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">✓</div>
                        <span>Streaming HD y Videollamadas fluidas</span>
                     </li>
                  </ul>
               </div>

               {/* Estándar V4 */}
               <div className="bg-slate-900 border border-cyan-500/20 rounded-[2rem] p-10 hover:border-cyan-500/40 transition-colors shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl" />
                  <div className="flex justify-between items-center mb-6 relative z-10">
                     <h3 className="text-3xl font-bold text-cyan-400">Estándar V4</h3>
                     <span className="bg-cyan-500/20 text-cyan-400 text-xs px-3 py-1 rounded-full font-bold tracking-widest uppercase">Pymes & B2B</span>
                  </div>
                  <p className="text-slate-400 mb-8 leading-relaxed text-lg relative z-10">Dimensiones mayores para conectividad de alcance masivo. Adaptable a residenciales de alta gama, locales comerciales y su principal enfoque: <span className="text-cyan-300 font-semibold">Bodegas y Redes Corporativas.</span></p>
                  <ul className="space-y-4 mb-8 text-slate-300 font-medium relative z-10">
                     <li className="flex gap-3 items-center">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm">✓</div>
                        <span>Prioridad de red extrema (hasta 300 mbps)</span>
                     </li>
                     <li className="flex gap-3 items-center">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm">✓</div>
                        <span>Alta resiliencia frente a clima adverso</span>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* Pricing / Planes Section */}
      <section id="planes" className="py-24 px-6 max-w-7xl mx-auto">
         <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Planes MR Technology</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Internet diseñado para cada necesidad. Con el mejor soporte remoto y presencial exclusivo desde Mendoza.</p>
         </div>

         <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {/* Plan 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col hover:border-slate-600 transition-colors">
               <h4 className="text-xl font-bold text-slate-300 mb-2">Básico Mini X</h4>
               <p className="text-4xl font-extrabold text-white mb-6">$38.000<span className="text-lg font-normal text-slate-500">/mes</span></p>
               <ul className="text-sm text-slate-400 space-y-4 mb-8 flex-grow">
                  <li className="border-b border-slate-800 pb-2">Destinado a <strong>Residencial Lite</strong></li>
                  <li className="border-b border-slate-800 pb-2">Abono Mensual.</li>
                  <li className="border-b border-slate-800 pb-2">Soporte Remoto Ilimitado.</li>
               </ul>
               <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-6">Adquirir Hardware</Button>
            </div>

            {/* Plan 2 */}
            <div className="bg-slate-900 border-2 border-blue-500 rounded-2xl p-8 flex flex-col shadow-lg shadow-blue-500/10 relative transform md:-translate-y-4">
               <div className="absolute top-0 right-0 bg-blue-600 px-4 py-1 text-xs font-bold rounded-bl-lg tracking-wider">MÁS SOLICITADO</div>
               <h4 className="text-xl font-bold text-blue-400 mb-2">Básico Estándar V4</h4>
               <p className="text-4xl font-extrabold text-white mb-6">$56.100<span className="text-lg font-normal text-slate-500">/mes</span></p>
               <ul className="text-sm text-slate-300 space-y-4 mb-8 flex-grow">
                  <li className="border-b border-slate-800 pb-2 text-white font-semibold">Residencial / PyMEs</li>
                  <li className="border-b border-slate-800 pb-2">Servicio Mensual Starlink.</li>
                  <li className="border-b border-slate-800 pb-2 text-blue-300"><strong>Soporte Remoto Ilimitado</strong> vía WhatsAPP desde Mendoza.</li>
                  <li className="border-b border-slate-800 pb-2 text-blue-300"><strong>Consultoría B2B y Asesoramiento MR</strong>. (Socio Estratégico en Redes).</li>
               </ul>
               <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6">Seleccionar Plan</Button>
            </div>

            {/* Plan 3 */}
            <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-8 flex flex-col">
               <h4 className="text-xl font-bold text-cyan-400 mb-2">Full Estándar V4</h4>
               <p className="text-4xl font-extrabold text-white mb-6">Consultar</p>
               <ul className="text-sm text-slate-400 space-y-4 mb-8 flex-grow">
                  <li className="border-b border-slate-800 pb-2 text-white">Ideal para Bodegas y Comercios.</li>
                  <li className="border-b border-slate-800 pb-2">Mismos beneficios Básico V4.</li>
                  <li className="border-b border-cyan-900/50 pb-2 text-cyan-300"><strong>1 VP Mensual Presencial</strong> con personal calificado (Diferencial Mendoza).</li>
               </ul>
               <Button variant="outline" className="w-full border-cyan-700 text-cyan-400 hover:bg-cyan-900/30 font-bold py-6">Cotizar Solución</Button>
            </div>

            {/* Plan 4 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col hover:border-slate-600 transition-colors">
               <h4 className="text-xl font-bold text-indigo-400 mb-2">Itinerante Ilimitado</h4>
               <p className="text-2xl font-extrabold text-white mb-6">Conexión Remota</p>
               <ul className="text-sm text-slate-400 space-y-4 mb-8 flex-grow">
                  <li className="border-b border-slate-800 pb-2">Vehículos en migración regional constante.</li>
                  <li className="border-b border-slate-800 pb-2">Datos 100% Ilimitados para zonas sin cobertura (fuera de ciudad).</li>
               </ul>
               <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-6">Saber Más</Button>
            </div>
         </div>

         {/* Grandes Proyectos */}
         <div className="mt-12 bg-gradient-to-r from-[#0a1128] to-[#040814] border border-blue-500/30 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-blue-900/10">
            <div>
               <h3 className="text-3xl font-bold text-white mb-4">Planes Empresariales</h3>
               <p className="text-slate-400 max-w-4xl leading-relaxed text-lg">Para proyectos a gran escala y corporaciones pesadas. Requerimos efectuar un relevamiento inicial exhaustivo para diseñar el mapa topológico que decanta exactamente en las directrices y cantidad de GB que demanda su exclusividad.</p>
            </div>
            <Button size="lg" className="whitespace-nowrap px-10 py-8 text-lg font-bold rounded-xl shadow-lg shadow-blue-500/30 bg-blue-600 hover:bg-blue-500">Solicitar Relevamiento IT</Button>
         </div>
      </section>

      {/* IT Consulting Services */}
      <section id="consultoria" className="py-24 bg-[#0a0f1c] border-t border-slate-900 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Consultoría y Actividades IT Hard & Soft</h2>
               <p className="text-slate-400 max-w-2xl mx-auto text-lg">Ofrecemos soporte integral y mantenimiento preventivo/activo de nivel gerencial. Su proveedor no es solo un distribuidor, es todo su equipo de Infraestructura y Redes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {/* Column 1 */}
               <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                  <div className="h-14 w-14 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
                     <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-4">Arquitectura & Relevamiento</h4>
                  <ul className="text-slate-400 text-sm space-y-3 font-medium">
                     <li>• Relevamiento inicial del parque informático.</li>
                     <li>• Análisis de Topología y Tipología de la RED interna.</li>
                     <li>• Plano Físico y Digital del Armado Estructural.</li>
                     <li>• Documentación objetiva de la red.</li>
                  </ul>
               </div>
               
               {/* Column 2 */}
               <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                  <div className="h-14 w-14 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20">
                     <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-4">Centro Operativo Avanzado</h4>
                  <ul className="text-slate-400 text-sm space-y-3 font-medium">
                     <li>• Soporte Técnico Especializado.</li>
                     <li>• Analista de Infraestructura de Red.</li>
                     <li>• Especialista en monitorización constante.</li>
                     <li>• Resolución y mitigación de incidentes de seguridad.</li>
                  </ul>
               </div>
               
               {/* Column 3 */}
               <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                  <div className="h-14 w-14 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
                     <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-4">Ingeniería & Soporte en Campo</h4>
                  <ul className="text-slate-400 text-sm space-y-3 font-medium">
                     <li>• Técnico de soporte y Field Network Engineer.</li>
                     <li>• Instalador de Fibra Óptica certificado.</li>
                     <li>• Técnico de cableado estructurado IT.</li>
                     <li>• Planes de contingencia ante fallas aleatorias.</li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050812] py-16 px-6 border-t border-slate-900 text-center text-slate-500">
         <img src="/logo.jpg" className="w-16 h-16 rounded-full mx-auto mb-6 opacity-60 hover:opacity-100 transition-opacity" alt="Footer Logo" />
         <p className="tracking-[0.2em] mb-4 text-white font-bold text-lg">M A I P Ú - M E N D O Z A</p>
         <p className="mb-8">Consulte disponibilidad y velocidades en su Zona.</p>
         <div className="flex justify-center gap-6 text-sm mb-12">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Términos B2B</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Especificaciones Técnicas</a>
         </div>
         <p className="text-xs">© 2026 MR Technology. Partner Tecnológico. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
