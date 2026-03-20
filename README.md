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

### Slide layout editor

Each slide has a layout selector at the top of its editor panel. Choose from 10 predefined layouts, each shown as an SVG wireframe thumbnail:

| Layout | Description |
|---|---|
| Title Only | Large h1 with subtitle |
| Kicker + Title | Section label, heading, and subtitle |
| Statement | Large statement or quote text |
| Card Grid | Heading with card items |
| Two Columns | Heading with two content columns |
| Statistics | Key figures with labels |
| Timeline | Phases in a timeline grid |
| Highlight Box | Heading with highlighted content box |
| Blank | Empty slide for custom HTML |

When you switch layouts, the editor preserves content where possible — headings, kicker text and colour, subtitles, items, stats, timeline phases, and two-column content are carried over to the new template. A confirmation dialog prevents accidental switches.

### Color palettes

Apply a colour palette to the entire deck. Eight built-in palettes are available:

- **Ocean** — deep blue with teal accents
- **Midnight** — dark purple with vibrant accents
- **Forest** — deep green with natural tones
- **Ember** — warm darks with fiery accents
- **Light** — clean light background
- **Charcoal** — neutral grey with vivid accents
- **Corporate** — navy with classic blue
- **Sunset** — warm gradient-inspired

Click **Palette** in the toolbar to open the palette picker. The selected palette updates CSS custom properties across all slides.

### Deck logo

Add a logo to every slide in the deck:

1. Enter the logo image URL in the toolbar input
2. Click **Apply All** to add it to every slide
3. Click **Remove** to strip logos from all slides

The editor auto-detects an existing logo from the first slide when opening a file.

### Slide management

- **Add slide** — the **+ Slide** button adds a new slide with a default kicker + heading + subtitle layout
- **Reorder** — move slides up or down using the arrow buttons on each thumbnail
- **Duplicate** — copy a slide with all its content
- **Delete** — remove a slide (with confirmation)

### File operations

- **New** — create a new deck from a built-in template with full presentation styling, keyboard navigation, progress bar, and animation support
- **Open** — browse your filesystem and open any `.html` file
- **Save / Save As** — write back to disk; unsaved changes are indicated in the toolbar
- **File browser** — navigate directories and select files visually

### Live preview

A scaled preview of the active slide is shown in the editor. Toggle it open or collapsed.

### Print / export

Click **Print** to open the deck in a new window formatted for printing — all slides rendered on separate landscape pages with UI elements hidden.

### Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Cmd/Ctrl + S` | Save file |
| `Cmd/Ctrl + O` | Open file |

## API

The server exposes a minimal REST API used by the front end:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/browse?dir=<path>` | List subdirectories and HTML files at a path |
| `GET` | `/api/files?dir=<path>` | List HTML files only |
| `GET` | `/api/file?path=<path>` | Read an HTML file |
| `POST` | `/api/file` | Write an HTML file (`{ path, content }`) |
