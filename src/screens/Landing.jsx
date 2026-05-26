import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'

// Placeholder photo strip images (solid color blocks for demo)
const STRIP_COLORS_A = ['#ff5c00', '#1b1c1c', '#FAF8F5']
const STRIP_COLORS_B = ['#a855f7', '#ec4899', '#22c55e', '#ff5c00']

function ColorBlock({ color, className = '' }) {
  return (
    <div
      className={`w-full border-2 border-on-background ${className}`}
      style={{ backgroundColor: color }}
    />
  )
}

const FEATURES = [
  {
    icon: 'photo_camera',
    title: 'Live Camera Studio',
    desc: 'WebRTC-powered booth with real-time filters, countdown timer, and front/back camera flip.',
  },
  {
    icon: 'grid_view',
    title: '12 Print Layouts',
    desc: 'Classic strips, 4R grids, featured singles — every format from the iconic photobooth playbook.',
  },
  {
    icon: 'palette',
    title: 'Color Themes',
    desc: 'White, Cream, Black, Violet, Pink, Mint, Orange, Space Beans — each with unique background patterns.',
  },
  {
    icon: 'sentiment_very_satisfied',
    title: 'Meme Mode',
    desc: 'Overlay viral meme templates alongside your shots. Monkey See, Doge Wow, Drake Nod and more.',
  },
  {
    icon: 'cloud_upload',
    title: 'Instant Cloud Save',
    desc: 'Every print auto-uploads to your personal gallery via Supabase Storage. Access anywhere.',
  },
  {
    icon: 'download',
    title: 'High-Res Download',
    desc: 'Export your composite print as a full-quality JPEG, ready to share or print IRL.',
  },
]

