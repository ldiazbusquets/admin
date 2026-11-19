// Admin data: for every repo in repos.json, the last push and the latest run of each workflow (GitHub REST API,
// public repos). Writes data/admin.json. Run by .github/workflows/collect.yml.
import fs from 'node:fs';

const cfg = JSON.parse(fs.readFileSync('repos.json', 'utf8'));
const H = { Accept: 'application/vnd.github+json', 'User-Agent': 'ldb-admin', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) };
const api = async (path) => { const r = await fetch('https://api.github.com' + path, { headers: H, signal: AbortSignal.timeout(20000) }); if (!r.ok) throw new Error(`${r.status} ${path}`); return r.json(); };
const now = Date.now(), DAY = 864e5;

const repos = [];
for (const c of cfg.repos) {
  const o = { repo: c.repo, name: c.name, site: c.site ?? null, pushed: null, workflows: [], fails24: 0, err: null };
  try {
    const info = await api(`/repos/${cfg.owner}/${c.repo}`);
    o.pushed = Date.parse(info.pushed_at); o.issues = info.open_issues_count; o.branch = info.default_branch;
    const runs = (await api(`/repos/${cfg.owner}/${c.repo}/actions/runs?per_page=60`)).workflow_runs ?? [];
    const seen = new Set();
    for (const r of runs) {
      const name = r.name || r.path;
      if (cfg.ignore.includes(name)) continue;
      if (r.conclusion === 'failure' && now - Date.parse(r.updated_at) < DAY) o.fails24++;
      if (seen.has(name)) continue; seen.add(name);
      o.workflows.push({ name, status: r.status, conclusion: r.conclusion, event: r.event, started: Date.parse(r.run_started_at || r.created_at), updated: Date.parse(r.updated_at), url: r.html_url, long: cfg.longRunning.includes(name) });
    }
  } catch (e) { o.err = String(e.message || e); }
  repos.push(o);
}
fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/admin.json', JSON.stringify({ at: now, repos }));
console.log(new Date(now).toISOString(), repos.map((r) => `${r.repo}:${r.err ? 'ERR' : r.workflows.filter((w) => w.conclusion === 'failure').length + 'F'}`).join(' '));
