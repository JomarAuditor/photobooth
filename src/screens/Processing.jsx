import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  { label: 'Scanning frames', icon: 'document_scanner' },
  { label: 'Applying filter', icon: 'auto_fix_high' },
  { label: 'Compositing layout', icon: 'layers' },
  { label: 'Uploading to cloud', icon: 'cloud_upload' },
  { label: 'Print ready', icon: 'check_circle' },
]

export default function Processing({ onComplete }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (step < STEPS.length - 1) {
      const t = setTimeout(() => setStep(s => s + 1), 700)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setDone(true)
        onComplete?.()
      }, 600)
      return () => clearTimeout(t)
    }
  }, [step])

  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center bg-background px-margin-mobile py-xl relative overflow-hidden">
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-[0.04] pointer-events-none" />

      {/* Scanline */}
      {!done && (
        <div className="absolute left-0 right-0 h-[2px] bg-primary-container/60 animate-scanline pointer-events-none" />
      )}

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-lg">
        {/* Icon */}
        <div className={`w-24 h-24 border-4 border-on-background flex items-center justify-center transition-all duration-300 ${
          done ? 'bg-secondary-fixed neo-pop-shadow-lg' : 'bg-primary-container neo-pop-shadow animate-pulse2'
        }`}>
          <span className={`material-symbols-outlined text-[48px] ${done ? 'text-on-secondary-fixed' : 'text-on-primary-container'}`}>
            {done ? 'check_circle' : STEPS[step]?.icon}
          </span>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="font-headline-xl text-headline-lg text-on-surface lowercase tracking-tighter">
            {done ? 'print ready.' : 'processing...'}
          </h1>
          <p className="font-technical-sm text-technical-sm text-on-surface-variant uppercase tracking-widest mt-xs">
            {done ? 'Your aura has been captured.' : STEPS[step]?.label}
          </p>
        </div>

        {/* Step progress */}
        <div className="w-full flex flex-col gap-xs">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-sm px-sm py-xs border-2 transition-all duration-300 ${
                i < step
                  ? 'border-on-background bg-surface-container text-on-surface'
                  : i === step
                  ? 'border-primary-container bg-primary-container text-on-primary-container neo-pop-shadow'
                  : 'border-outline-variant bg-surface text-on-surface-variant opacity-40'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {i < step ? 'check' : s.icon}
              </span>
              <span className="font-label-md text-label-md">{s.label}</span>
              {i === step && !done && (
                <span className="ml-auto material-symbols-outlined text-[18px] animate-spin">autorenew</span>
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full border-2 border-on-background h-3 bg-surface-container">
          <div
            className="h-full bg-primary-container transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {done && (
          <div className="flex gap-sm w-full">
            <button
              onClick={() => navigate('/gallery')}
              className="flex-1 bg-primary-container text-on-primary-container border-2 border-on-background py-sm font-label-md text-label-md neo-pop-shadow active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              View Gallery
            </button>
            <button
              onClick={() => navigate('/studio')}
              className="flex-1 bg-surface text-on-surface border-2 border-on-background py-sm font-label-md text-label-md neo-pop-shadow active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all hover:bg-surface-container-high"
            >
              New Print
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
