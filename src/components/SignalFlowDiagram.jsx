/**
 * SignalFlowDiagram — SVG visualization of the synth signal chain.
 *
 * Chain: OSC → ENV → FILTER → FX → OUT
 * LFO shown as a modulator node below FILTER with a dashed upward arrow.
 *
 * The active node (matching activePanel prop) brightens with its accent color.
 * All other nodes are dim.
 */

const BOX_W = 72
const BOX_H = 28
const MAIN_Y = 18
const LFO_Y = 72
const ARROW_COLOR = '#44403c'

const NODES = [
  { id: 'osc',    label: 'OSC',    x: 16,  y: MAIN_Y, color: '#f59e0b' },
  { id: 'env',    label: 'ENV',    x: 102, y: MAIN_Y, color: '#10b981' },
  { id: 'filter', label: 'FILTER', x: 188, y: MAIN_Y, color: '#0ea5e9' },
  { id: 'fx',     label: 'FX',     x: 274, y: MAIN_Y, color: '#f43f5e' },
  { id: 'out',    label: 'OUT',    x: 360, y: MAIN_Y, color: '#a8a29e' },
  { id: 'lfo',    label: 'LFO',    x: 188, y: LFO_Y,  color: '#8b5cf6' },
]

const CHAIN = NODES.slice(0, 5)
const LFO_CENTER_X = 188 + BOX_W / 2

export default function SignalFlowDiagram({ activePanel }) {
  return (
    <section className="bg-stone-900 border border-stone-800 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-4 rounded-sm bg-stone-400" />
        <h2 className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">
          Signal Flow
        </h2>
      </div>

      <svg
        viewBox="0 0 520 110"
        className="w-full"
        style={{ height: '90px' }}
        aria-hidden="true"
      >
        <defs>
          <marker id="sfArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill={ARROW_COLOR} />
          </marker>
        </defs>

        {/* Horizontal chain arrows */}
        {CHAIN.slice(0, 4).map((node, i) => (
          <line
            key={`h-${i}`}
            x1={node.x + BOX_W + 1}
            y1={MAIN_Y + BOX_H / 2}
            x2={CHAIN[i + 1].x - 2}
            y2={MAIN_Y + BOX_H / 2}
            stroke={ARROW_COLOR}
            strokeWidth="1.5"
            markerEnd="url(#sfArrow)"
          />
        ))}

        {/* LFO dashed arrow pointing up to FILTER */}
        <line
          x1={LFO_CENTER_X}
          y1={LFO_Y}
          x2={LFO_CENTER_X}
          y2={MAIN_Y + BOX_H + 1}
          stroke={ARROW_COLOR}
          strokeWidth="1.5"
          strokeDasharray="3 2"
          markerEnd="url(#sfArrow)"
        />

        {/* All nodes */}
        {NODES.map(({ id, label, x, y, color }) => {
          const isActive = activePanel === id
          return (
            <g key={id}>
              <rect
                x={x} y={y} width={BOX_W} height={BOX_H}
                rx="4"
                fill={isActive ? color : '#171717'}
                stroke={isActive ? color : '#292524'}
                strokeWidth="1.5"
              />
              <text
                x={x + BOX_W / 2}
                y={y + BOX_H / 2 + 4.5}
                textAnchor="middle"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="0.08em"
                fill={isActive ? '#ffffff' : '#57534e'}
              >
                {label}
              </text>
            </g>
          )
        })}
      </svg>
    </section>
  )
}
