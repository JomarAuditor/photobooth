import { COLOR_THEMES } from '../../utils/imageProcessor'

export default function ColorPicker({ selected, onChange }) {
  return (
    <div className="w-full">
      <p className="font-technical-sm text-technical-sm text-on-surface-variant uppercase tracking-widest mb-xs">
        Color Theme
      </p>
      <div className="flex flex-row md:flex-col gap-xs overflow-x-auto md:overflow-x-visible pb-xs md:pb-0">
        {Object.entries(COLOR_THEMES).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            title={theme.label}
            className={`flex-shrink-0 flex items-center gap-xs px-sm py-xs border-2 transition-all duration-150 min-h-[48px] ${
              selected === key
                ? 'border-on-background neo-pop-shadow'
                : 'border-on-background hover:shadow-[2px_2px_0px_0px_#1b1c1c]'
            }`}
            style={{
              backgroundColor: selected === key ? theme.bg : undefined,
              color: selected === key ? theme.text : undefined,
            }}
          >
            {/* Color swatch */}
            <span
              className="w-5 h-5 border-2 flex-shrink-0"
              style={{ backgroundColor: theme.bg, borderColor: theme.border }}
            />
            <span className="font-label-md text-label-md whitespace-nowrap text-on-surface">
              {theme.label}
            </span>
            {/* Accent dot */}
            <span
              className="w-2 h-2 ml-auto flex-shrink-0"
              style={{ backgroundColor: theme.accent }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
