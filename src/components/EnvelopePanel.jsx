/**
 * EnvelopePanel — ADSR controls + reactive SVG envelope shape preview.
 *
 * Attack, Decay, Release use logarithmic sliders (0.001–2s / 0.001–5s) for
 * natural feel — small values (5ms) and large values (2s) both get meaningful
 * travel. Sustain is linear 0–1. The SVG preview reflects changes instantly.
 */

// Log scale helpers for time parameters
const timeToSlider = (s, min, max) => (Math.log(s / min) / Math.log(max / min)) * 100
const sliderToTime = (v, min, max) =>
  parseFloat((min * Math.pow(max / min, v / 100)).toFixed(4))

const fmtTime = (s) => s < 1 ? `${Math.round(s * 1000)}ms` : `${s.toFixed(2)}s`

// Compute SVG polyline points from ADSR values
// viewBox: 0 0 200 56
// Layout: A+D+R segments share 140px (proportional, log-weighted); S holds 60px
function envelopePoints(attack, decay, sustain, release) {
  const aLog = timeToSlider(attack,  0.001, 2) / 100
  const dLog = timeToSlider(decay,   0.001, 2) / 100
  const rLog = timeToSlider(release, 0.001, 5) / 100
  const total = aLog + dLog + rLog || 1

  const timeW = 140
  const susW  = 60
  const aW = (aLog / total) * timeW
  const dW = (dLog / total) * timeW
  const rW = (rLog / total) * timeW

  // Y: 4 = top (peak), 52 = bottom (silence), sY = sustain level
  const sY = (1 - sustain) * 48 + 4

  return [
    [0,                    52],  // start: silence
    [aW,                    4],  // end of attack: peak
    [aW + dW,             sY],  // end of decay: sustain level
    [aW + dW + susW,      sY],  // end of sustain: still at sustain level
    [aW + dW + susW + rW, 52],  // end of release: silence
  ].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
}

export default function EnvelopePanel({ params, onAttack, onDecay, onSustain, onRelease }) {
  const { attack, decay, sustain, release } = params
  const points = envelopePoints(attack, decay, sustain, release)

  return (
    <section className="bg-stone-900 border border-stone-800 rounded-lg p-5">
      {/* Panel header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1.5 h-4 rounded-sm bg-emerald-500" />
        <h2 className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">
          Envelope
        </h2>
      </div>

      {/* SVG envelope shape preview */}
      <div className="mb-6">
        <svg
          viewBox="0 0 200 56"
          className="w-full h-14 rounded bg-stone-950 border border-stone-800"
          preserveAspectRatio="none"
        >
          <polyline
            points={points}
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Attack */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <label className="text-xs font-mono text-stone-500 tracking-wider uppercase">
            Attack
          </label>
          <span className="text-sm font-mono text-emerald-400 tabular-nums">
            {fmtTime(attack)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={timeToSlider(attack, 0.001, 2)}
          onChange={(e) => onAttack(sliderToTime(parseFloat(e.target.value), 0.001, 2))}
        />
        <div className="flex justify-between mt-1 text-xs font-mono text-stone-600">
          <span>1ms</span>
          <span>2s</span>
        </div>
      </div>

      {/* Decay */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <label className="text-xs font-mono text-stone-500 tracking-wider uppercase">
            Decay
          </label>
          <span className="text-sm font-mono text-emerald-400 tabular-nums">
            {fmtTime(decay)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={timeToSlider(decay, 0.001, 2)}
          onChange={(e) => onDecay(sliderToTime(parseFloat(e.target.value), 0.001, 2))}
        />
        <div className="flex justify-between mt-1 text-xs font-mono text-stone-600">
          <span>1ms</span>
          <span>2s</span>
        </div>
      </div>

      {/* Sustain */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <label className="text-xs font-mono text-stone-500 tracking-wider uppercase">
            Sustain
          </label>
          <span className="text-sm font-mono text-emerald-400 tabular-nums">
            {Math.round(sustain * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={sustain}
          onChange={(e) => onSustain(parseFloat(e.target.value))}
        />
        <div className="flex justify-between mt-1 text-xs font-mono text-stone-600">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Release */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <label className="text-xs font-mono text-stone-500 tracking-wider uppercase">
            Release
          </label>
          <span className="text-sm font-mono text-emerald-400 tabular-nums">
            {fmtTime(release)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={timeToSlider(release, 0.001, 5)}
          onChange={(e) => onRelease(sliderToTime(parseFloat(e.target.value), 0.001, 5))}
        />
        <div className="flex justify-between mt-1 text-xs font-mono text-stone-600">
          <span>1ms</span>
          <span>5s</span>
        </div>
      </div>
    </section>
  )
}
