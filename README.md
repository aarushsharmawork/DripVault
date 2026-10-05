# Dripvault — Wear the Difference

**Live site:** https://aarushsharmawork.github.io/DripVault/  
**Repository:** https://github.com/aarushsharmawork/DripVault

## Brand and concept (under 150 words)

Dripvault is streetwear for people who would rather be seen than blend in. Drop 001 presents four expressive staples through a high contrast editorial storefront: electric lime, ink black, oversized display type, and direct, confident copy. The visual system borrows the energy of gig posters and fashion lookbooks. Visitors can filter the collection, inspect each piece, and use the Fit Lab to find a style direction that matches their mood. The experience is designed to feel bold without making navigation or shopping discovery difficult.

## Tech stack

React 19, TypeScript, Vite 8, CSS, and Lucide icons. GitHub Actions builds and deploys the static site to GitHub Pages.

## Interactions and design decisions

- The scroll progress bar, one-time section reveals, and moving mantra create rhythm while respecting reduced-motion preferences.
- Product cards tilt subtly on pointer movement. The effect is disabled for touch and reduced motion.
- Fit Lab changes the recommendation, color accent, image, and copy in response to a mood selection.
- Four product photos were converted to lightweight WebP for faster mobile loading.
- The site is a concept showcase. Product prices are illustrative; there is no checkout or stored customer data.

## Assets and credits

- Fashion imagery: user-supplied AI generated images from the original project, converted to WebP. No stock photography was added.
- Lucide icons: [Lucide](https://lucide.dev/), ISC license.
- Typography uses local system fonts (Impact/Arial/Georgia); no external font requests.
- Layout, copy, CSS artwork, and interaction code were created for this project.
- AI assistance: Codex assisted with design, copy, implementation, and validation.

## Presentation

See [PRESENTATION.md](PRESENTATION.md) for the walkthrough and explanations of the code and design choices.

## Run locally

```bash
npm ci
npm run dev
```

## Production checks

```bash
npm run lint
npm run build
```
