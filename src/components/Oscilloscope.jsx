/**
 * Oscilloscope — real-time waveform display at 60fps via Canvas + requestAnimationFrame.
 *
 * Reads Float32Array waveform data from Tone.Analyser (1024 samples, -1 to 1).
 * Draws a flat center line when idle; live waveform when audio is playing.
 */

import { useEffect, useRef } from 'react'

export default function Oscilloscope({ getAnalyser }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Match canvas pixel dimensions to its CSS display size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const ctx = canvas.getContext('2d')
    let rafId

    const draw = () => {
      rafId = requestAnimationFrame(draw)

      const analyser = getAnalyser()
      const data = analyser ? analyser.getValue() : null

      const { width, height } = canvas

      // Background
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, width, height)

      // Subtle center grid line
      ctx.strokeStyle = '#1c1c1c'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, height / 2)
      ctx.lineTo(width, height / 2)
      ctx.stroke()

      // Waveform
      ctx.strokeStyle = '#22c55e'  // green-500
      ctx.lineWidth = 1.5
      ctx.beginPath()

      const isIdle = !data || data.every(v => v === 0)

      if (isIdle) {
        ctx.moveTo(0, height / 2)
        ctx.lineTo(width, height / 2)
      } else {
        const sliceWidth = width / data.length
        for (let i = 0; i < data.length; i++) {
          const x = i * sliceWidth
          const y = ((1 - data[i]) / 2) * height
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
      }

      ctx.stroke()
    }

    draw()
    return () => cancelAnimationFrame(rafId)
  }, [getAnalyser])

  return (
    <section className="bg-stone-900 border border-stone-800 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-4 rounded-sm bg-green-500" />
        <h2 className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">
          Oscilloscope
        </h2>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full rounded"
        style={{ height: '120px', display: 'block' }}
      />
    </section>
  )
}
