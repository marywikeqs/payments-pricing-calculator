# Payments Pricing Calculator

Web version of the *Payments Pricing Calculator vFinal (June 2026)* spreadsheet — estimates
monthly recurring revenue (MRR), effective take rate, and net revenue margin for a merchant deal.

## Files
- `index.html` — the single-page app (form + live results, light/dark, mobile-friendly)
- `data.js` — industry benchmarks + seasonality tables extracted from the workbook
- `data.json` — same data as source (not required at runtime)
- `netlify.toml` — static-site publish config

## How it works
Given the deal's monthly GPV, industry, country, and pricing model, the app looks up the
industry's card-channel mix, transaction counts, and interchange costs, distributes the GPV
across channels, and computes revenue = fees collected − interchange − Interac − processor cost.
Rates are editable per deal; outputs match the source spreadsheet exactly.

## Deploy
Static site — Netlify serves `index.html` from the repo root. Any push to `main` auto-deploys.
