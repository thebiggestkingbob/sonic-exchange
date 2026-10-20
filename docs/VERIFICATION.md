# Verification record

Date: 20 October 2026 (South Africa).

## Automated checks

- ESLint and strict TypeScript: passing.
- Production Next.js build: passing. INDEX is served at `/` and `/index` (a rewrite avoids duplicate root/index output manifests).
- Domain suite: 14 passing tests. Tests cover search/ranking, role restrictions, escrow lifecycle, one-time refunds, insufficient balances, payouts, rights/split/asset validation, delivery state, booking validation, history/participation persistence, corrupted storage, calendar dates and numeric CSV output.
- Browser suite: 15 passing tests against the production server, including complete multi-role licensing and booking journeys, simulated release delivery, microphone error/cleanup, sample recognition, payout/export, player and participation, global search and mobile navigation.
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

All external integrations remain unconfigured; see `INTEGRATIONS.md`. Browser-local role switching is not live authentication. Only Amara Sol has an active artist workspace for offer acceptance. Saved media declarations are filenames, not retained files. Earnings and rankings are fictional, and period views reuse the same seeded snapshot. The original legacy functional screenshots were not available; the two supplied images were used as visual references. The independent prototype was not accessed.

Application commit: `94f4fda3810b4ebce169da4ae6550e9dbc173097`. Subsequent commits update documentation only.

Preview publication was blocked by Vercel with **403 forbidden: You don't have permission to create a project.** No preview URL exists yet. The deployment target and resume steps are recorded in `PREVIEW_DEPLOYMENT.md`. Production deployment and merge require separate approval.
