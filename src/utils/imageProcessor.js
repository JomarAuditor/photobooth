/**
 * imageProcessor.js
 * HTML5 Canvas pipeline for applying filters, compositing photo strips,
 * overlaying meme templates, and rendering final print layouts.
 */

// ─── Filter Definitions ──────────────────────────────────────────────────────

export const FILTERS = {
  none: { label: 'Original', css: 'none', icon: '◎' },
  vivid: { label: 'Vivid', css: 'contrast(1.2) saturate(1.4)', icon: '✦' },
  noir: { label: 'Noir', css: 'grayscale(1) contrast(1.3)', icon: '◐' },
  warm: { label: 'Warm', css: 'sepia(0.4) saturate(1.2) brightness(1.05)', icon: '☀' },
  cool: { label: 'Cool', css: 'hue-rotate(20deg) saturate(1.1) brightness(1.05)', icon: '❄' },
  fade: { label: 'Fade', css: 'contrast(0.85) brightness(1.1) saturate(0.8)', icon: '◌' },
  pop: { label: 'Pop', css: 'contrast(1.4) saturate(1.8) brightness(1.05)', icon: '★' },
  retro: { label: 'Retro', css: 'sepia(0.6) contrast(1.1) brightness(0.95)', icon: '⌛' },
}

// ─── Layout Definitions ──────────────────────────────────────────────────────

export const LAYOUTS = {
  'strip-2x3': {
    label: 'Strip 2×3',
    description: '6×2 Strip — 3 Pose',
    photoCount: 3,
    width: 400,
    height: 1200,
    slots: [
      { x: 20, y: 20, w: 360, h: 360 },
      { x: 20, y: 420, w: 360, h: 360 },
      { x: 20, y: 820, w: 360, h: 360 },
    ],
    labelArea: { x: 20, y: 1100, w: 360, h: 80 },
  },
  'strip-2x4': {
    label: 'Strip 2×4',
    description: '6×2 Strip — 4 Pose',
    photoCount: 4,
    width: 400,
    height: 1600,
    slots: [
      { x: 20, y: 20, w: 360, h: 360 },
      { x: 20, y: 420, w: 360, h: 360 },
      { x: 20, y: 820, w: 360, h: 360 },
      { x: 20, y: 1220, w: 360, h: 360 },
    ],
    labelArea: { x: 20, y: 1500, w: 360, h: 80 },
  },
  'grid-2x2': {
    label: 'Grid 2×2',
    description: '6×4 (4R) — 4 Pose',
    photoCount: 4,
    width: 1200,
    height: 900,
    slots: [
      { x: 20, y: 20, w: 560, h: 400 },
      { x: 620, y: 20, w: 560, h: 400 },
      { x: 20, y: 460, w: 560, h: 400 },
      { x: 620, y: 460, w: 560, h: 400 },
    ],
    labelArea: null,
  },
  'featured-3': {
    label: 'Featured',
    description: '6×4 (4R) — 3 Pose',
    photoCount: 3,
    width: 1200,
    height: 900,
    slots: [
      { x: 20, y: 20, w: 760, h: 860 },
      { x: 820, y: 20, w: 360, h: 400 },
      { x: 820, y: 460, w: 360, h: 400 },
    ],
    labelArea: null,
  },
  'wide-1': {
    label: 'Single Wide',
    description: '6×4 (4R) — 1 Pose',
    photoCount: 1,
    width: 1200,
    height: 900,
    slots: [
      { x: 20, y: 20, w: 1160, h: 860 },
    ],
    labelArea: null,
  },
  'meme-split': {
    label: 'Meme Split',
    description: 'Meme left + 4 photos right',
    photoCount: 4,
    width: 1200,
    height: 1600,
    slots: [
      { x: 20, y: 20, w: 560, h: 760 },
      { x: 620, y: 20, w: 560, h: 360 },
      { x: 620, y: 420, w: 560, h: 360 },
      { x: 620, y: 820, w: 560, h: 360 },
      { x: 20, y: 820, w: 560, h: 360 },
    ],
    labelArea: null,
    isMeme: true,
  },
}

