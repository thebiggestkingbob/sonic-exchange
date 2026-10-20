# SONIC EXCHANGE — Codex Master Implementation Brief
## Mission — GREENFIELD BUILD (supersedes previous redesign instructions)
Build a brand-new, complete SONIC EXCHANGE application from scratch in THIS repository. The existing working prototype at https://tanstack-start-app.sonic-exchange-demo.workers.dev/ is independent and MUST NOT be connected, imported, migrated, synchronized, overwritten, scraped for code, or modified. The user's original screenshots are product/functional references only; the approved new INDEX and premium lavender screenshots are visual references. Do not require access to the old source before proceeding.

Start by inspecting this repository (currently README and this brief), then scaffold a production-minded full-stack application. Choose a coherent, maintainable TypeScript stack suitable for Vercel preview deployment (e.g. Next.js App Router + Tailwind + component primitives), with local demo data and clearly labeled simulations where external integrations are not yet configured. Provide a complete clickable end-to-end prototype with actual stateful UI, sensible persistence for demo journeys, responsive screens and role-based navigation. Do not pretend demo money, music recognition, DSP connections, compliance or verified data are live. Isolate provider integrations behind interfaces, document credentials/configuration and server-side secrets. Never add credentials to source.

## Brand / visual system
- Official brand: SONIC EXCHANGE (never “THE SONIC EXCHANGE”).
- Predominantly white canvas, deep-black typography, Helvetica / Helvetica Neue fallback to Arial.
- Official restrained accent: Soft Lavender #D7B8FF, used for active states, focused inputs, accents, selection, charts, subtle gradients and atmospheric media treatments. Maintain accessible contrast; avoid lavender for low-contrast small text.
- Reference aesthetic: premium modern music/fintech platform, editorial large headings, high-quality monochrome music photography with soft-lavender lighting, crisp cards, restrained shadows, balanced spacing, polished responsive navigation, clear CTAs, audio waveform motifs where relevant.
- The approved newer screenshots are VISUAL REFERENCES ONLY. Do not import their alternate navigation labels, fictional marketplace assets, sample data, page taxonomy, or unrelated commerce features.
- No gratuitous underlines, excessive boxes, cramped microtype, decorative clutter, or invented metrics.

## Required new screens/routes to build, in this exact order
1. SONIC NOW — existing live music identification page; retain microphone/listening, identification, results and listening-history workflows. Apply approved premium visual treatment; do NOT turn it into an events-only page.
2. INDEX — public cultural intelligence index, search/filter/sort/pagination, artist ranking, genre velocity, gainer alert, radio chart, artist profiles. Maintain all existing data semantics and actions.
3. ARTISTS — artist terminal/dashboard, overview, wallet, releases, deals, royalties, distribution, settings, transparency ledger, opportunity feed and release manager. Keep role-based access.
4. BRANDS — brand hub, artist discovery, audience/genre filters, verified data, sync licensing offers, bids, agreements and escrow states.
5. VENUES — venue portal, compliance status, venue search, pull predictor and booking workflow.
6. DISTRIBUTION — full distribution page, existing release/distribution workflows, metadata, assets, DSP delivery/status, rights and royalties integration. Audit and complete UI coverage without inventing a functioning external integration.
7. FACTS SHOW — editorial program, episode/player, verified earnings leaderboard and audience participation.
Create a public landing experience integrated with INDEX without introducing new primary navigation names. The original screenshots guide scope, not a dependency on old code.

## Implementation phases
Phase 0: inspect this new repository, select and scaffold the architecture, define route map, roles, entities, seeded demo fixtures, interaction contracts, and test plan. Use attached screenshots as design and product references. Do not access or depend on the old prototype.
Phase 1: implement shared design tokens and components (header, navigation, responsive menus, search, buttons, tabs, forms, cards, tables, badges, charts, typography, skeletons, empty/error/loading states) without changing business logic.
Phase 2: redesign public landing and INDEX in their existing routes; retain ranking and filters, ensure table is usable on mobile.
Phase 3: redesign SONIC NOW; preserve real listening/recognition behavior and browser microphone permission/error states. Never imply recognition works if no service is configured.
Phase 4: redesign ARTISTS, BRANDS and VENUES, preserving all role permissions, ledger/payment semantics, bid and booking workflows.
Phase 5: redesign DISTRIBUTION and FACTS SHOW, preserving rights/metadata validations and editorial interactions.
Phase 6: responsive/accessibility/performance/security regression testing, screenshots and review.

## Non-negotiable safeguards
- Work only on a dedicated feature branch; never force-push, reset, or overwrite main.
- Design new schemas, APIs, permissions and demo workflows safely; separate simulated escrow, wallet, royalties and payout actions from any real money movement. No live financial actions without approved integrations.
- Keep established page names and user-approved copy where specified. Clearly label all mock/demo figures, artist data, status and compliance claims.
- Use clearly labeled demo data and simulated integrations where necessary; do not present them as live, verified or production-connected.
- No deployment to production without explicit approval.
- Establish tests in the new app; after each phase run lint, typecheck, tests and build; fix regressions without hiding errors.
- Make screenshots and an explicit checklist for desktop, tablet, mobile; keyboard focus, reduced motion, contrast, overflow, media loading, state transitions and navigation.
- Document modified files, routes, functionality preserved, outstanding integrations, known issues, preview URL and rollback method.

## Completion criteria
All seven required destinations exist in the exact approved order; all planned role journeys are implemented as real interactive prototype flows; visual design matches the approved references; distribution is covered; all viewports work; tests pass; simulated vs live integrations are documented; changes are reviewable in a pull request, not automatically merged.

## Immediate next action
Proceed with the greenfield build in this repository. First deliver the architecture, route inventory, role matrix and a working INDEX visual benchmark. Then implement the other six destinations in phases, test them, and publish a separate preview deployment only after verifying the build. Never connect to or modify the old prototype. Report any external integrations that need credentials or approval.
