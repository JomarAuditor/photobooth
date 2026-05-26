import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSupabaseStorage } from '../hooks/useSupabaseStorage'
import PrintCard from '../components/gallery/PrintCard'
import Button from '../components/common/Button'

const SORT_OPTIONS = ['Newest', 'Oldest']
const FILTER_OPTIONS = ['All', 'Strip', 'Grid', 'Meme']

// Demo prints for guest/empty state
const DEMO_PRINTS = [
  { id: 'd1', public_url: null, dataUrl: null, created_at: new Date(Date.now() - 86400000 * 2).toISOString(), template: 'strip-2x3', color: 'cream', filter: 'vivid' },
  { id: 'd2', public_url: null, dataUrl: null, created_at: new Date(Date.now() - 86400000 * 5).toISOString(), template: 'grid-2x2', color: 'black', filter: 'noir' },
  { id: 'd3', public_url: null, dataUrl: null, created_at: new Date(Date.now() - 86400000 * 8).toISOString(), template: 'strip-2x4', color: 'violet', filter: 'pop' },
]

export default function Gallery() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { fetchUserPrints, deletePrint } = useSupabaseStorage()

  const [prints, setPrints] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('Newest')
  const [filterType, setFilterType] = useState('All')
  const [viewMode, setViewMode] = useState('masonry') // masonry | grid

  const loadPrints = useCallback(async () => {
    setLoading(true)
    if (user) {
      const data = await fetchUserPrints(user.id)
      setPrints(data)
    } else {
      // Show demo state for guests
      setPrints([])
    }
    setLoading(false)
  }, [user, fetchUserPrints])

  useEffect(() => {
    loadPrints()
  }, [loadPrints])

  const handleDownload = (print) => {
    const url = print.public_url || print.dataUrl
    if (!url) return
    const a = document.createElement('a')
    a.href = url
    a.download = `lumi-print-${print.id}.jpg`
    a.click()
  }

  const handleDelete = async (print) => {
    if (!window.confirm('Delete this print? This cannot be undone.')) return
    const ok = await deletePrint(print.id, print.storage_path)
    if (ok) setPrints(prev => prev.filter(p => p.id !== print.id))
  }

  // Sort & filter
  const displayed = prints
    .filter(p => {
      if (filterType === 'All') return true
      if (filterType === 'Strip') return p.template?.includes('strip')
      if (filterType === 'Grid') return p.template?.includes('grid')
      if (filterType === 'Meme') return p.template?.includes('meme')
      return true
    })
    .sort((a, b) => {
      const da = new Date(a.created_at), db = new Date(b.created_at)
      return sort === 'Newest' ? db - da : da - db
    })

  return (
    <div className="w-full min-h-[calc(100vh-72px)] bg-background">
      <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-lg">
          <div>
            <span className="font-technical-sm text-technical-sm text-primary uppercase tracking-widest">
              {user ? user.email?.split('@')[0] : 'guest'}
            </span>
            <h1 className="font-headline-xl text-headline-lg md:text-headline-xl text-on-background lowercase tracking-tighter mt-base">
              my personal prints
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">
              {user
                ? `${prints.length} print${prints.length !== 1 ? 's' : ''} in your collection.`
                : 'Sign in to save and view your prints.'}
            </p>
          </div>
          <Button onClick={() => navigate('/studio')} size="md">
            <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
            New Print
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-sm mb-lg border-b-2 border-on-background pb-md">
          {/* Filter tabs */}
          <div className="flex gap-xs">
            {FILTER_OPTIONS.map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-sm py-xs border-2 font-label-md text-label-md transition-all ${
                  filterType === f
                    ? 'bg-primary-container text-on-primary-container border-on-background neo-pop-shadow'
                    : 'bg-surface text-on-surface-variant border-on-background hover:bg-surface-container-high'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex gap-xs ml-auto">
            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="border-2 border-on-background bg-surface text-on-surface font-label-md text-label-md px-sm py-xs focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>

            {/* View mode */}
            <button
              onClick={() => setViewMode(v => v === 'masonry' ? 'grid' : 'masonry')}
              className="border-2 border-on-background bg-surface p-xs hover:bg-surface-container-high transition-all"
              title="Toggle view"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface">
                {viewMode === 'masonry' ? 'grid_view' : 'view_agenda'}
              </span>
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-xl gap-md">
            <span className="material-symbols-outlined text-[48px] text-primary animate-spin">autorenew</span>
            <p className="font-technical-sm text-technical-sm text-on-surface-variant uppercase">Loading prints...</p>
          </div>
        )}

        {/* Not signed in */}
        {!loading && !user && (
          <div className="flex flex-col items-center justify-center py-xl gap-lg border-2 border-dashed border-outline-variant">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant">lock</span>
            <div className="text-center">
              <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface lowercase tracking-tighter">
                sign in to see your prints
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                Your gallery is waiting. Sign in to access your saved prints.
              </p>
            </div>
            <Button onClick={() => navigate('/auth')} size="lg">
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
              Sign In
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!loading && user && displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-xl gap-lg border-2 border-dashed border-outline-variant">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant">photo_library</span>
            <div className="text-center">
              <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface lowercase tracking-tighter">
                no prints yet
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                Head to the studio and capture your first aura.
              </p>
            </div>
            <Button onClick={() => navigate('/studio')} size="lg">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              Open Studio
            </Button>
          </div>
        )}

        {/* Masonry grid */}
        {!loading && user && displayed.length > 0 && (
          viewMode === 'masonry' ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-gutter pb-xl pt-xs px-xs">
              {displayed.map(print => (
                <PrintCard
                  key={print.id}
                  print={print}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter pb-xl">
              {displayed.map(print => (
                <PrintCard
                  key={print.id}
                  print={print}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
