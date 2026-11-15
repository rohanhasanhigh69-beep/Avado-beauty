# Avado Beauty — Frontend Storefront

Pure frontend React + Vite + TypeScript + Tailwind CSS e-commerce storefront for **Avado Beauty** (Bangladesh market, BDT `৳` currency).

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

Output directory: `dist`

## Deploying to Cloudflare Pages / GitHub

1. **If you push the contents of this `frontend` folder directly to your GitHub repo root:**
   - **Root directory**: `/` (leave blank)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

2. **If you push the whole parent folder containing `frontend/` to GitHub:**
   - **Root directory**: `frontend`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
