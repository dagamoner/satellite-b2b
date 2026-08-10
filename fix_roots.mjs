import fs from 'fs';

async function main() {
  const authPath = 'C:/Users/PC/AppData/Roaming/xdg.data/com.vercel.cli/auth.json';
  const authJson = JSON.parse(fs.readFileSync(authPath, 'utf8'));
  const token = authJson.token;
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  // Update satellite-b2b-marketing (www.mrtechnology.it.com) -> apps/corporate
  await fetch(`https://api.vercel.com/v9/projects/satellite-b2b-marketing`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      rootDirectory: 'apps/corporate',
      outputDirectory: null, // Clear incorrect output dir
      framework: 'nextjs'
    })
  });

  // Update satellite-b2b (satelital.mrtechnology.it.com) -> apps/satelital
  await fetch(`https://api.vercel.com/v9/projects/satellite-b2b`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      rootDirectory: 'apps/satelital',
      outputDirectory: null, // Clear incorrect output dir
      framework: 'nextjs'
    })
  });

  console.log("Updated projects roots!");
}

main().catch(console.error);
