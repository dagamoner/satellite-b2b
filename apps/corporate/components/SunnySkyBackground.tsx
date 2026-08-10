export function SunnySkyBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-50">
      {/* Sleek Light Gradient (White, Gray, Black combination) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-200 to-gray-400" />

      {/* Abstract Glowing Spheres */}
      <div className="absolute top-10 right-10 md:top-20 md:right-32 w-[30rem] h-[30rem] bg-gray-300 rounded-full blur-[120px] opacity-80" />
      <div className="absolute top-20 right-20 md:top-32 md:right-40 w-64 h-64 bg-white rounded-full blur-[60px] opacity-90" />
      
      {/* Dark accents for depth */}
      <div className="absolute bottom-20 left-10 md:bottom-32 md:left-20 w-[40rem] h-[40rem] bg-gray-600 rounded-full blur-[150px] opacity-30" />
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-black rounded-full blur-[200px] opacity-10" />

      {/* Grid Pattern (Subtle) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      {/* Atmospheric Mist at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900/10 to-transparent pointer-events-none" />
    </div>
  );
}
