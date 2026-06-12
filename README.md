# AI Content Generation Studio


## Features

- **Prompt-based generation** — describe what you want and generate multiple images at once
- **Corkboard UI** — wooden frame, cork texture, pinned sticky notes, and polaroid cards
- **Generation controls**
  - Image / Video mode toggle
  - Image count (1, 2, 4, 8)
  - Aspect ratios: `1:1`, `4:3`, `16:9`, `9:16`
  - Model selector (Flux Pro, SDXL, DALL·E 3, Midjourney)
  - Collapsible **Styles** and **Advance** panels (steps, guidance)
- **Live gallery** — generated results appear as tilted polaroid postcards with hover overlays
- **History panel** — browse past generations with lightbox preview
- **Light / Dark mode** — full corkboard theme with persisted preference
- **Keyboard shortcut** — `⌘ Enter` / `Ctrl + Enter` to generate
- **Fully responsive** — optimized layouts for desktop, iPad, and mobile
- **Accessible** — focus states, ARIA labels, `aria-live` regions, reduced-motion support

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| UI Library | [React 19](https://react.dev/) |
| Language | JavaScript (no TypeScript) |
| Styling | [Tailwind CSS 3](https://tailwindcss.org/) + CSS Modules |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter), [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) via `next/font` |
| Images | `next/image` with remote optimization |
| State | React `useState`, `useReducer`, `useCallback` (no external state library) |
| API | Next.js Route Handlers (`/api/generate`) |
| Linting | ESLint + `eslint-config-next` |

### Design approach

- **CSS custom properties** for colors, shadows, and theme tokens (`globals.css`)
- **Component-scoped animations** via CSS Modules (`@keyframes`, transitions)
- **No UI icon libraries** — inline SVGs and minimal Unicode symbols
- **Dummy API** — simulates generation delay and returns Unsplash placeholder images

---

## Project Structure

```
ai-content-generator/
├── public/
│   └── logo.png                 # Static logo asset
├── src/
│   ├── app/
│   │   ├── api/generate/
│   │   │   └── route.js         # POST endpoint for image/video generation
│   │   ├── globals.css          # Design tokens, reset, theme variables
│   │   ├── layout.js            # Root layout, fonts, ThemeProvider
│   │   ├── page.js              # Main corkboard page (orchestration)
│   │   └── page.module.css      # Corkboard layout & responsive breakpoints
│   ├── assets/
│   │   └── logo.png
│   ├── components/
│   │   ├── GalleryGrid/         # Polaroid result grid
│   │   ├── Lightbox/            # Full-screen image preview modal
│   │   ├── controls/            # Reusable control widgets
│   │   ├── history/             # History grid/panel components
│   │   ├── layout/              # Navbar, mobile header, panels
│   │   └── icons/               # Inline SVG icon set
│   ├── context/
│   │   └── ThemeContext.js      # Light/dark theme with localStorage
│   ├── hooks/
│   │   ├── useGenerate.js       # Generation state machine
│   │   ├── useHistory.js        # In-session history
│   │   └── useKeyboardShortcut.js
│   ├── lib/
│   │   └── constants.js         # Prompt defaults, options, sample history
│   └── utils/
│       ├── buildPicsumUrl.js    # Picsum URL helpers
│       └── formatDate.js        # Date formatting utility
├── next.config.mjs              # Image remote patterns
├── tailwind.config.js           # Tailwind breakpoints & tokens
├── postcss.config.js
├── jsconfig.json                # `@/` path alias
└── package.json
```

---

## Prerequisites

Before running the project, make sure you have:

- **Node.js** 18.18 or later (Node 20+ recommended)
- **npm** 9+ (comes with Node.js)

Check your versions:

```bash
node -v
npm -v
```

---

## Getting Started

### 1. Clone or navigate to the project

```bash
cd ai-content-generator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production

```bash
npm run build
npm start
```

The production server also runs on [http://localhost:3000](http://localhost:3000) by default.

---

## Available Script

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server with hot reload |


---

## How It Works

### Generation flow

1. User enters a prompt in the center paper textarea.
2. Settings (count, ratio, model, style) are read from the left sticky-note controls.
3. On **Generate** (or `⌘/Ctrl + Enter`), the app sends a `POST` request to `/api/generate`.
4. The API waits ~900ms, then returns sample image URLs from Unsplash based on the selected aspect ratio.
5. Results replace the gallery grid; the prompt is saved as the faded background text on the paper.
6. Clicking any polaroid opens the **Lightbox** for a full-size preview.

### Sample data on load

The page loads with **8 sample portrait images** in the gallery and a long default prompt so the UI is never empty on first visit.

---

## Responsive Layouts

| Breakpoint | Layout |
|------------|--------|
| **Desktop** (>1194px) | 3 columns: controls · prompt · gallery. History in a full-width footer bar. |
| **iPad** (768px–1194px) | 3 columns with a dedicated left sidebar. History sits below controls (4 thumbnails per row). Gallery uses a compact 2-column polaroid grid. |
| **Mobile** (≤767px) | Top bar + 2-column prompt/gallery. Controls in a slide-out menu. History in the bottom footer. |
| **Small mobile** (≤640px) | Single-column stack: prompt above gallery. |

---

## Theming

The app supports **light** and **dark** corkboard themes.

- Toggle via the pinned **Dark mode / Light mode** note in the header.
- Preference is saved to `localStorage` under the key `nova-theme`.
- Theme is applied via `data-theme="light"` or `data-theme="dark"` on the `<html>` element.
- CSS variables in `globals.css` swap cork, wood, paper, and text colors automatically.

---

## API Reference

### `POST /api/generate`

Simulates AI content generation and returns placeholder media.

**Request body:**

```json
{
  "prompt": "A portrait of a woman in golden hour light",
  "type": "image",
  "count": 4,
  "aspectRatio": "1:1",
  "model": "Flux Pro"
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `prompt` | string | `""` | User prompt text |
| `type` | `"image"` \| `"video"` | `"image"` | Content type |
| `count` | number | `4` | Number of results (clamped 1–8) |
| `aspectRatio` | string | `"1:1"` | `1:1`, `4:3`, `16:9`, `9:16` |
| `model` | string | `"Flux Pro"` | Selected model label |

**Success response (`200`):**

```json
{
  "success": true,
  "prompt": "A portrait of a woman in golden hour light",
  "model": "Flux Pro",
  "aspectRatio": "1:1",
  "type": "image",
  "items": [
    {
      "id": "image-1710000000000-0",
      "type": "image",
      "src": "https://images.unsplash.com/photo-...?w=500&h=500&fit=crop&sig=0",
      "alt": "Generated image 1 for: A portrait of a woman..."
    }
  ]
}
```


---

## Configuration

### Remote images (`next.config.mjs`)

Allowed image hostnames:

- `images.unsplash.com`
- `picsum.photos`
- `sample-videos.com`

Add new hosts to `images.remotePatterns` if you connect a real AI provider.

### Path alias (`jsconfig.json`)

```json
"@/*": ["./src/*"]
```

Import project files as:

```js
import GalleryGrid from "@/components/GalleryGrid/GalleryGrid";
```

### Constants (`src/lib/constants.js`)

Central place for:

- Default prompt text
- Image count / aspect ratio / model / style options
- Sample history thumbnails

---



Run via the local binary:

```
npm run dev
```


Use only in trusted dev environments.

### Turbopack path errors on Windows

If `next dev --turbopack` fails, use the standard dev server:

```bash
npm run dev
```

### Images not loading

Confirm the image hostname is listed in `next.config.mjs` under `images.remotePatterns`.

### Theme flashes on load

The root layout includes an inline script that reads `localStorage` before paint to prevent a light/dark flash.

---
