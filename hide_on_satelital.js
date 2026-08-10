const fs = require('fs');
const file = 'apps/corporate/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('const [isSatelital, setIsSatelital] = useState(false);')) {
  // Add state
  content = content.replace(
    'const orbitStartRef = useRef<number>(0);',
    `const orbitStartRef = useRef<number>(0);
  const [isSatelital, setIsSatelital] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hostname.includes("satelital")) {
      setIsSatelital(true);
    }
  }, []);`
  );

  // Hide Left Logo
  content = content.replace(
    '<div className="flex-1 flex items-center justify-start hidden md:flex">',
    '<div className={`flex-1 flex items-center justify-start hidden md:flex ${isSatelital ? "invisible" : ""}`}>'
  );

  // Hide Hablamos button
  content = content.replace(
    '<div className="flex-1 flex justify-end items-center hidden md:flex gap-4">',
    '<div className={`flex-1 flex justify-end items-center hidden md:flex gap-4 ${isSatelital ? "invisible" : ""}`}>'
  );

  // Hide Watermark
  content = content.replace(
    '{/* Sello de Agua - Logo MR Technology */}\n      <motion.div',
    '{/* Sello de Agua - Logo MR Technology */}\n      {!isSatelital && (<motion.div'
  );
  content = content.replace(
    '        />\n      </motion.div>',
    '        />\n      </motion.div>)}'
  );

  // Hide Ecosystem 5 logos and tags
  content = content.replace(
    '{/* Hero Body */}\n        <div className="mt-20 md:mt-28 mb-16 flex flex-col items-center z-10 w-full max-w-7xl mx-auto">',
    '{/* Hero Body */}\n        <div className={`mt-20 md:mt-28 mb-16 flex flex-col items-center z-10 w-full max-w-7xl mx-auto ${isSatelital ? "hidden" : ""}`}>'
  );

  // Hide WhatsApp bottom section
  content = content.replace(
    '{/* Contacto / Hablamos Section - Moved to Hero to keep Space Background */}\n          <div id="whatsapp-contact"',
    '{/* Contacto / Hablamos Section - Moved to Hero to keep Space Background */}\n          {!isSatelital && (<div id="whatsapp-contact"'
  );
  content = content.replace(
    '             </div>\n          </div>\n\n          </>)}',
    '             </div>\n          </div>\n          )}\n\n          </>)}'
  );

  // FIX TYPE ERROR
  content = content.replace(
    'window.location.href = url;',
    'if (url) window.location.href = url;'
  );

  fs.writeFileSync(file, content);
  console.log('Patched corporate page correctly and fixed type error.');
}
