# lumi. studio

> A browser-based photobooth that captures, filters, and composites your shots into shareable print layouts — no app, no downloads, just open and shoot.

![lumi. studio](https://img.shields.io/badge/status-live-brightgreen?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-storage-3ECF8E?style=flat-square&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)

---

## What it does

lumi. is a full-stack photobooth web app. You open it in a browser, grant camera access, and it works like a real photobooth — countdown timer, live filters, multiple shots, then a composited print you can download or save to your personal cloud gallery.

**Live demo:** _coming soon_

---

## Features

### 📸 Live Camera Studio
- WebRTC camera feed with front/back flip support
- 3-second countdown timer before each capture
- Real-time CSS filter preview on the live feed
- Progress indicator showing shots captured vs. required

### 🖼️ 12 Print Layouts
| Layout | Format | Photos |
|--------|--------|--------|
| Strip 2×3 | Classic vertical strip | 3 |
| Strip 2×4 | Tall vertical strip | 4 |
| Grid 2×2 | 4R landscape grid | 4 |
| Featured | Large hero + 2 side shots | 3 |
| Single Wide | Full-bleed single | 1 |
| Meme Split | Meme left + photos right | 4 |
| ...and 6 more | | |

### 🎨 8 Color Themes
Each theme has a unique background color, border color, accent, and subtle background pattern (dots, grid, diagonal lines, circuit board, hearts, stars).

`Pure White` · `Studio Cream` · `Midnight Black` · `Neon Violet` · `Bubblegum Pink` · `Mint Fresh` · `Pop Orange` · `Space Beans`

### ✨ 8 Photo Filters
Applied live on the camera preview and baked into the final composite via HTML5 Canvas pixel manipulation.

`Original` · `Vivid` · `Noir` · `Warm` · `Cool` · `Fade` · `Pop` · `Retro`

### 🐒 Meme Mode
Pick a viral meme template and lumi. composites it side-by-side with your photos. Templates include Monkey See, Doge Wow, Drake Nod, Distracted BF, This Is Fine, and Galaxy Brain.

### ☁️ Cloud Gallery
- Google OAuth sign-in via Supabase Auth
- Prints auto-upload to Supabase Storage on download
- Personal gallery with masonry and grid view modes
- Sort by newest/oldest, filter by layout type
- Delete prints from the cloud

### 📥 High-Res Download
Composited prints export as JPEG at 92% quality. The canvas pipeline uses cover-fit scaling so photos always fill their slots cleanly.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 with a custom design system |
| Camera | WebRTC (`getUserMedia`) |
| Image processing | HTML5 Canvas API |
| Auth | Supabase Auth (Google OAuth) |
| Storage | Supabase Storage |
| Routing | React Router v6 |

---

## Project Structure

```
src/
├── components/
│   ├── booth/          # CameraCanvas, FilterList, ColorPicker, FrameSelector, TemplateGrid
│   ├── common/         # Button, Navbar, Footer
│   └── gallery/        # PrintCard
├── context/
│   └── AuthContext.jsx # Supabase auth state
├── hooks/
│   ├── useCamera.js    # WebRTC camera management
│   └── useSupabaseStorage.js
├── lib/
│   └── supabaseClient.js
├── screens/
│   ├── Landing.jsx     # Marketing homepage
│   ├── Studio.jsx      # Main photobooth UI
│   ├── Gallery.jsx     # Personal print gallery
│   ├── Processing.jsx  # Animated processing screen
│   └── AuthModal.jsx   # Sign-in page
└── utils/
    └── imageProcessor.js  # Canvas compositor, filters, layouts, themes
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project with:
  - Google OAuth enabled under Authentication → Providers
  - A storage bucket named `prints` (set to public or with appropriate RLS policies)
  - A `prints` table in your database

### Setup

```bash
# Clone the repo
git clone https://github.com/your-username/photobooth.git
cd photobooth

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Fill in your Supabase URL and anon key

# Start dev server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Build

```bash
npm run build
npm run preview
```

---

## How the Canvas Pipeline Works

The core of lumi. is a pure HTML5 Canvas compositor in `src/utils/imageProcessor.js`:

1. **Layout** — each layout defines pixel-precise slot coordinates on a fixed canvas size (e.g. 400×1200 for a strip)
2. **Cover-fit** — photos are scaled and cropped to fill each slot without distortion
3. **Filters** — CSS filters handle live preview; Noir is baked into the canvas via pixel-level grayscale manipulation; other filters are composited via CSS `filter` on the video element
4. **Themes** — background color, border, accent, and a procedurally drawn pattern (dots, grid, lines, circuit) are all rendered on canvas
5. **Label area** — strip layouts include a branded footer with event name and date
6. **Export** — `canvas.toDataURL('image/jpeg', 0.92)` produces the final print

---

## Roadmap

- [ ] Email/password auth fallback
- [ ] Supabase `prints` table schema and RLS policies documented
- [ ] Share to social (Web Share API)
- [ ] Custom event name input in studio
- [ ] More meme templates
- [ ] Print-to-PDF for physical printing

---

## Contributing

PRs are welcome. Open an issue first for anything beyond small fixes.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ☕ and too many filter tweaks.<br/>
  <strong>lumi. — your aura, printed.</strong>
</p>
