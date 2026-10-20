# SONIC EXCHANGE

A standalone music intelligence, artist operations, rights, licensing and distribution prototype. Built from scratch; independent of the existing SONIC EXCHANGE prototype.

## Run locally

Node 22 or 24 and npm are required.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. INDEX is available at `/` and `/index`. Navigation order: SONIC NOW, INDEX, ARTISTS, BRANDS, VENUES, DISTRIBUTION, FACTS SHOW.

The header's **Demo role** selector opens artist, brand and venue workspaces. It is not authentication. All artists, balances, financial actions, rankings, verification, delivery and editorial content are clearly labelled demonstrations. Progress is saved in this browser only. No credentials are needed.

## Verification

```sh
npm run check       # lint, strict types, domain tests, production build
npm start           # production server for browser tests
npm run test:e2e    # in a second terminal; requires Chromium
```

Playwright uses `/usr/bin/chromium` in the managed workspace. For other machines, run `npx playwright install chromium`; the config falls back to the installed Playwright browser. Browser tests capture all seven pages at desktop, tablet and mobile widths into `docs/screenshots` and run axe accessibility scans.

- [Architecture, routes and role matrix](docs/ARCHITECTURE.md)
- [Integration readiness and media provenance](docs/INTEGRATIONS.md)
- [Review journeys, scope and rollback](docs/REVIEW.md)
- [Master implementation brief](docs/CODEX_MASTER_REDESIGN_PROMPT.md)

Preview deployments only. Production requires explicit approval.
