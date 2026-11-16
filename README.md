# Vansh Sheth — Editorial Edition

An independent, static editorial portfolio for **Vansh Sheth** — cybersecurity student and aspiring SOC analyst. Warm paper, ink typography, vermilion accents, Swiss/brutalist grid, and a hand-built ink-trace cursor.

This edition lives in its own folder and has no dependency on, or connection to, any other portfolio in the workspace.

## Stack

- HTML5
- CSS3 (custom properties, grid, clamp-based type)
- Vanilla JavaScript (no framework, no build step)
- Locally hosted variable fonts: **Fraunces**, **Inter**, **JetBrains Mono**
- Deployable to GitHub Pages or any static host

No analytics, cookies, tracking, backend, or runtime external requests.

## Structure

```
editorial-portfolio/
├── index.html
├── css/
│   ├── style.css        # type system, layout, sections, responsive rules
│   └── animations.css   # reveals, pulse, ripple, reduced-motion handling
├── js/
│   ├── main.js          # nav, scrollspy, reveals, magnetic buttons, clock, copy
│   ├── cursor.js        # INK TRACE custom cursor
│   └── terminal.js      # simulated terminal easter egg
├── assets/
│   ├── fonts/           # 4 local .woff2 files (Latin subset)
│   ├── images/
│   │   ├── favicon.svg
│   │   └── og.png
│   └── VANSH_CV.pdf     # ← not included; add your real résumé here
└── README.md
```

## Run locally

Open `index.html` directly in a browser, or serve the folder (recommended, so fonts and the clipboard API behave exactly as on the web):

```bash
cd editorial-portfolio
python -m http.server 8000
```

Then visit `http://localhost:8000`.

Any static server works, for example:

```bash
npx serve editorial-portfolio
```

## Deploy independently

### GitHub Pages (project site)

1. Push the contents of `editorial-portfolio/` to its own repository, or keep this folder in a larger repository.
2. In **Settings → Pages**, choose **Deploy from a branch**.
3. Select the branch and set the folder to `/` (if the folder is the repository root) or `/editorial-portfolio` (if it is a subfolder).
4. Save. The site will be published at `https://<user>.github.io/<repo>/` or `https://<user>.github.io/<repo>/editorial-portfolio/`.

All paths are relative, so a subpath deployment works without configuration. There are no server-side routes, so no `.nojekyll` workaround is needed.

### Any static host

Upload the folder to Netlify, Vercel (static), Cloudflare Pages, or a plain web server. No build command is required.

## Résumé asset — action required

The download controls expect the file at:

```
editorial-portfolio/assets/VANSH_CV.pdf
```

That PDF is **not present in this workspace**, so the three résumé links (header, hero, contact) will currently 404 until the real file is added. No résumé was generated or fabricated. Drop the real PDF at that exact path and the links work with no code changes.

## Features

- **INK TRACE cursor** (desktop only): ink dot, vermilion ring, cobalt afterimages, hover expansion, contextual `VIEW` state on project rows, click ripple. Disabled for touch and `prefers-reduced-motion`.
- **Editorial terminal** (`Ctrl + \``, the `>_` header button, the footer link, or the spider illustration): `help`, `whoami`, `about`, `skills`, `projects`, `contact`, `resume`, `ls`, `clear`, `exit`. Frontend-only; it cannot run system commands.
- **ASCII spider** in the dark interlude — click it for a terminal easter egg.
- Active-section navigation, scroll progress bar, mobile menu with Escape handling and focus return.
- Copy-email interaction with clipboard fallback and a live status message.
- Live Indian Standard Time clock via `Intl.DateTimeFormat` with `Asia/Kolkata`.
- Accessible semantics, skip link, visible focus states, keyboard-operable terminal, reduced-motion support.

## Content notes

- Skill levels are described qualitatively only; no invented percentages or ratings.
- Certifications are listed without fabricated dates, IDs, or verification URLs.
- Projects without a verified public repository link to `github.com/once0626`.
- The Open Graph image and canonical URL use the expected GitHub Pages path (`https://once0626.github.io/editorial-portfolio/`). Update these in `index.html` if deployed elsewhere.

## Font credits

Fraunces, Inter, and JetBrains Mono are licensed under the SIL Open Font License and served locally from `assets/fonts/`.
