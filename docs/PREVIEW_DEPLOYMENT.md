# Prepared preview deployment

## Status

The application is built, tested and pushed. Preview publication was attempted through the connected Vercel account and blocked by the provider:

> 403 forbidden: You don't have permission to create a project.

No deployment or preview URL was returned. No production deployment was attempted. The local Vercel CLI is not installed; the mapped CLI fallback was unavailable. No unrelated project or hosting account was used.

## Verified target

- Team: `kingbob-3860` (`team_v8zAj6GZvTNVlH2l3yObf0dc`)
- New project name: `sonic-exchange-platform`
- Repository: `thebiggestkingbob/sonic-exchange`
- Branch: `feature/sonic-platform`
- Tested application commit: `94f4fda3810b4ebce169da4ae6550e9dbc173097`
- Framework: Next.js, Node 24, `npm ci`, `npm run build`
- Environment: **preview only**; no production approval exists.
- Secrets required for this demo: none.

## Resume publication

An authorized Vercel project and deployment access are needed. After project access is provided, use the new project ID explicitly and create a deployment from the tested commit on this feature branch. Omit the API's production target (Vercel's default is preview), or use the CLI's explicit `--target preview`. Inspect the returned target, commit and build logs, wait for READY and report the literal preview URL. Do not promote it to production.

The source, lockfile and `.vercelignore` are ready. All app state and provider integrations remain in demo mode. See `VERIFICATION.md` and `INTEGRATIONS.md` for the evidence and service boundaries. Subsequent documentation-only commits do not change the tested application.
