# SONIC EXCHANGE — Sound World direction

## User story

A first-time visitor enters an abstract, motion-led music world, understands what SONIC EXCHANGE does, chooses an appropriate starting point, and follows it into the existing working platform. The new public introduction replaces the previously rejected editorial Home direction; Marketplace and the seven established destinations retain their features and routes.

The user supplied a YouTube Short as a reference. Retrieval was throttled, so the video was not viewed and no visual details are attributed to it. This implementation interprets the user's explicit request for an abstract new world, motion and an understandable first-time introduction.

## Experience

- Dark public header and footer, iridescent colour and an acid-green navigation accent. Existing workspace styling is retained on other routes.
- Procedural sound sculpture with projected three-dimensional geometry, depth ordering, colour variation, ambient particles and pointer response. Rendered locally in Canvas; no external scene or video libraries, tracking, downloaded video, or autoplay audio.
- Slow ambient orbit and typographic motion, section-entry transitions and a visible motion pause control.
- Product explanation, three-step walkthrough, four role-specific starting points, South African artist references, a demo Marketplace introduction and expandable FAQs.
- Role entry sets the correct local demo role and routes into the existing workspace; no account or real authentication is implied.
- FAQs explain what the platform does, where to start and which financial, recognition and data features remain simulated.

## Motion and accessibility

The sculpture respects `prefers-reduced-motion`; it renders a static frame and ignores pointer motion in that mode. CSS motion and smooth scrolling are also disabled for reduced-motion users. The explicit motion control pauses the visual sculpture and ambient CSS animations. Canvas is decorative and excluded from the accessibility tree; essential copy and navigation remain in the HTML. Native links, buttons, details/summary and the existing responsive navigation provide keyboard access. Content remains readable without reveal animation.

Rendering is capped at roughly 25 frames per second and at 1.75 device pixel ratio. Geometry rendering pauses outside the viewport and when the tab is hidden. Resize, intersection, media and pointer listeners and the animation frame are cleaned up on unmount. The existing platform stores and server integration boundaries are unchanged.

## Verification evidence

- Production build, ESLint and strict TypeScript pass.
- All 29 browser tests pass. Two new tests cover the first-time introduction, changing role through the chosen entry point, FAQ disclosure, actual changing canvas pixels, pause, and static reduced-motion rendering.
- Existing browser tests cover Marketplace checkout, local state, every established role workflow, API integration-status response, colour comparisons and keyboard focus.
- Axe WCAG A/AA scans and horizontal overflow checks pass on the new Home, Marketplace and detail page at desktop, tablet and mobile sizes. Two small label contrast issues were repaired.
- Desktop/tablet/mobile Home captures are in `docs/next-chapter/`. Full-resolution desktop and mobile captures and a recorded motion walkthrough are provided in chat.

UI-to-data flow is local by design: role choice calls the existing role command, updates versioned browser state, and opens the chosen workspace. There is no new API request or external dependency to configure. The sculpture and disclosure controls render in the browser; the existing read-only integrations endpoint still reports unconfigured providers.

No preview or production deployment was performed for this direction. The prior production remains unchanged pending design review.
