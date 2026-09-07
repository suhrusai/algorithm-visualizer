# Algo Visualizer

An interactive site for learning algorithms: watch them run step by step on a
live visualization, synced line-by-line with their pseudocode.

Built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

**Live site:** https://suhrusai.github.io/algorithm-visualizer/

## What's here

- **Sorting**: Bubble, Selection, Insertion, Merge, Quick, and Heap sort. Bars
  physically slide between positions as elements move.
- **Searching**: Linear, Binary, Jump, and Interpolation search, showing the
  active window and eliminated elements as the search narrows in.
- **Graph**: Breadth-first search, depth-first search, and Dijkstra's algorithm
  on a small weighted graph, with the frontier, visited set, and running
  distances shown at each step.
- **Trees**: Binary search tree insertion and lookup, plus in-order, pre-order,
  post-order, and level-order traversals.

Every visualization has play/pause, step forward/back, seek, and speed
controls, and pseudocode with the active line highlighted as the algorithm
runs.

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
