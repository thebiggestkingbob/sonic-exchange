# Integration boundaries

This is a standalone, greenfield prototype. It neither connects to nor modifies the independent SONIC EXCHANGE prototype.

| Area                 | Working in this preview                                                                                                     | Required for live operation                                                                                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Identity             | Explicit browser-local role switch                                                                                          | Server-validated authentication, tenant membership, ownership checks, audited role grants                                                              |
| Music identification | Real microphone permission and device check, stop/cleanup, explicit predetermined sample result, local listening history    | Licensed recognition provider and catalogue, consent, server-side signing, timeouts, supported media capture                                           |
| INDEX                | Fictional fixtures, search/filter/sort/pagination, profiles, genre/radio views, local alerts                                | Licensed cultural and radio feeds, dated provenance, scoring methodology, notification delivery                                                        |
| Payments             | Integer-cent demo balances, atomic simulated funding, one-time settlement/refund, local payout requests, CSV ledger         | Payment processor, identity/compliance checks, verified beneficiaries, authenticated server commands, signed webhooks, idempotency and reconciliation  |
| Licensing            | Offer terms in project description, artist acceptance, simulated escrow stages                                              | Reviewed licence templates, rights provenance, signatures, real escrow service                                                                         |
| Venues               | Search, capacity control, explicitly illustrative attendance heuristic, booking states                                      | Venue verification, public performance compliance, ticketing and geospatial consent, date reservation and conflict handling                            |
| Distribution         | Metadata drafts, file extension/size checks, artwork dimensions, declaration/split validation, manually advanced simulation | Licensed distributor API, durable media storage, audio mastering checks, malware scanning, rights review, delivery webhooks and actual DSP identifiers |
| Royalties            | Seeded opening balance and agreement-derived demo ledger                                                                    | Provider statements, publishing rights mappings, statement reconciliation and verified source periods                                                  |
| FACTS SHOW           | Fictional episode selection, original 18-second sample audio, local voting/questions, unverified leaderboard illustration   | Licensed interviews, real editorial CMS, consent, moderation and submission backend, independently verified earnings sources                           |

`src/lib/providers.ts` defines the service interfaces. `UnconfiguredProvider` rejects operations rather than returning fake successes. `GET /api/integrations` reports every external service as unconfigured and rejects writes. There are no payment, recognition or distribution proxy endpoints in this release.

## Credentials and server configuration

No credentials are needed for the demo. No secret environment variables are read by client components, and no secrets belong in Git or `NEXT_PUBLIC_*` variables. Before implementing a provider, choose an account and environment, add its credentials through the deployment platform's secret configuration, and implement the authenticated server adapter plus signed callbacks and tests. Adding credentials alone does not enable a live service in this prototype. Keep preview and production credentials separate. Never use production payments for a demo journey.

## Local data and media

Demo state uses the versioned `sonic-exchange-demo-v1` localStorage key. Schema validation rejects malformed stored records. The demo role selector is a navigation aid, not a security boundary. No state is shared between devices, and multi-tab concurrent updates are not coordinated. Storage failure is visible; the session remains usable in memory. The Interactive Demo control resets this browser's progress after confirmation.

Only media filenames are persisted. Selected audio and artwork are checked locally and then discarded when the dialog closes. After saving/reloading, submission validates metadata and declared filenames, **not retained media bytes**. The demo-assets action selects original synthetic audio and generated artwork for illustration. It does not submit a real release. Audio mastering specifications and legal rights require independent validation.

## Media provenance

Generic studio/concert and headphone imagery was generated for this prototype. Artist-specific imagery now uses local editorial graphics and a credited remote Tyla photograph; see SOUTH_AFRICAN_CONTENT.md. Generic generated people do not identify real artists. The headphone portrait follows the visual direction of the user-supplied references. The original synthetic audio sample is created for the preview and contains no actual interview or third-party recording.
