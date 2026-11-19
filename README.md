# Seymour Searcher

The web app for Seymour Searcher, a collection tracker and marketplace for Seymour's Special Armor on Hypixel SkyBlock. Players sign in with Discord, upload their dyed armor pieces, see which sets their colours could complete, and trade pieces through buy and sell orders.

Built with Next.js 16 (App Router), React 19 and TypeScript. All data comes from the [Seymour Searcher API](https://github.com/SeymourSearcher/backend).

## Pages

| Route | What it shows |
|---|---|
| `/` | Landing page and global collection stats |
| `/items` | Your collection, set progress and custom sets, with upload and sell actions |
| `/hex/[hexcode]` | One colour: closest armor matches, owners, auction stats and past sales |
| `/search` | Hex pattern search (`21????`, `XXYYZZ`) |
| `/marketplace` | Buy and sell orders, and orders your collection can fill |
| `/auctions` | Active and ended Seymour auctions, bid feed and peak times |
| `/ranking` | Collector leaderboards |
| `/faq` | Frequently asked questions |

## Getting started

You need Node.js 22 and a running backend (see its README).

```bash
npm ci
cp .env.local.example .env.local   # then fill in the values below
npm run dev                         # http://localhost:3000
```

## Configuration

`NEXT_PUBLIC_*` variables are inlined at build time, so set them before `npm run build`, not only at runtime. A missing required variable fails the build.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | no | Backend base URL, default `http://localhost:8000` |
| `NEXT_PUBLIC_DISCORD_CLIENT_ID` | yes | Client ID of your Discord application |
| `NEXT_PUBLIC_DISCORD_REDIRECT_URI` | no | OAuth callback, normally `<frontend URL>/auth/callback`. Must match the backend and Discord settings |
| `NEXT_PUBLIC_POSTHOG_KEY` | no | PostHog (EU Cloud) project API key. Unset disables analytics entirely |
| `NEXT_PUBLIC_FRONTEND_URL` | no | Public site URL for canonical links, the sitemap and Open Graph tags, default `http://localhost:3000` |
| `INTERNAL_API_URL` | no | Backend URL for server-side rendering, read at runtime. Point it at the backend on the internal network (e.g. `http://backend:8000`) so page renders skip the CDN and the API's per-IP rate limits. Defaults to `NEXT_PUBLIC_API_URL` |

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Project layout

```
src/
  app/          routes; each folder holds its page and page-specific components
  components/   shared UI (hex swatches, search, auctions, icons, primitives)
  hooks/        data and auth hooks
  lib/          API client, auth, env validation, SEO helpers
  types/        shared TypeScript types
public/         static assets
```

## Docker

The image builds a standalone Next.js server. Because the `NEXT_PUBLIC_*` values are baked in during the build, put them in `.env.production` in the build context first.

```bash
docker build -t seymour-frontend .
docker run -p 3000:3000 seymour-frontend
```

## Contributing

Issues and pull requests are welcome. Run `npm run lint` and `npm run build` before opening a pull request.

## License

[GPL-3.0-or-later](LICENSE).
