import { useAudioEngine } from './hooks/useAudioEngine.js'
import TransportBar from './components/TransportBar.jsx'
import OscillatorPanel from './components/OscillatorPanel.jsx'
import FilterPanel from './components/FilterPanel.jsx'
import EnvelopePanel from './components/EnvelopePanel.jsx'
import LFOPanel from './components/LFOPanel.jsx'
import EffectsPanel from './components/EffectsPanel.jsx'
import Oscilloscope from './components/Oscilloscope.jsx'

export default function App() {
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
        <Oscilloscope getAnalyser={getAnalyser} />

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

        <EffectsPanel
          params={params}
          onReverbMix={setReverbMix}
          onReverbDecay={setReverbDecay}
          onDelayMix={setDelayMix}
          onDelayTime={setDelayTime}
          onDelayFeedback={setDelayFeedback}
        />
      </main>
    </div>
  )
}
