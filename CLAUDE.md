# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a personal blog (CP's Blog) built with Jekyll and hosted on GitHub Pages at `cpyeh.github.io`. There is no build step to run locally beyond standard Jekyll commands.

## Development Commands

```bash
# Serve locally with live reload (available at http://localhost:4000)
jekyll serve

# Build static site to _site/
jekyll build
```

Deployment is automatic: pushing to the `master` branch triggers GitHub Pages to build and publish the site.

## Architecture

### Content

- **`_posts/`** — Blog posts in Markdown with YAML front matter. Filename format: `YYYY-MM-DD-slug.markdown`. Jekyll auto-routes these to `/YYYY/MM/DD/slug/`.
- **`_archive/`** — Unpublished/archived posts (not processed by Jekyll).
- **`projects.md`** — Static projects page, routed via `permalink: /projects/` in front matter.
- **`index.html`** — Homepage listing all posts.

### Layouts and Includes

- **`_layouts/default.html`** — Base template; all others extend this.
- **`_layouts/post.html`** — Blog post template; supports optional per-post D3.js and custom JS/CSS via front matter flags.
- **`_layouts/visualization.html`** — Embeds an iframe for standalone interactive content.
- **`_includes/`** — Partials: `head.html`, `header.html`, `footer.html`.

### Styles

SCSS lives in `_sass/` and is imported through `css/main.scss`:
- `_base.scss` — Reset and typography (base font size 16px).
- `_layout.scss` — Layout and component styles. Responsive breakpoints: `$on-palm: 600px`, `$on-laptop: 800px`. Brand color: `#2a7ae2`.
- `_syntax-highlighting.scss` — Code block styles.

### Per-Post Assets

Posts can load extra JS/CSS by setting front matter fields:

```yaml
d3_js: True                    # loads D3.js v3 from CDN
extra_javascript: pyramid.js   # loads /assets/<filename>
extra_css: pyramid.css         # loads /assets/<filename>
```

Asset files go in `assets/`.

### Site Configuration

`_config.yml` sets the site title, description, base URL (`http://cpyeh.github.io`), and Kramdown as the Markdown processor.
