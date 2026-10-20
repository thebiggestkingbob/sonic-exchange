# SONIC EXCHANGE architecture

Greenfield implementation. No source, data, credentials or services are shared with the independent prototype.

## Stack

Next.js App Router, React, strict TypeScript, CSS design tokens, Lucide icons. Vercel preview target. Client-side domain reducer owns serializable demo state; localStorage persists only demonstration records. Pure domain commands validate permissions and state transitions. Provider interfaces isolate external services. Read-only Next API describes integration readiness. There are no live money or recognition endpoints.

## Routes and navigation order

Home (`/`) and Marketplace (`/marketplace`, `/marketplace/[slug]`) now precede the seven established destinations. See NEXT_CHAPTER_DESIGN.md for the approved new scope, standalone marketplace state, assets and simulations.

1. `/sonic-now`: microphone permissions, listening, explicit sample recognition, history.
2. `/index`: cultural intelligence, rankings, genre velocity, radio chart, search, genre filter, sort, pagination, saved alerts and artist detail.
3. `/artists`: role-gated overview, wallet, releases, deals, royalties, distribution, settings and transparency ledger.
4. `/brands`: discovery, audience filters, offers, bids, agreements and simulated escrow.
5. `/venues`: compliance demonstration, venue search, pull estimate and bookings.
6. `/distribution`: metadata/assets/rights validation, drafts and simulated DSP delivery.
7. `/facts-show`: editorial episodes, sample audio player, labelled earnings illustration, questions and voting.

## Role matrix

| Journey                                     | Visitor       | Artist             | Brand         | Venue         |
| ------------------------------------------- | ------------- | ------------------ | ------------- | ------------- |
| Index, profiles, identification, Facts Show | Read/interact | Read/interact      | Read/interact | Read/interact |
| Releases, payouts, artist settings          | —             | Own demo workspace | —             | —             |
| Offers, agreements, simulated escrow        | —             | Accept own offer   | Create/fund   | —             |
| Booking                                     | —             | Accept own request | —             | Request/fund  |

Role switching is explicitly a demo control, **not authentication**. State belongs to the current browser, never a shared production database. Server write endpoints are deliberately absent. A live implementation must replace this with authenticated server authorization and per-tenant data isolation.

## Entities and contracts

Real South African artist/song references with simulated ranked observations, history entries, saved alerts, releases with metadata and rights, deals, bookings, demo wallet and append-only transaction ledger, episodes, votes, questions and preferences. All money uses integer cents. Commands refuse unauthorized roles, invalid amounts, negative balances, invalid release rights and duplicate/invalid transitions. Funding debits the demo balance atomically; cancellation refunds exactly once. Local storage is versioned and validated; unavailable storage falls back to session memory with a visible notice.

## Visual system

White, near-black and Helvetica Neue/Arial, now using the approved Electric candy gradients, editorial typography, photographic cover treatments and refreshed workspace introductions. The latest user request adds Home and Marketplace while preserving the seven established destinations. New schemas and seeded figures describe the prototype only; absent original functional screenshots mean exact legacy semantics cannot be verified.

## Verification

Each phase runs lint, strict typecheck, domain tests and production build. Browser tests cover discovery, persistence, role gates, microphone failure, offer/booking state machines, release validation, participation and mobile navigation. Capture desktop (1440), tablet (768), mobile (390), check keyboard focus, reduced motion, contrast, overflow and empty states. No external provider is claimed live.
