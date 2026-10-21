# Review and release notes

## Product scope

The two supplied screenshots guide visual language: white editorial layouts, black Helvetica typography, restrained #D7B8FF accents, monochrome music portraits, waveform motifs and generous spacing. Their alternate navigation, events taxonomy and fictional marketplace assets are not imported. The master brief defines the seven destinations. Exact legacy business semantics cannot be confirmed from these two visual references; no old prototype was accessed.

## Architecture and modified areas

- `src/app`: seven public destinations (INDEX is `/` with a `/index` rewrite), common layout, loading/error/404 states and the read-only integration readiness API.
- `src/components`: design primitives, keyboard navigation, dialogs, local state provider, page-specific journeys and shared agreements.
- `src/lib`: South African catalogue references with simulated metric fixtures, domain commands/state transitions, release validation, role checks and external-provider interfaces.
- `public`: generated music imagery and original synthetic sample audio.
- `tests`: domain regressions and production-server browser journeys, accessibility checks and viewport captures.
- Configuration: strict TypeScript, ESLint, reproducible npm lockfile, Next headers and Playwright.

## Demo journeys to review

1. INDEX: search artists, change genre, sort by momentum, paginate, view an artist and save an alert. Reload to confirm persistence.
2. SONIC NOW: check microphone permission, stop listening, try the explicit sample result and view saved history.
3. ARTISTS: switch to Artist, explore every tab, request a simulated payout, export the ledger and save preferences.
4. BRANDS: switch to Brand, create an offer for Amara Sol. Switch to Artist and accept in Deals. Switch back to Brand, fund demo escrow and complete settlement. Review the artist ledger. Try cancellation before settlement to observe a one-time refund.
5. VENUES: switch to Venue, search rooms, adjust the predictor, request an Amara Sol booking, accept as Artist, then fund/settle or cancel as Venue.
6. DISTRIBUTION: switch to Artist, create metadata, pick files or demo assets, declare rights and 100% allocation, save a draft, submit a demo queue and advance three stages. Test an invalid rights declaration or split to see submission blocked.
7. FACTS SHOW: change episodes, play the clearly labelled synthetic sample, save interest and ask a local question.

See `INTEGRATIONS.md` for live-service boundaries and known limitations.

## Deployment and rollback

Only a new Vercel preview project/environment is authorized. The feature branch is `feature/sonic-platform`. Main and the independent prototype are not deployment targets. No automatic merge or production promotion is part of this implementation.

To roll back local demo data, use Interactive Demo → Reset demo. To roll back preview code, create a new feature commit reverting the reviewed change and deploy that commit to preview, or remove the preview deployment in Vercel. No production data migration exists or needs rollback.

Verification evidence, viewport screenshots and preview details are recorded in `VERIFICATION.md` after the final checks.
