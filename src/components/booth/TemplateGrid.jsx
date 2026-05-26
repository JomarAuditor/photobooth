import { MEME_TEMPLATES } from '../../utils/imageProcessor'

export default function TemplateGrid({ selectedMeme, onSelectMeme, useMeme, onToggleMeme }) {
  return (
    <div className="w-full">
      {/* Meme toggle */}
      <div className="flex items-center justify-between mb-xs">
        <p className="font-technical-sm text-technical-sm text-on-surface-variant uppercase tracking-widest">
          Meme Mode
        </p>
        <button
          onClick={onToggleMeme}
          className={`relative w-12 h-6 border-2 border-on-background transition-all ${
            useMeme ? 'bg-primary-container' : 'bg-surface-container'
          }`}
          aria-label="Toggle meme mode"
        >
          <span
            className={`absolute top-[2px] w-4 h-4 bg-on-background transition-all duration-200 ${
              useMeme ? 'left-[22px]' : 'left-[2px]'
            }`}
          />
        </button>
      </div>

      {useMeme && (
        <div className="grid grid-cols-2 gap-xs mt-xs">
          {MEME_TEMPLATES.map(meme => (
            <button
              key={meme.id}
              onClick={() => onSelectMeme(meme.id)}
              className={`flex flex-col items-center gap-[2px] p-xs border-2 transition-all duration-150 min-h-[64px] ${
                selectedMeme === meme.id
                  ? 'bg-primary-container text-on-primary-container border-on-background neo-pop-shadow'
                  : 'bg-surface text-on-surface border-on-background hover:bg-surface-container-high hover:shadow-[2px_2px_0px_0px_#1b1c1c]'
              }`}
            >
              <span className="text-2xl">{meme.emoji}</span>
              <span className="font-label-md text-[11px] text-center leading-tight">{meme.label}</span>
            </button>
          ))}
        </div>
      )}

      {!useMeme && (
        <p className="font-technical-sm text-technical-sm text-on-surface-variant text-center py-sm border-2 border-dashed border-outline-variant">
          Enable to overlay meme templates
        </p>
      )}
    </div>
  )
}
