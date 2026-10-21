# Three moving design directions

The user requested genuinely different design options with visible motion. These are separate, working review pages, not palette changes to one screen and not AI-generated mockups. No option has replaced the current Home or been deployed.

## Review routes

- `/design-lab`: comparison page linking to all three studies.
- `/design-lab/liquid` — **Liquid Universe**: pastel pink/lilac world, large organic morphing forms, floating satellites, pointer response and a moving message strip.
- `/design-lab/kinetic` — **Culture in Motion**: black/acid-yellow music editorial, opposing continuously scrolling artwork columns, bold oversized type, a rotating badge and moving typography.
- `/design-lab/chrome` — **Future Frequency**: central metallic sculpture, three independently rotating rings, reflective gradients, a light spatial grid, moving shadows and pointer response.

Each study has a bespoke visual treatment and layout, product introduction, three-step explanation, four role-specific entry points, functional FAQs, links into the existing platform and a floating comparison control. Choosing a role and following its CTA updates the existing demo role before opening its workspace. Product routes, business rules, wallet/escrow states and existing Home remain unchanged.

## Motion

Motion is actual CSS animation, not a pre-rendered background video. It is visible while idle and responds to pointer/scroll interactions where appropriate. The kinetic artwork sequence duplicates its prints for a seamless loop. The chrome sculpture uses CSS gradients, masks and transforms rather than adding a 3D dependency.

Every study has a pause/resume button. `prefers-reduced-motion` disables CSS animation and transition effects and JS pointer/parallax updates. Essential copy remains visible without reveal effects. Scroll updates use requestAnimationFrame and pointer listeners are cleaned up on unmount. No scroll-jacking or autoplay audio is introduced.

## Evidence

Production build, ESLint and strict TypeScript pass. Thirteen new browser tests cover changing transforms while animating, stable transforms after pause, reduced-motion animation removal, role entry, FAQ interaction, comparison navigation, browser errors, horizontal overflow and axe WCAG A/AA at desktop and mobile sizes. Three existing tests check global search, keyboard/mobile navigation and the read-only integration-status API. All 16 scoped tests pass.

Actual full-page captures are in `docs/design-directions/`. Short recordings, animated hero previews and high-resolution screenshots are supplied in chat for comparison. One header contrast issue in the kinetic study was repaired before the final passing test run.

The studies are browser-local prototypes. Existing platform simulations and live-integration boundaries are preserved and explained. No production or preview deployment was performed for these studies.
