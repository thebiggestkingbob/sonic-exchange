# SONIC EXCHANGE — Home and Marketplace

The user's latest direction supersedes the master brief's earlier restriction against new navigation and commerce pages: add a dedicated Home and Marketplace using the supplied homepage and asset-detail references, while keeping the existing destinations and workflows. The independent prototype was not accessed.

## Routes

- `/`: new editorial landing page, featured demo assets, South African artist momentum links, SONIC NOW introduction and workspace entry points.
- `/marketplace`: searchable six-asset catalogue, genre/format filters, price ordering, saved crate and demo collection.
- `/marketplace/[slug]`: asset artwork, actual audio preview, six information tabs, separate sync/master/publishing options, local simulated checkout and offers.
- `/index`: the existing cultural intelligence page, including its search query and every ranking/profile action. It now rewrites internally to `/cultural-index`, keeping the public URL stable. A literal Next.js `/index` filesystem route caused a client-manifest build error, so it is not used.
- `/sonic-now`, `/artists`, `/brands`, `/venues`, `/distribution`, `/facts-show`: same role permissions, entities, workflows and features; refreshed shared navigation, introductory panels, gradient buttons and presentation.

## Visual direction

Electric candy remains the palette. The new system adds an editorial type hierarchy, a photographic gradient hero, a vinyl feature, original cover treatments, an artist momentum feature and deliberate light/dark section rhythm. Shared rules live in `src/app/exchange-design.css`; the original workspace CSS is retained. Mobile navigation wraps all nine destinations into an accessible menu; the asset purchase panel moves into the content flow on smaller screens.

## Interaction and state

`src/lib/marketplace.ts` defines six fictional South African studio listings, rights options, integer-cent prices, state parsing and validated pure transitions. `MarketProvider` owns a separate versioned browser-local store, avoiding migration or changes to existing wallet/ledger logic. The shared reset clears both demo stores. Duplicate purchases of the same asset/licence are rejected. Different rights options have distinct prices and terms. Checkout requires explicit acknowledgement that it is simulated. Offers validate amount and project description, remain pending locally, and are not sent anywhere. Collection and saved-item state survive reloads.

The preview file `public/audio/market-demo.wav` is an original 12-second synthesized audio demonstration created for this prototype. The same sample is used for each fictional listing, labelled on the page/player. It is not a recording by any real artist. The file download is either this WAV preview or a JSON information manifest. It does not pretend to supply commercial stems or a legal agreement.

Existing real South African artist/song references remain in INDEX and the landing page's cultural section. Fictional marketplace creators and sale listings are deliberately distinct; no rights in Kabza De Small, Tyla, A-Reece or other real artists' work are implied to be for sale.

## Integrations and limitations

No real payments, escrow, ownership transfers, seller verification, contract execution, market valuations, live fan metrics, commercial masters or seller publishing flow have been connected. The creator CTA opens the existing artist workspace. Market offers are not transmitted to sellers. Earnings potential is an explicitly hypothetical gross sync-licensing calculator, before costs and splits. Production requires actual seller onboarding, rights clearance, media storage, payment and legal integrations.

## Verification and review

- Lint, strict TypeScript, production build and domain validation.
- Four marketplace domain tests cover integer-cent validation, distinct rights prices, duplicate prevention, immutable state, invalid storage and reset.
- Seven marketplace browser tests cover navigation, filter/sort/empty states, persisted saves, real audio playback, checkout acknowledgement, separate rights, offers, downloads, reset, 404s and accessibility/overflow at desktop/tablet/mobile sizes.
- The 20 existing browser tests cover all established destination workflows and colour options.
- Actual screenshots: `docs/next-chapter/` (three new screens at three viewports); high-resolution review captures are also provided in chat.

No deployment was performed for this revision. Review the new screens before a separate preview deployment. The previous production remains the approved Electric candy version. Rollback of the code change is a normal revert of the redesign commit; do not overwrite or force-push the main branch.
