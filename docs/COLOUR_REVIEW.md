# Colour-only review of the actual platform

The approved Electric candy gradient is the default product appearance. Existing layout, typography, spacing, content, navigation and feature behaviour are preserved. Palette values are CSS custom properties whose fallback is the original colour.

The following URLs opt into a review-only comparison overlay:

- `/index?look=electric`: approved purple, pink and coral gradients
- `/index?look=sunset`: berry, orange and gold gradients
- `/index?look=tropical`: teal, blue and violet gradients
- `/index?look=midnight`: charcoal and violet
- `/index?look=studio`: warm ivory and aubergine
- `/index?look=ocean`: white, pale blue and blue accents
- `/index?look=original`: original lavender appearance

The overlay floats above the page without taking layout space. The selected palette remains active across client-side destination navigation; buttons update the current URL so a choice can be shared. Closing the overlay restores Electric candy. An ordinary full-page load without a `look` parameter uses Electric candy, including direct links to every destination.

These are real application renders, not generated concept images. Desktop captures of all seven destinations and mobile INDEX captures live in `docs/style-review/`. Automated browser checks compare main-page bounding boxes before and after each palette and run accessibility checks. Remote artist imagery is blocked during deterministic screenshot tests, so those captures show bundled artist-specific fallback artwork.

For the updated deployed preview, append `?look=midnight`, `?look=studio` or `?look=ocean` to its INDEX URL. Earlier immutable deployments do not contain this review control and cannot show these options.
