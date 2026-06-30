import fs from 'fs';

async function main() {
  const authPath = 'C:/Users/PC/AppData/Roaming/xdg.data/com.vercel.cli/auth.json';
  const authJson = JSON.parse(fs.readFileSync(authPath, 'utf8'));
  const token = authJson.token;
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  // Update satellite-b2b-marketing (www.mrtechnology.it.com)
  await fetch(`https://api.vercel.com/v9/projects/satellite-b2b-marketing`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      buildCommand: 'npx turbo run build --filter=@repo/corporate'
    })
  });

  // Update satellite-b2b (satelital.mrtechnology.it.com)
  await fetch(`https://api.vercel.com/v9/projects/satellite-b2b`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      buildCommand: 'npx turbo run build --filter=satelital'
    })
  });

  console.log("Updated build commands!");
}

main().catch(console.error);