const TESTIMONIALS = [
  { name: 'Mika R.', handle: '@mikashots', text: 'lumi. is literally the most fun I\'ve had with a photo app. The meme mode is unhinged in the best way.' },
  { name: 'Jed C.', handle: '@jedcreates', text: 'The Space Beans theme with the noir filter? Chef\'s kiss. My whole feed is lumi. prints now.' },
  { name: 'Anya P.', handle: '@anyaframes', text: 'Used this at my birthday party. Everyone was obsessed. The strip layouts are so clean.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="w-full overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center overflow-hidden">
        {/* Dot grid bg */}
        <div className="absolute inset-0 dot-grid opacity-[0.04] pointer-events-none" />

        <div className="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-xl grid grid-cols-4 md:grid-cols-12 gap-gutter relative z-10">

          {/* Copy */}
          <div className="col-span-4 md:col-span-6 flex flex-col justify-center items-start gap-lg">
            {/* Badge */}
            <div className="flex items-center gap-xs border-2 border-on-background bg-secondary-fixed px-sm py-xs neo-pop-shadow">
              <span className="material-symbols-outlined text-[16px] text-on-secondary-fixed">bolt</span>
              <span className="font-technical-sm text-technical-sm text-on-secondary-fixed uppercase tracking-widest">
                New — Meme Mode is live
              </span>
            </div>

            <h1 className="font-headline-xl text-[56px] md:text-[88px] lg:text-[104px] leading-[0.92] tracking-tighter text-on-surface uppercase">
              lumi<br />
              <span className="text-primary-container">studio.</span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
              Capture the raw, unedited energy of the moment. High-fidelity prints, instant digital drops, zero friction.
            </p>

            <div className="flex flex-wrap gap-sm">
              <Button size="lg" onClick={() => navigate('/studio')}>
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                start capturing
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/gallery')}>
                view gallery
              </Button>
            </div>

            {/* Stats row */}
            <div className="flex gap-lg mt-xs">
              {[['12', 'layouts'], ['8', 'themes'], ['6', 'meme templates']].map(([num, label]) => (
                <div key={label} className="flex flex-col">
                  <span className="font-headline-lg text-headline-lg text-primary-container">{num}</span>
                  <span className="font-technical-sm text-technical-sm text-on-surface-variant uppercase">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Asymmetric photo strips */}
          <div className="col-span-4 md:col-span-6 relative min-h-[480px] mt-xl md:mt-0 flex items-center justify-center md:justify-end">
            {/* Strip A — rotated left, floating */}
            <div className="absolute md:right-[22%] top-[5%] animate-float photo-strip-frame w-[130px] md:w-[160px] z-0 hover:z-30 transition-all duration-300 hover:rotate-[-2deg]"
              style={{ transform: 'rotate(-8deg)' }}>
              {STRIP_COLORS_A.map((c, i) => (
                <ColorBlock key={i} color={c} className="aspect-square" />
              ))}
              <div className="py-xs text-center">
                <span className="font-technical-sm text-[10px] text-on-surface-variant uppercase">SUNSET_GLOW</span>
              </div>
            </div>

            {/* Strip B — rotated right, foreground */}
            <div className="absolute md:right-0 top-[18%] animate-float2 photo-strip-frame w-[130px] md:w-[160px] z-10 hover:z-30 transition-all duration-300 hover:rotate-[1deg]"
              style={{ transform: 'rotate(6deg)' }}>
              {STRIP_COLORS_B.map((c, i) => (
                <ColorBlock key={i} color={c} className="aspect-square" />
              ))}
              <div className="py-xs text-center">
                <span className="font-technical-sm text-[10px] text-on-surface-variant uppercase">MEME_MODE</span>
              </div>
            </div>

            {/* Decorative label */}
            <div className="absolute bottom-0 left-0 md:left-auto md:right-[38%] bg-primary-container border-2 border-on-background px-sm py-xs neo-pop-shadow">
              <span className="font-technical-sm text-technical-sm text-on-primary-container uppercase">
                ✦ your aura, printed
              </span>
            </div>
          </div>
        </div>

        {/* Scrolling ticker */}
        <div className="absolute bottom-0 left-0 right-0 border-t-2 border-on-background bg-primary-container overflow-hidden h-10 flex items-center">
          <div className="flex gap-xl animate-[scroll_20s_linear_infinite] whitespace-nowrap">
            {Array(6).fill(['CAPTURE', 'FILTER', 'PRINT', 'SHARE', 'MEME MODE', 'LUMI STUDIO']).flat().map((t, i) => (
              <span key={i} className="font-technical-sm text-technical-sm text-on-primary-container uppercase tracking-widest">
                {t} ✦
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="w-full border-t-2 border-on-background bg-surface-container-low py-xl">
        <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="mb-lg">
            <span className="font-technical-sm text-technical-sm text-primary uppercase tracking-widest">
              What's inside
            </span>
            <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-on-surface lowercase tracking-tighter mt-base">
              everything you need.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-surface border-2 border-on-background p-md neo-pop-shadow hover:shadow-[8px_8px_0px_0px_#1b1c1c] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-200"
              >
                <div className="w-12 h-12 bg-primary-container border-2 border-on-background flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined text-on-primary-container">{f.icon}</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg-mobile text-on-surface mb-xs">{f.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LAYOUT SHOWCASE ──────────────────────────────────────────────── */}
      <section className="w-full border-t-2 border-on-background py-xl bg-background">
        <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="mb-lg">
            <span className="font-technical-sm text-technical-sm text-primary uppercase tracking-widest">
              Print layouts
            </span>
            <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-on-surface lowercase tracking-tighter mt-base">
              12 ways to print.
            </h2>
          </div>

          {/* Layout preview grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-md">
            {[
              { label: 'Strip 3', slots: [1,1,1], aspect: 'aspect-[1/3]', cols: 1 },
              { label: 'Strip 4', slots: [1,1,1,1], aspect: 'aspect-[1/4]', cols: 1 },
              { label: 'Grid 2×2', slots: [1,1,1,1], aspect: 'aspect-[4/3]', cols: 2, grid: true },
              { label: 'Featured', slots: [1,1,1], aspect: 'aspect-[4/3]', cols: 2, featured: true },
              { label: 'Single', slots: [1], aspect: 'aspect-[4/3]', cols: 2 },
              { label: 'Meme Split', slots: [1,1,1,1,1], aspect: 'aspect-[3/4]', cols: 2, meme: true },
            ].map((layout, i) => (
              <div
                key={i}
                className={`border-2 border-on-background bg-surface p-xs neo-pop-shadow hover:shadow-[6px_6px_0px_0px_#1b1c1c] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all cursor-pointer ${
                  layout.cols === 2 ? 'col-span-2' : 'col-span-1'
                }`}
                onClick={() => navigate('/studio')}
              >
                <div className={`w-full ${layout.aspect} bg-surface-container border-2 border-on-background relative overflow-hidden`}>
                  {layout.grid ? (
                    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px] p-[2px]">
                      {layout.slots.map((_, j) => (
                        <div key={j} className="bg-surface-container-highest border border-on-background" />
                      ))}
                    </div>
                  ) : layout.featured ? (
                    <div className="absolute inset-0 grid grid-cols-3 gap-[2px] p-[2px]">
                      <div className="col-span-2 row-span-2 bg-surface-container-highest border border-on-background" />
                      <div className="bg-surface-container-highest border border-on-background" />
                      <div className="bg-surface-container-highest border border-on-background" />
                    </div>
                  ) : layout.meme ? (
                    <div className="absolute inset-0 grid grid-cols-2 gap-[2px] p-[2px]">
                      <div className="row-span-2 bg-secondary-container/30 border border-on-background flex items-center justify-center">
                        <span className="text-2xl">🐒</span>
                      </div>
                      <div className="bg-surface-container-highest border border-on-background" />
                      <div className="bg-surface-container-highest border border-on-background" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col gap-[2px] p-[2px]">
                      {layout.slots.map((_, j) => (
                        <div key={j} className="flex-1 bg-surface-container-highest border border-on-background" />
                      ))}
                    </div>
                  )}
                </div>
                <p className="font-technical-sm text-technical-sm text-on-surface-variant uppercase mt-xs text-center">
                  {layout.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEME MODE CALLOUT ────────────────────────────────────────────── */}
      <section className="w-full border-t-2 border-on-background bg-on-background py-xl">
        <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
            <div className="flex flex-col gap-md">
              <span className="font-technical-sm text-technical-sm text-secondary-fixed uppercase tracking-widest">
                ✦ New Feature
              </span>
              <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-surface lowercase tracking-tighter">
                meme mode.<br />
                <span className="text-primary-container">seriously.</span>
              </h2>
              <p className="font-body-lg text-body-lg text-inverse-on-surface">
                Pick a viral meme template, strike your best pose, and let lumi. composite them side-by-side. Monkey See, Doge Wow, Drake Nod — the classics are all here.
              </p>
              <Button size="lg" onClick={() => navigate('/studio')}>
                try meme mode
                <span className="material-symbols-outlined text-[18px]">sentiment_very_satisfied</span>
              </Button>
            </div>

            {/* Meme preview mockup */}
            <div className="grid grid-cols-2 gap-xs">
              <div className="flex flex-col gap-xs">
                {['🐒', '🐕', '👆'].map((emoji, i) => (
                  <div key={i} className="bg-surface-container border-2 border-surface-container-highest p-md flex items-center justify-center aspect-square">
                    <span className="text-5xl">{emoji}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-xs">
                {['🔥', '🧠', '👀'].map((emoji, i) => (
                  <div key={i} className="bg-surface-container border-2 border-surface-container-highest p-md flex items-center justify-center aspect-square">
                    <span className="text-5xl">{emoji}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="w-full border-t-2 border-on-background bg-surface-container-low py-xl">
        <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="mb-lg">
            <span className="font-technical-sm text-technical-sm text-primary uppercase tracking-widest">
              From the community
            </span>
            <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-on-surface lowercase tracking-tighter mt-base">
              people love it.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-surface border-2 border-on-background p-md neo-pop-shadow">
                <p className="font-body-lg text-body-lg text-on-surface mb-md">"{t.text}"</p>
                <div className="flex items-center gap-xs border-t-2 border-on-background pt-sm">
                  <div className="w-10 h-10 bg-primary-container border-2 border-on-background flex items-center justify-center">
                    <span className="font-headline-lg text-headline-lg-mobile text-on-primary-container">
                      {t.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">{t.name}</p>
                    <p className="font-technical-sm text-technical-sm text-on-surface-variant">{t.handle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="w-full border-t-2 border-on-background bg-primary-container py-xl">
        <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-lg">
          <div>
            <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-on-primary-container lowercase tracking-tighter">
              ready to capture?
            </h2>
            <p className="font-body-lg text-body-lg text-on-primary-container/80 mt-xs">
              No setup. No downloads. Just open and shoot.
            </p>
          </div>
          <Button
            variant="secondary"
            size="xl"
            onClick={() => navigate('/studio')}
            className="flex-shrink-0"
          >
            <span className="material-symbols-outlined">photo_camera</span>
            open studio
          </Button>
        </div>
      </section>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
