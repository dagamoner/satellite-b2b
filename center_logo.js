const fs = require('fs');
const file = 'apps/corporate/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Hide left and right header blocks when clickedEcosistema is not null
content = content.replace(
  '<div className={`flex-1 flex items-center justify-start hidden md:flex ${isSatelital ? "invisible" : ""}`}>',
  '<div className={`flex-1 flex items-center justify-start hidden md:flex ${isSatelital || clickedEcosistema !== null ? "invisible opacity-0" : "opacity-100"} transition-opacity duration-500`}>'
);

content = content.replace(
  '<div className={`flex-1 flex justify-end items-center hidden md:flex gap-4 ${isSatelital ? "invisible" : ""}`}>',
  '<div className={`flex-1 flex justify-end items-center hidden md:flex gap-4 ${isSatelital || clickedEcosistema !== null ? "invisible opacity-0" : "opacity-100"} transition-opacity duration-500`}>'
);

// 2. Center the container absolutely when clicked
content = content.replace(
  'className={`flex flex-wrap items-center justify-center gap-8 md:gap-14 px-4 mb-20 w-full relative transition-all duration-700 ${clickedEcosistema !== null ? "min-h-[70vh]" : "min-h-[12rem] md:min-h-[16rem]"}`}',
  'className={`flex flex-wrap items-center justify-center gap-8 md:gap-14 px-4 mb-20 w-full transition-all duration-700 ${clickedEcosistema !== null ? "fixed inset-0 z-40 bg-[#020617]/80 backdrop-blur-sm m-0" : "relative min-h-[12rem] md:min-h-[16rem]"}`}'
);

fs.writeFileSync(file, content);
console.log('Fixed corporate page centering and header blocks.');
