import fs from 'fs';

async function main() {
  const authPath = 'C:/Users/PC/AppData/Roaming/xdg.data/com.vercel.cli/auth.json';
  const authJson = JSON.parse(fs.readFileSync(authPath, 'utf8'));
  const token = authJson.token;
  const teamId = 'team_dkfnRVEuoRAGGFOUdQ3oqSts';
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const projects = ['cyber', 'erp', 'ia', 'informatica'];

  for (const p of projects) {
    const name = `satellite-b2b-${p}`;
    console.log(`Configuring ${name}...`);
    const res = await fetch(`https://api.vercel.com/v9/projects/${name}?teamId=${teamId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        buildCommand: `npx turbo run build --filter=@repo/${p}`
      })
    });
    const data = await res.json();
    if (data.error) console.error(`Error configuring ${name}:`, data.error);
  }

  console.log("Done!");
}

main().catch(console.error);
