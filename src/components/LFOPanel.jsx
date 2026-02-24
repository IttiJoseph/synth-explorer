/**
 * LFOPanel — LFO waveform, rate, depth, and target controls.
 *
 * Rate uses a logarithmic slider (0.1–20 Hz) — doubling slider travel
 * feels like equal perceptual speed changes. Depth is linear 0–1.
 * Target selects which audio parameter the LFO modulates.
 */

// Log scale for rate: 0.1–20 Hz (factor of 200)
const rateToSlider = (hz) => (Math.log(hz / 0.1) / Math.log(200)) * 100
const sliderToRate = (v) => parseFloat((0.1 * Math.pow(200, v / 100)).toFixed(2))

const LFO_WAVEFORMS = [
  { value: 'sine',     label: 'Sine' },
  { value: 'triangle', label: 'Tri' },
  { value: 'square',   label: 'Sqr' },
  { value: 'sawtooth', label: 'Saw' },
]

const LFO_TARGETS = [
  { value: 'filter',    label: 'Filter' },
  { value: 'pitch',     label: 'Pitch' },
  { value: 'amplitude', label: 'Amp' },
]

export default function LFOPanel({ params, onLFOWaveform, onLFORate, onLFODepth, onLFOTarget }) {
  const { lfoWaveform, lfoRate, lfoDepth, lfoTarget } = params

  return (
    <section className="bg-stone-900 border border-stone-800 rounded-lg p-5">
      {/* Panel header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1.5 h-4 rounded-sm bg-violet-500" />
        <h2 className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">
          LFO
        </h2>
      </div>

      {/* Waveform selector */}
      <div className="mb-6">
        <label className="block text-xs font-mono text-stone-500 mb-2 tracking-wider uppercase">
          Waveform
        </label>
        <div className="flex rounded overflow-hidden border border-stone-700">
          {LFO_WAVEFORMS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onLFOWaveform(value)}
              className={`flex-1 py-2 text-xs font-mono tracking-wider uppercase transition-colors duration-100
                ${lfoWaveform === value
                  ? 'bg-violet-600 text-white font-bold'
                  : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Rate slider */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <label className="text-xs font-mono text-stone-500 tracking-wider uppercase">
            Rate
          </label>
          <span className="text-sm font-mono text-violet-400 tabular-nums">
            {lfoRate.toFixed(2)} Hz
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={rateToSlider(lfoRate)}
          onChange={(e) => onLFORate(sliderToRate(parseFloat(e.target.value)))}
        />
        <div className="flex justify-between mt-1 text-xs font-mono text-stone-600">
          <span>0.1 Hz</span>
          <span>20 Hz</span>
        </div>
      </div>

      {/* Depth slider */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <label className="text-xs font-mono text-stone-500 tracking-wider uppercase">
            Depth
          </label>
          <span className="text-sm font-mono text-violet-400 tabular-nums">
            {Math.round(lfoDepth * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={lfoDepth}
          onChange={(e) => onLFODepth(parseFloat(e.target.value))}
        />
        <div className="flex justify-between mt-1 text-xs font-mono text-stone-600">
          <span>Off</span>
          <span>Full</span>
        </div>
      </div>

      {/* Target selector */}
      <div>
        <label className="block text-xs font-mono text-stone-500 mb-2 tracking-wider uppercase">
          Target
        </label>
        <div className="flex rounded overflow-hidden border border-stone-700">
          {LFO_TARGETS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onLFOTarget(value)}
              className={`flex-1 py-2 text-xs font-mono tracking-wider uppercase transition-colors duration-100
                ${lfoTarget === value
                  ? 'bg-violet-600 text-white font-bold'
                  : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
