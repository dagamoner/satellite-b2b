const fs = require('fs');
const apps = ['informatica', 'erp', 'ia', 'cyber', 'corporate'];

apps.forEach(app => {
  const pkgPath = `apps/${app}/package.json`;
  const pkg = JSON.parse(fs.readFileSync(pkgPath));
  pkg.name = `@repo/${app}`;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  
  const pagePath = `apps/${app}/app/page.tsx`;
  fs.writeFileSync(pagePath, `export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <h1 className="text-4xl capitalize font-bold">{ "${app}" } - Próximamente</h1>
    </div>
  );
}`);
});
