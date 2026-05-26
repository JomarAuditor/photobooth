import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCamera } from '../hooks/useCamera'
import { useSupabaseStorage } from '../hooks/useSupabaseStorage'
import { useAuth } from '../context/AuthContext'
import CameraCanvas from '../components/booth/CameraCanvas'
import FilterList from '../components/booth/FilterList'
import FrameSelector from '../components/booth/FrameSelector'
import ColorPicker from '../components/booth/ColorPicker'
import TemplateGrid from '../components/booth/TemplateGrid'
import Button from '../components/common/Button'
import { LAYOUTS, compositePrint, compositeMemePrint } from '../utils/imageProcessor'

const PANEL_TABS = ['Layout', 'Filter', 'Color', 'Meme']

export default function Studio() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { videoRef, isReady, facingMode, error, countdown, isCapturing, startCamera, stopCamera, flipCamera, captureWithCountdown } = useCamera()
  const { uploading, progress, uploadPrint } = useSupabaseStorage()

  const canvasRef = useRef(null)

  // Studio state
  const [activeTab, setActiveTab] = useState('Layout')
  const [selectedLayout, setSelectedLayout] = useState('strip-2x3')
  const [selectedFilter, setSelectedFilter] = useState('none')
  const [selectedColor, setSelectedColor] = useState('white')
  const [useMeme, setUseMeme] = useState(false)
  const [selectedMeme, setSelectedMeme] = useState('monkey')
  const [capturedPhotos, setCapturedPhotos] = useState([])
  const [isCompositing, setIsCompositing] = useState(false)
  const [finalPrint, setFinalPrint] = useState(null)
  const [cameraStarted, setCameraStarted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const layout = LAYOUTS[selectedLayout]
  const requiredPhotos = layout?.photoCount || 3
  const canCapture = capturedPhotos.length < requiredPhotos && !isCapturing && isReady

  // Start camera on mount
  useEffect(() => {
    if (!cameraStarted) {
      startCamera()
      setCameraStarted(true)
    }
    return () => stopCamera()
  }, [])

  const handleCapture = useCallback(async () => {
    if (!canvasRef.current || !canCapture) return

    const dataUrl = await captureWithCountdown(canvasRef.current, 3, selectedFilter)
    if (dataUrl) {
      setCapturedPhotos(prev => [...prev, dataUrl])
    }
  }, [canCapture, captureWithCountdown, selectedFilter])

  const handleRemovePhoto = (index) => {
    setCapturedPhotos(prev => prev.filter((_, i) => i !== index))
    setFinalPrint(null)
  }

  const handleComposite = useCallback(async () => {
    if (capturedPhotos.length === 0) return
    setIsCompositing(true)
    try {
      let result
      if (useMeme) {
        result = await compositeMemePrint(capturedPhotos, selectedMeme, selectedColor)
      } else {
        result = await compositePrint(capturedPhotos, selectedLayout, selectedColor, selectedFilter, {
          label: new Date().toLocaleDateString(),
          eventName: 'lumi.'
        })
      }
      setFinalPrint(result)
    } catch (err) {
      console.error('[lumi] Composite error:', err)
    }
    setIsCompositing(false)
  }, [capturedPhotos, selectedLayout, selectedColor, selectedFilter, useMeme, selectedMeme])

  const handleSaveAndDownload = useCallback(async () => {
    if (!finalPrint) return

    // Download
    const a = document.createElement('a')
    a.href = finalPrint
    a.download = `lumi-print-${Date.now()}.jpg`
    a.click()

    // Upload to Supabase
    if (user) {
      await uploadPrint(finalPrint, user.id, {
        template: selectedLayout,
        layout: selectedLayout,
        color: selectedColor,
        filter: selectedFilter,
      })
    }
  }, [finalPrint, user, uploadPrint, selectedLayout, selectedColor, selectedFilter])

  const handleReset = () => {
    setCapturedPhotos([])
    setFinalPrint(null)
  }

  // Auto-composite when enough photos captured
  useEffect(() => {
    if (capturedPhotos.length === requiredPhotos && !finalPrint) {
      handleComposite()
    }
  }, [capturedPhotos.length, requiredPhotos])

  return (
    <div className="w-full min-h-[calc(100vh-72px)] bg-background">
      {/* ── Mobile top bar ── */}
      <div className="md:hidden flex items-center justify-between px-margin-mobile py-xs border-b-2 border-on-background bg-surface">
        <span className="font-technical-sm text-technical-sm text-on-surface-variant uppercase">
          {capturedPhotos.length}/{requiredPhotos} captured
        </span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-xs border-2 border-on-background px-sm py-xs bg-surface hover:bg-surface-container-high transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span className="font-label-md text-label-md">Settings</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row h-full">

        {/* ── LEFT SIDEBAR (desktop) / Drawer (mobile) ── */}
        <aside className={`
          ${sidebarOpen ? 'flex' : 'hidden'} md:flex
          flex-col w-full md:w-[220px] lg:w-[260px] flex-shrink-0
          border-b-2 md:border-b-0 md:border-r-2 border-on-background
          bg-surface overflow-y-auto
          md:sticky md:top-[72px] md:h-[calc(100vh-72px)]
        `}>
          {/* Tab switcher */}
          <div className="flex md:flex-col border-b-2 md:border-b-0 border-on-background overflow-x-auto md:overflow-x-visible">
            {PANEL_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSidebarOpen(false) }}
                className={`flex-shrink-0 px-sm py-sm font-label-md text-label-md border-r-2 md:border-r-0 md:border-b-2 border-on-background transition-all ${
                  activeTab === tab
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div className="p-sm flex flex-col gap-md overflow-y-auto flex-1">
            {activeTab === 'Layout' && (
              <FrameSelector selected={selectedLayout} onChange={(k) => { setSelectedLayout(k); setFinalPrint(null) }} />
            )}
            {activeTab === 'Filter' && (
              <FilterList selected={selectedFilter} onChange={(k) => { setSelectedFilter(k); setFinalPrint(null) }} />
            )}
            {activeTab === 'Color' && (
              <ColorPicker selected={selectedColor} onChange={(k) => { setSelectedColor(k); setFinalPrint(null) }} />
            )}
            {activeTab === 'Meme' && (
              <TemplateGrid
                selectedMeme={selectedMeme}
                onSelectMeme={setSelectedMeme}
                useMeme={useMeme}
                onToggleMeme={() => setUseMeme(v => !v)}
              />
            )}
          </div>
        </aside>

        {/* ── CENTER: Camera + Controls ── */}
        <div className="flex-1 flex flex-col items-center px-margin-mobile md:px-gutter py-md gap-md">
          {/* Camera */}
          <div className="w-full max-w-[480px]">
            {error ? (
              <div className="w-full aspect-[3/4] md:aspect-[4/3] bg-error-container border-2 border-on-background flex flex-col items-center justify-center gap-md p-md">
                <span className="material-symbols-outlined text-[48px] text-error">videocam_off</span>
                <p className="font-body-md text-body-md text-on-surface text-center">{error}</p>
                <Button onClick={() => startCamera()} size="sm">Retry Camera</Button>
              </div>
            ) : (
              <CameraCanvas
                videoRef={videoRef}
                isReady={isReady}
                countdown={countdown}
                filter={selectedFilter}
                facingMode={facingMode}
              />
            )}
          </div>

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Camera controls */}
          <div className="w-full max-w-[480px] flex items-center justify-between gap-sm">
            {/* Flip camera */}
            <Button
              variant="secondary"
              size="icon"
              onClick={flipCamera}
              disabled={!isReady}
              title="Flip camera"
            >
              <span className="material-symbols-outlined">flip_camera_ios</span>
            </Button>

            {/* Shutter */}
            <button
              onClick={handleCapture}
              disabled={!canCapture}
              className={`w-20 h-20 border-4 border-on-background flex items-center justify-center transition-all duration-150 ${
                canCapture
                  ? 'bg-primary-container neo-pop-shadow active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:shadow-[6px_6px_0px_0px_#1b1c1c]'
                  : 'bg-surface-container opacity-50 cursor-not-allowed'
              }`}
              aria-label="Capture photo"
            >
              <span className="material-symbols-outlined text-[32px] text-on-primary-container">
                {isCapturing ? 'timer' : 'photo_camera'}
              </span>
            </button>

            {/* Reset */}
            <Button
              variant="secondary"
              size="icon"
              onClick={handleReset}
              disabled={capturedPhotos.length === 0}
              title="Reset"
            >
              <span className="material-symbols-outlined">restart_alt</span>
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="w-full max-w-[480px] flex items-center gap-xs">
            {Array.from({ length: requiredPhotos }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 border-2 border-on-background transition-all ${
                  i < capturedPhotos.length ? 'bg-primary-container' : 'bg-surface-container'
                }`}
              />
            ))}
            <span className="font-technical-sm text-technical-sm text-on-surface-variant ml-xs whitespace-nowrap">
              {capturedPhotos.length}/{requiredPhotos}
            </span>
          </div>
        </div>

        {/* ── RIGHT PANEL: Captured photos + Preview ── */}
        <aside className="w-full md:w-[260px] lg:w-[300px] flex-shrink-0 border-t-2 md:border-t-0 md:border-l-2 border-on-background bg-surface flex flex-col">
          {/* Captured thumbnails */}
          <div className="p-sm border-b-2 border-on-background">
            <p className="font-technical-sm text-technical-sm text-on-surface-variant uppercase tracking-widest mb-xs">
              Captured ({capturedPhotos.length}/{requiredPhotos})
            </p>
            <div className="grid grid-cols-4 md:grid-cols-2 gap-xs">
              {Array.from({ length: requiredPhotos }).map((_, i) => (
                <div
                  key={i}
                  className="relative aspect-square border-2 border-on-background bg-surface-container overflow-hidden"
                >
                  {capturedPhotos[i] ? (
                    <>
                      <img
                        src={capturedPhotos[i]}
                        alt={`Shot ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemovePhoto(i)}
                        className="absolute top-0 right-0 bg-error text-on-error w-5 h-5 flex items-center justify-center border-l-2 border-b-2 border-on-background"
                      >
                        <span className="material-symbols-outlined text-[12px]">close</span>
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-technical-sm text-technical-sm text-on-surface-variant">{i + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Final print preview */}
          <div className="flex-1 p-sm flex flex-col gap-sm overflow-y-auto">
            <p className="font-technical-sm text-technical-sm text-on-surface-variant uppercase tracking-widest">
              Preview
            </p>

            {isCompositing && (
              <div className="flex flex-col items-center justify-center gap-sm py-lg border-2 border-dashed border-outline-variant">
                <span className="material-symbols-outlined text-[32px] text-primary animate-spin">
                  autorenew
                </span>
                <span className="font-technical-sm text-technical-sm text-on-surface-variant uppercase">
                  Compositing...
                </span>
              </div>
            )}

            {finalPrint && !isCompositing && (
              <>
                <div className="border-2 border-on-background neo-pop-shadow overflow-hidden">
                  <img src={finalPrint} alt="Final print" className="w-full object-contain" />
                </div>

                <Button
                  size="md"
                  className="w-full"
                  onClick={handleSaveAndDownload}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">autorenew</span>
                      Saving... {progress}%
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      Download Print
                    </>
                  )}
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={handleComposite}
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                  Re-composite
                </Button>

                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/gallery')}
                  >
                    View Gallery
                  </Button>
                )}
              </>
            )}

            {!finalPrint && !isCompositing && capturedPhotos.length > 0 && (
              <Button size="md" className="w-full" onClick={handleComposite}>
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                Generate Print
              </Button>
            )}

            {capturedPhotos.length === 0 && !isCompositing && (
              <div className="flex flex-col items-center justify-center gap-sm py-lg border-2 border-dashed border-outline-variant text-center">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant">
                  photo_library
                </span>
                <p className="font-technical-sm text-technical-sm text-on-surface-variant uppercase">
                  Capture {requiredPhotos} photos to generate your print
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
