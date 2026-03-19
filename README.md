# HTML Slides Editor

A local, browser-based WYSIWYG editor for single-file HTML slide decks. Open an HTML file, edit slide content through structured form fields, and save — no build step, no cloud.

## How it works

The editor runs a small Express server that reads and writes HTML files on your local filesystem. The front end parses each `.slide` element inside a `.deck` container and presents editable fields for recognised patterns (headings, kickers, cards, timelines, stats, etc.). Changes are reflected in a live preview and thumbnail strip.

## Getting started

```bash
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

| Environment variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port the server listens on |
| `SLIDES_DIR` | Current working directory | Default directory shown when opening files |

Example:

```bash
SLIDES_DIR=~/presentations PORT=8080 npm start
```

## Expected HTML structure

Your slide deck file needs this structure for the editor to parse it correctly:

```html
<div class="deck" id="deck">
  <div class="slide" data-slide="0">
    <!-- slide content -->
  </div>
  <div class="slide" data-slide="1">
    <!-- slide content -->
  </div>
</div>
```

### Supported slide elements

The editor auto-detects and renders form fields for these CSS classes/elements:

| Element | Field type |
|---|---|
| `.kicker` | Text + colour select |
| `h1` | Text |
| `h2` | Text |
| `.subtitle` | Textarea |
| `.statement` | Rich text (HTML) |
| `.meta` | Text |
| `.year-tag` | Text |
| `.items > .item` | Card list (tag, title, description) |
| `.timeline-phase` | Phase label, title, description, list items |
| `.stat` | Stat value + label pairs |
| `.highlight` | Rich text (HTML) |

Every slide also exposes a raw HTML textarea as a fallback for anything not covered above.

## Features

- **File browser** — navigate your filesystem and open any `.html` file
- **Slide thumbnails** — visual sidebar showing all slides, with reorder (up/down), duplicate, and delete actions
- **Live preview** — scaled preview of the active slide, toggleable
- **Save / Save As** — write back to disk; unsaved changes are indicated in the toolbar
- **Keyboard shortcuts** — `Cmd/Ctrl+S` to save, `Cmd/Ctrl+O` to open

## API

The server exposes a minimal REST API used by the front end:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/browse?dir=<path>` | List subdirectories and HTML files at a path |
| `GET` | `/api/files?dir=<path>` | List HTML files only |
| `GET` | `/api/file?path=<path>` | Read an HTML file |
| `POST` | `/api/file` | Write an HTML file (`{ path, content }`) |
