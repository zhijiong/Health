# Meal Plan

Personal meal plan tracker with photo check-ins and shared progress.

## Cloud Sync

The app stores check-ins through `api/sync.js`, which needs a serverless host such as Vercel.

Set one of these environment variable pairs in the deployment:

- `KV_REST_API_URL` and `KV_REST_API_TOKEN`
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

Opening `index.html` directly with `file://` or hosting only on GitHub Pages can show the app, but it cannot run `/api/sync` by itself.

If you use GitHub Pages for the static page and Vercel for sync, open the page once with:

```text
https://zhijiong.github.io/Health/?sync=https://your-vercel-app.vercel.app
```

The app remembers that sync server in the browser after the first visit.

## Project Layout

- `index.html` — the meal plan app
- `api/sync.js` — serverless sync endpoint
- `assets/` — app icons
- `.env.example` — required sync environment variable names
