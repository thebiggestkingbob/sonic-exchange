# SONIC EXCHANGE — Codex Master Implementation Brief
## Mission
Implement the approved premium visual redesign of the EXISTING SONIC EXCHANGE platform, using the supplied approved visual reference screenshots as visual direction. Preserve the exact current route names, page order, roles, information architecture, business logic, and functional flows. Do NOT rebuild as a different music marketplace, rename routes, or overwrite the deployed prototype.

## Critical prerequisite: locate the real source
This repository initially contains only README.md. Before implementation, identify the source repository/branch or export of the working prototype currently deployed at https://tanstack-start-app.sonic-exchange-demo.workers.dev/ . Do not fabricate existing application code or replace the live application with a scaffold. If the real source is not available, STOP and request the source repository, export, or permission to import it. Do not deploy from this empty repository.

## Brand / visual system
- Official brand: SONIC EXCHANGE (never “THE SONIC EXCHANGE”).
- Predominantly white canvas, deep-black typography, Helvetica / Helvetica Neue fallback to Arial.
- Official restrained accent: Soft Lavender #D7B8FF, used for active states, focused inputs, accents, selection, charts, subtle gradients and atmospheric media treatments. Maintain accessible contrast; avoid lavender for low-contrast small text.
- Reference aesthetic: premium modern music/fintech platform, editorial large headings, high-quality monochrome music photography with soft-lavender lighting, crisp cards, restrained shadows, balanced spacing, polished responsive navigation, clear CTAs, audio waveform motifs where relevant.
- The approved newer screenshots are VISUAL REFERENCES ONLY. Do not import their alternate navigation labels, fictional marketplace assets, sample data, page taxonomy, or unrelated commerce features.
- No gratuitous underlines, excessive boxes, cramped microtype, decorative clutter, or invented metrics.

## Existing screens/routes to retain, in their existing order
1. SONIC NOW — existing live music identification page; retain microphone/listening, identification, results and listening-history workflows. Apply approved premium visual treatment; do NOT turn it into an events-only page.
2. INDEX — public cultural intelligence index, search/filter/sort/pagination, artist ranking, genre velocity, gainer alert, radio chart, artist profiles. Maintain all existing data semantics and actions.
3. ARTISTS — artist terminal/dashboard, overview, wallet, releases, deals, royalties, distribution, settings, transparency ledger, opportunity feed and release manager. Keep role-based access.
4. BRANDS — brand hub, artist discovery, audience/genre filters, verified data, sync licensing offers, bids, agreements and escrow states.
5. VENUES — venue portal, compliance status, venue search, pull predictor and booking workflow.
6. DISTRIBUTION — full distribution page, existing release/distribution workflows, metadata, assets, DSP delivery/status, rights and royalties integration. Audit and complete UI coverage without inventing a functioning external integration.
7. FACTS SHOW — editorial program, episode/player, verified earnings leaderboard and audience participation.
Also preserve the existing public landing/index entry point, whichever route currently owns it. Do not rename, remove, reorder or consolidate existing pages.

## Implementation phases
Phase 0: inspect the real source, enumerate actual routes/components, screenshot current UI at 1440/1024/768/430/390 widths, record functional baseline, note API/data source provenance and existing tests. Map each approved screenshot to the matching existing page. Produce a change plan.
Phase 1: implement shared design tokens and components (header, navigation, responsive menus, search, buttons, tabs, forms, cards, tables, badges, charts, typography, skeletons, empty/error/loading states) without changing business logic.
Phase 2: redesign public landing and INDEX in their existing routes; retain ranking and filters, ensure table is usable on mobile.
Phase 3: redesign SONIC NOW; preserve real listening/recognition behavior and browser microphone permission/error states. Never imply recognition works if no service is configured.
Phase 4: redesign ARTISTS, BRANDS and VENUES, preserving all role permissions, ledger/payment semantics, bid and booking workflows.
Phase 5: redesign DISTRIBUTION and FACTS SHOW, preserving rights/metadata validations and editorial interactions.
Phase 6: responsive/accessibility/performance/security regression testing, screenshots and review.

## Non-negotiable safeguards
- Work only on a dedicated feature branch; never force-push, reset, or overwrite main.
- Never change backend schemas, APIs, permissions, payment, escrow, wallet or payout logic solely for aesthetics.
- Keep existing copy, verified facts, metrics and labels unless the user explicitly approves changes. Distinguish mock/demo figures from verified real-world claims.
- No fake live data, payments, DSP connections, or music recognition.
- No deployment to production without explicit approval.
- Before each phase run existing tests; after changes run lint, typecheck, tests and build; fix regressions without hiding errors.
- Make screenshots and an explicit checklist for desktop, tablet, mobile; keyboard focus, reduced motion, contrast, overflow, media loading, state transitions and navigation.
- Document modified files, routes, functionality preserved, outstanding integrations, known issues, preview URL and rollback method.

## Completion criteria
Every original route is present and named exactly as before; page order and role access unchanged; functionality remains intact; all approved screens visually match the reference direction (not the reference app's structure); distribution is covered; all viewports work; automated checks pass; changes are reviewable in a pull request, not automatically merged.

## Immediate next action
Locate the actual working SONIC EXCHANGE source code. If it is not in this repository, ask the user for its location before coding. Once available, implement in phases and provide previews for approval.
