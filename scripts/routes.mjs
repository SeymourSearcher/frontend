// Every route the app must serve, with a concrete URL to request for smoke tests.
// Adding or removing a page means updating this list; see scripts/check-routes.mjs.
export const ROUTES = {
  "/": "/",
  "/auctions": "/auctions",
  "/auth/callback": null,
  "/faq": "/faq",
  "/hex/[hexcode]": "/hex/FF0000",
  "/items": "/items",
  "/marketplace": "/marketplace",
  "/pieces/[slug]": "/pieces/oxford-shoes",
  "/ranking": "/ranking",
  "/robots.txt": "/robots.txt",
  "/search": "/search",
  "/sitemap.xml": "/sitemap.xml",
};
