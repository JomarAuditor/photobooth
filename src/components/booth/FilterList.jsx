import { FILTERS } from '../../utils/imageProcessor'

export default function FilterList({ selected, onChange }) {
  return (
    <div className="w-full">
      <p className="font-technical-sm text-technical-sm text-on-surface-variant uppercase tracking-widest mb-xs">
        Filter
      </p>
      <div className="flex flex-row md:flex-col gap-xs overflow-x-auto md:overflow-x-visible pb-xs md:pb-0">
        {Object.entries(FILTERS).map(([key, def]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex-shrink-0 flex items-center gap-xs px-sm py-xs border-2 transition-all duration-150 min-h-[48px] ${
              selected === key
                ? 'bg-primary-container text-on-primary-container border-on-background neo-pop-shadow'
                : 'bg-surface text-on-surface border-on-background hover:bg-surface-container-high hover:shadow-[2px_2px_0px_0px_#1b1c1c]'
            }`}
          >
            <span className="text-lg leading-none">{def.icon}</span>
            <span className="font-label-md text-label-md whitespace-nowrap">{def.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
