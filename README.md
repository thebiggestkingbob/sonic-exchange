# SONIC EXCHANGE

A standalone music intelligence, artist operations, rights, licensing and distribution prototype. Built from scratch; independent of the existing SONIC EXCHANGE prototype.

## Run locally

Node 22 or 24 and npm are required.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. The new Home is at `/`, Marketplace at `/marketplace`, asset detail at `/marketplace/[slug]`, and the cultural INDEX at `/index`. Navigation retains SONIC NOW, INDEX, ARTISTS, BRANDS, VENUES, DISTRIBUTION and FACTS SHOW after the two new entry points.

The header's **Demo role** selector opens artist, brand and venue workspaces. It is not authentication. All artists, balances, financial actions, rankings, verification, delivery and editorial content are clearly labelled demonstrations. Progress is saved in this browser only. No credentials are needed.

## Verification

```sh
npm run check       # lint, strict types, domain tests, production build
npm start           # production server for browser tests
npm run test:e2e    # in a second terminal; requires Chromium
```

Playwright uses `/usr/bin/chromium` in the managed workspace. For other machines, run `npx playwright install chromium`; the config falls back to the installed Playwright browser. Browser tests capture all seven pages at desktop, tablet and mobile widths into `docs/screenshots` and run axe accessibility scans.

- [Three alternative motion design studies](docs/DESIGN_DIRECTIONS.md)
- [Sound World motion website and first-time guide](docs/SOUND_WORLD.md)
- [Home and Marketplace redesign, scope and verification](docs/NEXT_CHAPTER_DESIGN.md)
- [Architecture, routes and role matrix](docs/ARCHITECTURE.md)
- [Integration readiness and media provenance](docs/INTEGRATIONS.md)
- [Review journeys, scope and rollback](docs/REVIEW.md)
- [Verification and viewport screenshots](docs/VERIFICATION.md)
- [Prepared preview deployment and access blocker](docs/PREVIEW_DEPLOYMENT.md)
- [Master implementation brief](docs/CODEX_MASTER_REDESIGN_PROMPT.md)

Preview deployments only. Production requires explicit approval.
