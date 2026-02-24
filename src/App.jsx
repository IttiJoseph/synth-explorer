import { useAudioEngine } from './hooks/useAudioEngine.js'
import TransportBar from './components/TransportBar.jsx'
import OscillatorPanel from './components/OscillatorPanel.jsx'
import FilterPanel from './components/FilterPanel.jsx'
import EnvelopePanel from './components/EnvelopePanel.jsx'
import LFOPanel from './components/LFOPanel.jsx'

export default function App() {
  const {
    params,
    isDroning,
    audioReady,
    startDrone,
    stopDrone,
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
  } = useAudioEngine()

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <TransportBar
        isDroning={isDroning}
        audioReady={audioReady}
        onPlay={startDrone}
        onStop={stopDrone}
      />

      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
        <OscillatorPanel
          params={params}
          onWaveform={setWaveform}
          onFrequency={setFrequency}
          onAmplitude={setAmplitude}
        />

        <FilterPanel
          params={params}
          onFilterType={setFilterType}
          onCutoff={setFilterCutoff}
          onResonance={setFilterResonance}
        />

        <EnvelopePanel
          params={params}
          onAttack={setAttack}
          onDecay={setDecay}
          onSustain={setSustain}
          onRelease={setRelease}
        />

        <LFOPanel
          params={params}
          onLFOWaveform={setLFOWaveform}
          onLFORate={setLFORate}
          onLFODepth={setLFODepth}
          onLFOTarget={setLFOTarget}
        />
      </main>
    </div>
  )
}
