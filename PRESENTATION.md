# Dripvault presentation notes

## A short walkthrough

1. Start at the hero. Explain the promise: expressive streetwear and a clear route into the collection.
2. Scroll to the products. Show a category filter, hover a card, and open its details.
3. Introduce the brand story: self-expression, individuality, and clothes with presence.
4. Open Fit Lab. Change the mood and explain how the recommended piece, photograph, copy, and accent color update together.
5. Show the mobile layout and the final call to action.

## Why this visual direction

The ink and bone backgrounds give fashion photography room to breathe. Electric lime marks navigation and active states. Condensed uppercase type brings poster energy; italic Georgia adds an editorial rhythm. Numbered labels make the collection feel like a curated archive. Every section uses the same spacing, type roles, color palette, and confident tone.

## How the code works

- **Product data:** four typed objects define each piece. The same objects feed cards, details, and recommendations.
- **Filtering:** React stores the selected category. A filtered array determines which cards render; no request is needed.
- **Fit Lab:** a small mood-to-product mapping connects each mood to its recommendation. Updating one state value changes the full panel.
- **Scroll animation:** IntersectionObserver watches marked sections and reveals each once. A separate passive scroll listener updates the reading progress line.
- **Card tilt:** pointer position is measured relative to the card. Small angles are written into CSS variables and applied with perspective.
- **Dialog:** React stores the open product. Opening moves keyboard focus inside, Tab stays within its controls, Escape closes it, and closing restores focus.
- **Responsive layout:** CSS grids become stacked layouts at smaller widths. The mobile navigation exposes the same section links.
- **Performance:** images are local WebP files, below-fold images load lazily, icons are bundled selectively, and fonts are system fonts.
- **Deployment:** every push to main runs a clean build and deploys its output through GitHub Actions to GitHub Pages.

## Honest project boundaries

This is a brand concept and collection showcase. Prices are illustrative, and there is no payment, customer account, or order processing. The images were supplied as AI generated assets. All commits reflect actual work dates; this repository does not demonstrate three days of development.
