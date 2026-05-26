export default function PrintCard({ print, onDownload, onDelete }) {
  const date = print.created_at
    ? new Date(print.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    : '—'
  const time = print.created_at
    ? new Date(print.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : '—'

  return (
    <div className="masonry-card relative group bg-surface border-2 border-on-background p-xs mb-gutter transition-all duration-300 hover:shadow-[8px_8px_0px_0px_#1b1c1c] hover:-translate-y-2 hover:-translate-x-2">
      <div className="relative overflow-hidden border-2 border-on-background">
        <img
          src={print.public_url || print.dataUrl}
          alt={`Print from ${date}`}
          className="w-full object-cover block filter contrast-[1.15] saturate-110"
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-sm">
          <div className="font-technical-sm text-technical-sm text-on-primary uppercase flex flex-col gap-base mb-sm">
            <span>DATE: {date}</span>
            <span>TIME: {time}</span>
            {print.template && <span>LAYOUT: {print.template.toUpperCase()}</span>}
            {print.filter && print.filter !== 'none' && <span>FILTER: {print.filter.toUpperCase()}</span>}
          </div>
          <div className="flex gap-xs">
            <button
              onClick={() => onDownload?.(print)}
              className="flex-1 bg-surface text-on-surface border-2 border-on-background py-xs font-label-md text-label-md neo-pop-shadow active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              DOWNLOAD
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete?.(print)}
                className="bg-error text-on-error border-2 border-on-background px-xs py-xs neo-pop-shadow active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                title="Delete"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom label */}
      <div className="pt-xs flex items-center justify-between">
        <span className="font-technical-sm text-technical-sm text-on-surface-variant uppercase">
          {date}
        </span>
        {print.color && (
          <span className="font-technical-sm text-technical-sm text-on-surface-variant uppercase">
            {print.color}
          </span>
        )}
      </div>
    </div>
  )
}
