# Preview deployment

## Current state

The user created `sonic-exchange-platform` under `kingbob-3860` from the authenticated GitHub Codespaces terminal. The first project-creation command unexpectedly produced a Production deployment despite `--environment preview`; no production approval had been given. A subsequent command against the existing project produced a confirmed Preview deployment. Do not promote or replace production without explicit approval.

Confirmed preview of the earlier build:
https://sonic-exchange-platform-o2ypnn490-kingbob-3860.vercel.app

This South African catalogue refresh is a new source change and is not reflected in that immutable preview URL. It needs a new preview deployment. The connected Vercel tool has previously returned provider 403 errors; authentication inside the user's Codespace does not authenticate this separate execution environment.

## Refresh from the user's authenticated Codespace

Working directory: `/workspaces/sonic-exchange`, branch: `feature/sonic-platform`.

```sh
git pull --ff-only
npx --yes vercel@64.7.0 deploy --scope kingbob-3860 --project sonic-exchange-platform --environment preview --yes
```

Confirm that output explicitly says Preview and Ready before reporting the new URL. This is an existing project: do not use a project-creation flag. No secrets are needed for the demo. Vercel Authentication protects the preview; sign in with the owning account to review it.
