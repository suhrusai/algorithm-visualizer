# Algo Visualizer

An interactive site for learning algorithms: watch them run step by step on a
live visualization, synced line-by-line with their pseudocode.

Built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

**Live site:** https://suhrusai.github.io/algorithm-visualizer/

## What's here

- **Sorting algorithms**: Bubble, Selection, Insertion, Merge, Quick, and Heap
  sort. Each has:
  - A bar-chart visualization with play/pause, step forward/back, seek,
    speed control, adjustable array size, and reshuffle.
  - Pseudocode with the active line highlighted as the algorithm runs.
  - Time/space complexity and stability info.

More categories (searching, graphs, trees) are stubbed out in the sidebar for
future work.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site
and deploys it to GitHub Pages via GitHub Actions.

One-time repo setup: in **Settings → Pages → Build and deployment**, set
**Source** to **GitHub Actions**.

## Adding a new sorting algorithm

1. Add a file under `src/algorithms/sorting/` that exports a `SortAlgorithm`
   (see `src/types/sorting.ts`) — implement `run(array)` to return a list of
   `SortStep`s (array snapshot + which indices are being compared/swapped/
   sorted + the pseudocode line to highlight).
2. Register it in `src/algorithms/sorting/index.ts`.

The visualizer, controls, and pseudocode panel are generic and will pick it
up automatically.
