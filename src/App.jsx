import { useState, useRef, useEffect } from 'react'
import { useAudioEngine } from './hooks/useAudioEngine.js'
import { PRESETS } from './audio/presets.js'
import logoUrl from './assets/Logo.svg'
import TransportBar from './components/TransportBar.jsx'
import OscillatorPanel from './components/OscillatorPanel.jsx'
import FilterPanel from './components/FilterPanel.jsx'
import EnvelopePanel from './components/EnvelopePanel.jsx'
import LFOPanel from './components/LFOPanel.jsx'
import EffectsPanel from './components/EffectsPanel.jsx'
import Oscilloscope from './components/Oscilloscope.jsx'
import LearningSection from './components/LearningSection.jsx'
import Footer from './components/Footer.jsx'

function SpeakerGrill() {
  const ref = useRef(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ w: width, h: height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const r = 5, gap = 18
  const cols = size.w > 0 ? Math.floor((size.w - r * 2) / gap) + 1 : 0
  const rows = size.h > 0 ? Math.floor((size.h - r * 2) / gap) + 1 : 0
  const startX = (size.w - (cols - 1) * gap) / 2
  const startY = (size.h - (rows - 1) * gap) / 2

  return (
    <div ref={ref} className="flex-1" style={{ minHeight: '40px' }}>
      <svg width="100%" height="100%">
        {Array.from({ length: rows }, (_, row) =>
          Array.from({ length: cols }, (_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={startX + col * gap}
              cy={startY + row * gap}
              r={r}
              fill="#6b5e56"
            />
          ))
        )}
      </svg>
    </div>
  )
}

export default function App() {
  const [activePreset, setActivePreset] = useState(null)

  const {
    params,
    isDroning,
    audioReady,
    startDrone,
    stopDrone,
    sequences,
    activeSequenceIndex,
    isSequencePlaying,
    startSequence,
    stopSequence,
    setWaveform,
    setFrequency,
    setAmplitude,
    setFilterType,
    setFilterCutoff,
    setFilterResonance,
    setAttack,
    setDecay,
    setSustain,
    setRelease,
    setLFOWaveform,
    setLFORate,
    setLFODepth,
    setLFOTarget,
    setReverbMix,
    setReverbDecay,
    setDelayMix,
    setDelayTime,
    setDelayFeedback,
    getAnalyser,
    loadPreset,
  } = useAudioEngine()

  return (
    <div className="min-h-screen bg-hw-bg text-hw-body">
      <main className="max-w-5xl mx-auto px-4 py-6">

        {/* Row 1: Hero + Oscilloscope */}
        <div className="grid grid-cols-3 gap-3 mb-3 items-stretch">
          {/* Hero */}
          <div className="bg-hw-panel border border-hw-border rounded-lg p-5 flex flex-col justify-center">
            <img src={logoUrl} alt="Synth Explorer" style={{ width: '100%', height: 'auto', display: 'block' }} />
            <p className="text-[10px] font-mono text-hw-muted tracking-wider">
              Explore the building blocks of electronic music. Hit play or pick a song from the playlist to get started.
            </p>
          </div>

          <div className="col-span-2">
            <Oscilloscope getAnalyser={getAnalyser} />
          </div>
        </div>

        {/* Row 2: Transport+Presets + Oscillator + Filter */}
        <div className="grid grid-cols-3 gap-3 mb-3 items-stretch">
          <TransportBar
            isDroning={isDroning}
            audioReady={audioReady}
            onPlay={startDrone}
            onStop={stopDrone}
            sequences={sequences}
            activeSequenceIndex={activeSequenceIndex}
            isSequencePlaying={isSequencePlaying}
            onStartSequence={startSequence}
            onStopSequence={stopSequence}
            presets={PRESETS}
            activePresetId={activePreset}
            onSelectPreset={(preset) => { loadPreset(preset); setActivePreset(preset.id) }}
          />

          <div className="h-full">
            <OscillatorPanel
              params={params}
              onWaveform={setWaveform}
              onFrequency={setFrequency}
              onAmplitude={setAmplitude}
            />
          </div>

          <div className="h-full">
            <FilterPanel
              params={params}
              onFilterType={setFilterType}
              onCutoff={setFilterCutoff}
              onResonance={setFilterResonance}
            />
          </div>
        </div>

        {/* Row 3: Envelope + LFO + Effects */}
        <div className="grid grid-cols-3 gap-3 mb-3 items-stretch">
          <div className="h-full">
            <EnvelopePanel
              params={params}
              onAttack={setAttack}
              onDecay={setDecay}
              onSustain={setSustain}
              onRelease={setRelease}
            />
          </div>

          <div className="h-full flex flex-col gap-3">
            <LFOPanel
              params={params}
              onLFOWaveform={setLFOWaveform}
              onLFORate={setLFORate}
              onLFODepth={setLFODepth}
              onLFOTarget={setLFOTarget}
            />
            {/* Speaker grill — Braun-style dot grid */}
            <SpeakerGrill />
          </div>

          <div className="h-full">
            <EffectsPanel
              params={params}
              onReverbMix={setReverbMix}
              onReverbDecay={setReverbDecay}
              onDelayMix={setDelayMix}
              onDelayTime={setDelayTime}
              onDelayFeedback={setDelayFeedback}
            />
          </div>
        </div>

      </main>

      <div className="border-t border-hw-border" />
      <LearningSection />
      <Footer />
    </div>
  )
}
