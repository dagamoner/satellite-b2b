import fs from 'fs';

async function main() {
  const authPath = 'C:/Users/PC/AppData/Roaming/xdg.data/com.vercel.cli/auth.json';
  if (!fs.existsSync(authPath)) {
    console.error("No auth.json found at " + authPath);
    return;
  }
  const authJson = JSON.parse(fs.readFileSync(authPath, 'utf8'));
  const token = authJson.token;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  const apps = ['cyber', 'erp', 'ia', 'informatica'];
  const repoId = "dagamoner/satellite-b2b";

  for (const app of apps) {
    const name = `satellite-b2b-${app}`;
    console.log(`Setting up ${name}...`);
    
    // Check if project exists
    let res = await fetch(`https://api.vercel.com/v9/projects/${name}`, { headers });
    if (res.status === 404) {
      console.log(`Creating project ${name}...`);
      res = await fetch('https://api.vercel.com/v10/projects', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: name,
          framework: 'nextjs',
          rootDirectory: `apps/${app}`
        })
      });
      const data = await res.json();
      if (res.status >= 400) {
         console.error("Error creating project:", data);
      }
    } else {
      console.log(`Project ${name} already exists. Updating...`);
      // Update root directory
      res = await fetch(`https://api.vercel.com/v9/projects/${name}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          rootDirectory: `apps/${app}`,
          framework: 'nextjs'
        })
      });
    }

    // Link GitHub
    console.log(`Linking GitHub for ${name}...`);
    await fetch(`https://api.vercel.com/v9/projects/${name}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        gitRepository: {
          type: 'github',
          repo: repoId
        }
      })
    });

    // Add domain
    const domain = `${app}.mrtechnology.it.com`;
    console.log(`Adding domain ${domain}...`);
    const domRes = await fetch(`https://api.vercel.com/v10/projects/${name}/domains`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: domain
      })
    });
    
    const domData = await domRes.json();
    if (domRes.status === 200 || domRes.status === 409) {
       console.log(`Domain ${domain} added successfully (or already exists).`);
    } else {
       console.error(`Failed to add domain ${domain}:`, domData);
    }
  }
}

main().catch(console.error);
