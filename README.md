# LDB Admin

Health of Luis Diaz Busquets's repos and sites in one place: **https://ldiazbusquets.github.io/admin/** (not indexed).

- `repos.json`: repos to watch. `keys.json`: API keys and tokens, **names and expiry dates only** (this repo is public).
- `.github/workflows/collect.yml` runs `scripts/collect.mjs` every 15 minutes: last push and the latest run of each
  workflow per repo (GitHub API), written to `data/admin.json`. Each run loops ~5.6 h, then starts the next.
- Site and data-feed health come from the status page (`../status/data/status.json`).

## Running workflows from the page
Buttons start a workflow (`workflow_dispatch`). With a fine-grained GitHub token (Actions: read and write) saved in the
browser via "Connect GitHub", they start it directly; without one they open the workflow on GitHub. The token lives only in
that browser's localStorage and is sent only to api.github.com. `collect.mjs` marks which workflows can be started by hand.
