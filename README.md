# RevGate — Model Collection (Angular 20)

Standalone-component Angular app recreating the RevGate BMW model collection page.

## Run
```bash
npm install
npm start          # http://localhost:4200  → redirects to /brands/bmw
npm run build      # production build in dist/revgate
```

## Routes
| Route | Page |
|---|---|
| `/brands/:brand` | Model collection (data-driven; `bmw` configured) |
| `/brands` | Brand index — BACK fallback when the page is opened directly |
| `/cars/:brand/:slug` | Reusable vehicle detail route (placeholder content) — "View model" |
| `/compare` | Comparison table for models added via "Compare" (max 3, kept per tab) |

## Structure
```
src/app/model-collection/
  model-collection.component.{ts,html,scss}   page shell (header, toolbar, two columns)
  model-collection.models.ts                  BrandCollection, VehicleModel, VehicleImage, VehicleSpecifications
  model-collection.data.ts                    BMW configuration — add a brand here, no new markup needed
  model-collection.store.ts                   signals: query, filters, sort, selection, gallery index
  components/  model-search · model-filter · model-sort · model-sidebar · model-list-item
               model-gallery · model-information · model-navigation
src/app/shared/  icon (inline Lucide paths) · dropdown directive · compare service
src/styles/_tokens.scss                       SCSS variables (colour, type, spacing, breakpoints)
```

## Behaviour notes
- Category tabs and the Filter dropdown share one body-type filter, so they always agree.
- If search/filters hide the selected model, the preview jumps to the first visible match.
- Previous/Next walk the *visible* list and disable at either end.
- "Power: High to Low" appears only once any model has power data.
- Specs are `null` (rendered "—") until verified figures are added to `model-collection.data.ts`.

## Image assets — what exists and what is missing
All images in `public/assets/models/bmw/` were cropped from the reference screenshot:
- `*-thumb.png` — six transparent explorer thumbnails (≈125 px wide; fine at list size).
- `m3-competition-front.jpg` — main hero (948×496).
- `m3-competition-rear.jpg`, `m3-competition-side.jpg` — **only ~320×118**, so they look soft when shown large.

**Missing — please supply** (front ¾, rear ¾, side profile; ≥1900 px wide, same car/colour per set):
- M3 Competition: high-res rear ¾ and side profile
- M2, M4 Competition, M5, X5 M Competition, M4 Convertible: all three views

Until supplied, those models show their thumbnail on a neutral showroom backdrop
labelled "Showroom photography coming soon", and the empty gallery slots are disabled.