// ─── Color Themes ─────────────────────────────────────────────────────────────

export const COLOR_THEMES = {
  white: {
    label: 'Pure White',
    bg: '#FFFFFF',
    border: '#1b1c1c',
    text: '#1b1c1c',
    accent: '#ff5c00',
    pattern: null,
  },
  cream: {
    label: 'Studio Cream',
    bg: '#FAF8F5',
    border: '#1b1c1c',
    text: '#1b1c1c',
    accent: '#a73a00',
    pattern: 'dots',
  },
  black: {
    label: 'Midnight Black',
    bg: '#1b1c1c',
    border: '#FAF8F5',
    text: '#FAF8F5',
    accent: '#ff5c00',
    pattern: 'grid',
  },
  violet: {
    label: 'Neon Violet',
    bg: '#1a0533',
    border: '#c084fc',
    text: '#f3e8ff',
    accent: '#a855f7',
    pattern: 'stars',
  },
  pink: {
    label: 'Bubblegum Pink',
    bg: '#fff0f6',
    border: '#ec4899',
    text: '#831843',
    accent: '#f472b6',
    pattern: 'hearts',
  },
  mint: {
    label: 'Mint Fresh',
    bg: '#f0fdf4',
    border: '#16a34a',
    text: '#14532d',
    accent: '#22c55e',
    pattern: 'dots',
  },
  orange: {
    label: 'Pop Orange',
    bg: '#fff7ed',
    border: '#ea580c',
    text: '#7c2d12',
    accent: '#ff5c00',
    pattern: 'lines',
  },
  spacebeans: {
    label: 'Space Beans',
    bg: '#0d0d0d',
    border: '#f5f0dc',
    text: '#f5f0dc',
    accent: '#f5f0dc',
    pattern: 'circuit',
  },
}

// ─── Core Compositor ─────────────────────────────────────────────────────────

/**
 * Composite multiple photo data URLs into a single print canvas.
 * @param {string[]} photos - Array of base64 data URLs
 * @param {string} layoutKey - Key from LAYOUTS
 * @param {string} colorKey - Key from COLOR_THEMES
 * @param {string} filterKey - Key from FILTERS
 * @param {object} options - { label, eventName, memeImage }
 * @returns {Promise<string>} - Final composite as base64 data URL
 */
