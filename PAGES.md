# GitHub Pages version

The `github-pages` branch contains a static version of Chowoljoa. The Django application remains on `main`.

## Publish

In the repository's **Settings → Pages**, choose **Deploy from a branch**, select **github-pages**, choose **/docs**, and save.

The default project URL is https://shallwe-dance.github.io/chowoljoa/ (unless a custom domain is configured). Publishing must be enabled in the repository settings; creating this branch alone does not enable Pages.

Only publish `/docs`, which contains the generated HTML, JavaScript, images, and calculation data. No Python server, database, secrets, or uploaded contact attachments are included in that folder. `.nojekyll` disables Jekyll processing.

## Features

- Korean and English home pages and all 42 equipment/stage calculator pages.
- Tablet editing, purification steps, blessing levels, probabilities, and recommendations run in the browser.
- The JavaScript probability engine and tablet traversal are checked against the Django implementation. Recommendations use the same precomputed expectation CSV and fallback behavior.
- Contact links open GitHub Issues, where submissions are public and require a GitHub account. Private contact messages, uploads, and Django admin are available only in the Django version.
- URLs are relative, so the site works under `/chowoljoa/` or a custom domain.

## Build and preview

Python 3.10+ and Django 5.2.3 are needed only to build. Node.js is needed for parity tests.

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python tools/build_pages.py
python tests/check_pages.py
python -m http.server 8000 --directory docs
```

Open http://localhost:8000/. Use HTTP instead of opening HTML files directly, because the calculator fetches its local expectation CSV. Styles use the existing Tailwind CDN, so an internet connection is needed for styling.

Edit the Django templates/assets or `pages/calculator.js`, rebuild, run the checks, and commit the updated `docs/` folder together with the source changes. The build deliberately replaces the server contact form and API calls, validates starting tiles, and generates shared scripts. It does not modify the Django templates.

For optional DOM interaction tests, install `jsdom` in a temporary directory and run `tests/check_pages_dom.cjs` with `NODE_PATH` pointing to that directory's `node_modules`.
