# Elias Champi

Personal portfolio and CV at [eliaschampi.github.io](https://eliaschampi.github.io/).

A buildless, responsive site in Spanish and English. It presents Coedula, Faztore, Aeduca, and a selection of libraries and experiments. Private source stays private; product links lead to public websites.

## Develop

Serve the directory with any static HTTP server. No package installation or build step is required.

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173`. Check whether that port is already in use before starting another server.

## Files

- `index.html`: semantic content and Spanish fallback.
- `styles.css`: layout, project illustrations, responsive styles, and motion preferences.
- `app.js`: language selection, project filters, mobile navigation, and color playground.
- `translations.js`: portfolio copy in both languages.
- `cv.html`: bilingual CV with an A4 print layout.
- `assets/`: local fonts, font licenses, and favicon.

Spanish is the default. `?lang=es` and `?lang=en` select a language explicitly; the preference persists locally and is carried into the CV. The source PDFs, private identifiers, and credentials are not part of this repository.

## Publish

GitHub Pages serves `main` from the repository root. `.nojekyll` keeps the deployment static. Commit and push changes to publish them.

The interface illustrations are original visual studies, not product screenshots or business metrics. Manrope and DM Mono are distributed under the licenses included in `assets/`.
