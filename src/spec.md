# Specification

## Summary
**Goal:** Add the Google AdSense verification/loader script (client ID `ca-pub-5965886176480370`) to the CurrencyPal site’s document `<head>` so it loads on initial page load for all SPA routes without duplicates.

**Planned changes:**
- Ensure a single `<script async ...>` tag is injected/present in the document `<head>` with `src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5965886176480370"` and `crossorigin="anonymous"`.
- Prevent duplicate AdSense loader script tags from being added when navigating between React SPA routes/pages.
- Update `frontend/.env.example` to set `VITE_ADSENSE_CLIENT_ID=ca-pub-5965886176480370` by default, while keeping the existing environment-variable-based loading behavior.

**User-visible outcome:** The site passes AdSense code-snippet verification by having the required AdSense script present in the `<head>` on first load across all pages/routes, without multiple script tags being created during navigation.
