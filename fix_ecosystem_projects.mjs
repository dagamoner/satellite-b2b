import fs from 'fs';

async function main() {
  const authPath = 'C:/Users/PC/AppData/Roaming/xdg.data/com.vercel.cli/auth.json';
  const authJson = JSON.parse(fs.readFileSync(authPath, 'utf8'));
  const token = authJson.token;
  const teamId = 'team_dkfnRVEuoRAGGFOUdQ3oqSts';
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  // 1. Delete the bad projects
  const badProjects = ['cyber', 'erp', 'ia', 'informatica'];
  for (const p of badProjects) {
    console.log(`Deleting ${p}...`);
    await fetch(`https://api.vercel.com/v9/projects/${p}?teamId=${teamId}`, { method: 'DELETE', headers });
  }

  // 2. Configure the good projects
  const goodProjects = [
    { name: 'satellite-b2b-cyber', app: 'cyber' },
    { name: 'satellite-b2b-erp', app: 'erp' },
    { name: 'satellite-b2b-ia', app: 'ia' },
    { name: 'satellite-b2b-informatica', app: 'informatica' }
  ];

  for (const p of goodProjects) {
    console.log(`Configuring ${p.name}...`);
    const res = await fetch(`https://api.vercel.com/v9/projects/${p.name}?teamId=${teamId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        rootDirectory: `apps/${p.app}`,
        buildCommand: `npx turbo run build --filter=${p.app}`,
        outputDirectory: null,
        framework: 'nextjs'
      })
    });
    const data = await res.json();
    if (data.error) console.error(`Error configuring ${p.name}:`, data.error);
    
    // Link to GitHub repo
    console.log(`Linking ${p.name} to GitHub...`);
    const linkRes = await fetch(`https://api.vercel.com/v9/projects/${p.name}/link?teamId=${teamId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        type: "github",
        repo: "dagamoner/satellite-b2b",
        repoId: 1224557315
      })
    });
    const linkData = await linkRes.json();
    if (linkData.error) console.error(`Error linking ${p.name}:`, linkData.error);
  }

  console.log("Done!");
}

main().catch(console.error);