export async function compositePrint(photos, layoutKey, colorKey, filterKey, options = {}) {
  const layout = LAYOUTS[layoutKey] || LAYOUTS['strip-2x3']
  const theme = COLOR_THEMES[colorKey] || COLOR_THEMES['white']

  const canvas = document.createElement('canvas')
  canvas.width = layout.width
  canvas.height = layout.height
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = theme.bg
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Background pattern
  drawPattern(ctx, theme.pattern, theme.border, canvas.width, canvas.height)

  // Draw border frame
  ctx.strokeStyle = theme.border
  ctx.lineWidth = 4
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4)

  // Draw photo slots
  const photoPromises = layout.slots.map((slot, i) => {
    const src = photos[i]
    if (!src) return Promise.resolve()
    return loadImage(src).then(img => {
      ctx.save()
      // Clip to slot
      ctx.beginPath()
      ctx.rect(slot.x, slot.y, slot.w, slot.h)
      ctx.clip()

      // Cover-fit the image
      const { sx, sy, sw, sh } = coverFit(img.width, img.height, slot.w, slot.h)
      ctx.drawImage(img, sx, sy, sw, sh, slot.x, slot.y, slot.w, slot.h)

      // Apply filter via globalCompositeOperation tricks (basic)
      applyCanvasFilter(ctx, filterKey, slot.x, slot.y, slot.w, slot.h)

      ctx.restore()

      // Slot border
      ctx.strokeStyle = theme.border
      ctx.lineWidth = 3
      ctx.strokeRect(slot.x, slot.y, slot.w, slot.h)
    })
  })

  await Promise.all(photoPromises)

  // Label area
  if (layout.labelArea) {
    const la = layout.labelArea
    ctx.fillStyle = theme.bg
    ctx.fillRect(la.x, la.y, la.w, la.h)
    ctx.fillStyle = theme.text
    ctx.font = `bold 20px 'Space Grotesk', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(options.eventName || 'lumi.', la.x + la.w / 2, la.y + 30)
    ctx.font = `500 14px 'JetBrains Mono', monospace`
    ctx.fillStyle = theme.accent
    ctx.fillText(options.label || new Date().toLocaleDateString(), la.x + la.w / 2, la.y + 55)
  }

  // Watermark
  ctx.font = `bold 18px 'Space Grotesk', sans-serif`
  ctx.fillStyle = theme.accent + '99'
  ctx.textAlign = 'right'
  ctx.fillText('lumi.', canvas.width - 16, canvas.height - 12)

  return canvas.toDataURL('image/jpeg', 0.92)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function coverFit(imgW, imgH, boxW, boxH) {
  const scale = Math.max(boxW / imgW, boxH / imgH)
  const sw = imgW * scale
  const sh = imgH * scale
  const sx = (boxW - sw) / 2
  const sy = (boxH - sh) / 2
  return { sx, sy, sw, sh }
}

function applyCanvasFilter(ctx, filterKey, x, y, w, h) {
  // Basic canvas-level filter approximations
  if (filterKey === 'noir') {
    const imageData = ctx.getImageData(x, y, w, h)
    const d = imageData.data
    for (let i = 0; i < d.length; i += 4) {
      const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
      d[i] = d[i + 1] = d[i + 2] = gray
    }
    ctx.putImageData(imageData, x, y)
  }
  // Other filters are applied via CSS on the video/preview element
}

function drawPattern(ctx, pattern, color, w, h) {
  if (!pattern) return
  ctx.save()
  ctx.globalAlpha = 0.06

  if (pattern === 'dots') {
    ctx.fillStyle = color
    for (let x = 12; x < w; x += 24) {
      for (let y = 12; y < h; y += 24) {
        ctx.beginPath()
        ctx.arc(x, y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  } else if (pattern === 'grid') {
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    for (let x = 0; x < w; x += 24) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
    }
    for (let y = 0; y < h; y += 24) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
    }
  } else if (pattern === 'lines') {
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    for (let i = -h; i < w + h; i += 20) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + h, h); ctx.stroke()
    }
  } else if (pattern === 'circuit') {
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    for (let x = 0; x < w; x += 40) {
      for (let y = 0; y < h; y += 40) {
        ctx.strokeRect(x + 5, y + 5, 30, 30)
        ctx.beginPath(); ctx.arc(x + 20, y + 20, 3, 0, Math.PI * 2); ctx.stroke()
      }
    }
  }

  ctx.restore()
}

// ─── Meme Template Compositor ────────────────────────────────────────────────

export const MEME_TEMPLATES = [
  { id: 'monkey', label: 'Monkey See', emoji: '🐒', description: 'Monkey reacts to your pose' },
  { id: 'doge', label: 'Doge Wow', emoji: '🐕', description: 'Much wow. Very photo.' },
  { id: 'drake', label: 'Drake Nod', emoji: '👆', description: 'Drake approves your look' },
  { id: 'distracted', label: 'Distracted BF', emoji: '👀', description: 'Classic distraction energy' },
  { id: 'this-is-fine', label: 'This Is Fine', emoji: '🔥', description: 'Everything is fine' },
  { id: 'galaxy-brain', label: 'Galaxy Brain', emoji: '🧠', description: 'Big brain moment' },
]

/**
 * Overlay a meme template alongside user photos
 */
export async function compositeMemePrint(photos, memeTemplateId, colorKey, options = {}) {
  return compositePrint(photos, 'meme-split', colorKey, 'none', {
    ...options,
    memeTemplate: memeTemplateId
  })
}
