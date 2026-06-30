import fs from 'fs';

async function main() {
  const authPath = 'C:/Users/PC/AppData/Roaming/xdg.data/com.vercel.cli/auth.json';
  const authJson = JSON.parse(fs.readFileSync(authPath, 'utf8'));
  const token = authJson.token;
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  let res = await fetch(`https://api.vercel.com/v9/projects/satellite-b2b-marketing`, { headers });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
