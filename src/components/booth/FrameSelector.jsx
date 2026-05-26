import { LAYOUTS } from '../../utils/imageProcessor'

export default function FrameSelector({ selected, onChange }) {
  return (
    <div className="w-full">
      <p className="font-technical-sm text-technical-sm text-on-surface-variant uppercase tracking-widest mb-xs">
        Layout
      </p>
      <div className="flex flex-row md:flex-col gap-xs overflow-x-auto md:overflow-x-visible pb-xs md:pb-0">
        {Object.entries(LAYOUTS).map(([key, def]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex-shrink-0 flex flex-col items-start gap-[2px] px-sm py-xs border-2 transition-all duration-150 min-h-[48px] min-w-[120px] md:min-w-0 ${
              selected === key
                ? 'bg-primary-container text-on-primary-container border-on-background neo-pop-shadow'
                : 'bg-surface text-on-surface border-on-background hover:bg-surface-container-high hover:shadow-[2px_2px_0px_0px_#1b1c1c]'
            }`}
          >
            <span className="font-label-md text-label-md">{def.label}</span>
            <span className="font-technical-sm text-[11px] text-on-surface-variant leading-tight">
              {def.photoCount} photo{def.photoCount > 1 ? 's' : ''}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
