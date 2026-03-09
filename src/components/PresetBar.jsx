/**
 * PresetBar — horizontal scrollable strip of preset buttons.
 *
 * Each button shows the preset name and a one-line description.
 * The active preset (last selected) is highlighted in amber.
 */

export default function PresetBar({ presets, activePresetId, onSelect }) {
  return (
    <section className="bg-stone-900 border border-stone-800 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-4 rounded-sm bg-amber-500" />
        <h2 className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">
          Presets
        </h2>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {presets.map((preset) => {
          const isActive = preset.id === activePresetId
          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              className={`flex-shrink-0 text-left px-3 py-2 rounded border transition-colors duration-100
                ${isActive
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-stone-700 bg-stone-800 hover:border-stone-500 hover:bg-stone-700'
                }`}
            >
              <div className={`text-xs font-mono font-bold tracking-wider uppercase
                ${isActive ? 'text-amber-400' : 'text-stone-300'}`}>
                {preset.name}
              </div>
              <div className="text-xs font-mono text-stone-600 mt-0.5 whitespace-nowrap">
                {preset.description}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
