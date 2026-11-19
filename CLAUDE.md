# LDB Admin (ldiazbusquets.github.io/admin)
- Public repo: never store key values, passphrases or anything secret; keys.json holds names and dates only.
- Never list or link ENTITY (private, anonymous) or anything from it.
- No invented data: everything comes from data/admin.json (GitHub API via the workflow), the status page JSON, or keys.json
  entered by Luis. Unknown expiry dates stay null.
- Plain static page + Node 20 script, no dependencies. Bot commits use [skip ci].
