# Verification record

Date: 20 October 2026 (South Africa).

## Automated checks

- ESLint and strict TypeScript: passing.
- Production Next.js build: passing. INDEX is served at `/` and `/index` (a rewrite avoids duplicate root/index output manifests).
- Domain suite: 14 passing tests. Tests cover search/ranking, role restrictions, escrow lifecycle, one-time refunds, insufficient balances, payouts, rights/split/asset validation, delivery state, booking validation, history/participation persistence, corrupted storage, calendar dates and numeric CSV output.
- Browser suite: 16 passing tests against the production server, including complete multi-role licensing and booking journeys, simulated release delivery, microphone error/cleanup, sample recognition, payout/export, player and participation, global search and mobile navigation.
- Axe WCAG A/AA checks: no violations on the seven default destination views at each of the three captured viewports. This is an automated check, not a certification or a substitute for assistive-technology testing.
- Final scoped regressions after the CSV and listening-icon refinements: 6 passing checks (payout/export, reduced-motion microphone, keyboard/table navigation, and all three viewport/accessibility captures).
- Production dependency audit: zero reported vulnerabilities.

## Viewport and interaction checklist

| Check                                  | Desktop 1440×1000 | Tablet 768×1024 | Mobile 390×844 |
| -------------------------------------- | ----------------- | --------------- | -------------- |
| All seven destinations render          | Pass              | Pass            | Pass           |
| No document-width overflow             | Pass              | Pass            | Pass           |
| Music imagery loads                    | Pass              | Pass            | Pass           |
| Main navigation and role selection     | Pass              | Pass            | Pass           |
| INDEX table remains locally scrollable | Pass              | Pass            | Pass           |
| Automated text contrast checks         | Pass              | Pass            | Pass           |
| Loading, empty and unconfigured states | Implemented       | Implemented     | Implemented    |

Keyboard focus is visible, dialogs use native focus containment/Escape and restore focus, tabs support arrow/Home/End navigation. `prefers-reduced-motion` disables animation, transitions and smooth scrolling. Microphone streams stop on explicit stop, timeout and unmount. Tests record no page errors across the destination captures.

## Screenshots

All 21 captures are in `docs/screenshots/`, named `<desktop|tablet|mobile>-<destination>.png`.

| Destination  | Desktop                                      | Tablet                                      | Mobile                                      |
| ------------ | -------------------------------------------- | ------------------------------------------- | ------------------------------------------- |
| INDEX        | [view](screenshots/desktop-index.png)        | [view](screenshots/tablet-index.png)        | [view](screenshots/mobile-index.png)        |
| SONIC NOW    | [view](screenshots/desktop-sonic-now.png)    | [view](screenshots/tablet-sonic-now.png)    | [view](screenshots/mobile-sonic-now.png)    |
| ARTISTS      | [view](screenshots/desktop-artists.png)      | [view](screenshots/tablet-artists.png)      | [view](screenshots/mobile-artists.png)      |
| BRANDS       | [view](screenshots/desktop-brands.png)       | [view](screenshots/tablet-brands.png)       | [view](screenshots/mobile-brands.png)       |
| VENUES       | [view](screenshots/desktop-venues.png)       | [view](screenshots/tablet-venues.png)       | [view](screenshots/mobile-venues.png)       |
| DISTRIBUTION | [view](screenshots/desktop-distribution.png) | [view](screenshots/tablet-distribution.png) | [view](screenshots/mobile-distribution.png) |
| FACTS SHOW   | [view](screenshots/desktop-facts-show.png)   | [view](screenshots/tablet-facts-show.png)   | [view](screenshots/mobile-facts-show.png)   |

## Known limits

All external integrations remain unconfigured; see `INTEGRATIONS.md`. Browser-local role switching is not live authentication. Kabza De Small is the sample reference in the simulated active artist workspace; no artist affiliation is implied. Saved media declarations are filenames, not retained files. Financial transactions, rankings and social metrics are simulated, and period views reuse the same seeded snapshot. The original legacy functional screenshots were not available; the two supplied images were used as visual references. The independent prototype was not accessed.

Original application commit: `94f4fda3810b4ebce169da4ae6550e9dbc173097`. See SOUTH_AFRICAN_CONTENT.md for the subsequent catalogue refresh.

The user subsequently created a preview through the authenticated Codespaces CLI. This content refresh requires a new preview; see PREVIEW_DEPLOYMENT.md. Production deployment and merge require separate approval.

## South African catalogue refresh

Lint, strict TypeScript, production build, 14 domain tests and 16 browser tests pass after the refresh. The added journey checks all five requested artist profiles, real-song search, simulated social metrics, and failed-photo fallback. The 21 viewport captures and automated accessibility checks were regenerated. Browser tests deliberately block remote artist-image hosts to verify local fallbacks deterministically; they do not establish third-party image availability. Public photo sources were located separately through image search. Live social metrics were not retrieved.
