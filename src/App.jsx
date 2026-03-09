import { useState } from 'react'
import { useAudioEngine } from './hooks/useAudioEngine.js'
import { PRESETS } from './audio/presets.js'
import TransportBar from './components/TransportBar.jsx'
import PresetBar from './components/PresetBar.jsx'
import OscillatorPanel from './components/OscillatorPanel.jsx'
import FilterPanel from './components/FilterPanel.jsx'
import EnvelopePanel from './components/EnvelopePanel.jsx'
import LFOPanel from './components/LFOPanel.jsx'
import EffectsPanel from './components/EffectsPanel.jsx'
import Oscilloscope from './components/Oscilloscope.jsx'
import SignalFlowDiagram from './components/SignalFlowDiagram.jsx'

export default function App() {
  const [activePanel, setActivePanel] = useState(null)
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
    <div className="min-h-screen bg-stone-950 text-stone-100">
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
      />

      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
        <PresetBar
          presets={PRESETS}
          activePresetId={activePreset}
          onSelect={(preset) => { loadPreset(preset); setActivePreset(preset.id) }}
        />

        <Oscilloscope getAnalyser={getAnalyser} />

        <SignalFlowDiagram activePanel={activePanel} />

        <div
          onPointerEnter={() => setActivePanel('osc')}
          onPointerLeave={() => setActivePanel(null)}
        >
          <OscillatorPanel
            params={params}
            onWaveform={setWaveform}
            onFrequency={setFrequency}
            onAmplitude={setAmplitude}
          />
        </div>

        <div
          onPointerEnter={() => setActivePanel('filter')}
          onPointerLeave={() => setActivePanel(null)}
        >
          <FilterPanel
            params={params}
            onFilterType={setFilterType}
            onCutoff={setFilterCutoff}
            onResonance={setFilterResonance}
          />
        </div>

        <div
          onPointerEnter={() => setActivePanel('env')}
          onPointerLeave={() => setActivePanel(null)}
        >
          <EnvelopePanel
            params={params}
            onAttack={setAttack}
            onDecay={setDecay}
            onSustain={setSustain}
            onRelease={setRelease}
          />
        </div>

        <div
          onPointerEnter={() => setActivePanel('lfo')}
          onPointerLeave={() => setActivePanel(null)}
        >
          <LFOPanel
            params={params}
            onLFOWaveform={setLFOWaveform}
            onLFORate={setLFORate}
            onLFODepth={setLFODepth}
            onLFOTarget={setLFOTarget}
          />
        </div>

        <div
          onPointerEnter={() => setActivePanel('fx')}
          onPointerLeave={() => setActivePanel(null)}
        >
          <EffectsPanel
            params={params}
            onReverbMix={setReverbMix}
            onReverbDecay={setReverbDecay}
            onDelayMix={setDelayMix}
            onDelayTime={setDelayTime}
            onDelayFeedback={setDelayFeedback}
          />
        </div>
      </main>
    </div>
  )
}
