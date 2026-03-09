/**
 * useAudioEngine.js — React bridge to the Tone.js audio engine.
 *
 * This hook is the ONLY place that imports engine.js into React land.
 * Components call these setters; they never touch Tone.js directly.
 *
 * Manages:
 *   - React state mirror of all audio parameters (for controlled inputs)
 *   - AudioContext initialization on first user gesture
 *   - Drone play/stop state
 */

import { useState, useCallback } from 'react'
import * as engine from '../audio/engine.js'
import * as sequencer from '../audio/sequences.js'

export function useAudioEngine() {
  const [params, setParams] = useState({ ...engine.DEFAULTS })
  const [isDroning, setIsDroning] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const [activeSequenceIndex, setActiveSequenceIndex] = useState(null)
  const [isSequencePlaying, setIsSequencePlaying] = useState(false)

  // Must be called from a user gesture — satisfies browser autoplay policy
  const ensureInit = useCallback(async () => {
    if (!engine.isReady()) {
      await engine.init()
    }
    setAudioReady(true)
  }, [])

  // ─── Transport ──────────────────────────────────────────────────────────────

  const startDrone = useCallback(async () => {
    await ensureInit()
    // Stop sequence if one is playing
    if (isSequencePlaying) {
      sequencer.stopSequence()
      setActiveSequenceIndex(null)
      setIsSequencePlaying(false)
    }
    engine.startDrone()
    setIsDroning(true)
  }, [ensureInit, isSequencePlaying])

  const stopDrone = useCallback(() => {
    engine.stopDrone()
    setIsDroning(false)
  }, [])

  // ─── Oscillator ─────────────────────────────────────────────────────────────

  const setWaveform = useCallback((type) => {
    engine.setWaveform(type)
    setParams(p => ({ ...p, waveform: type }))
  }, [])

  const setFrequency = useCallback((hz) => {
    engine.setFrequency(hz)
    setParams(p => ({ ...p, frequency: hz }))
  }, [])

  const setAmplitude = useCallback((value) => {
    engine.setAmplitude(value)
    setParams(p => ({ ...p, amplitude: value }))
  }, [])

  // ─── Filter ─────────────────────────────────────────────────────────────────

  const setFilterType = useCallback((type) => {
    engine.setFilterType(type)
    setParams(p => ({ ...p, filterType: type }))
  }, [])

  const setFilterCutoff = useCallback((hz) => {
    engine.setFilterCutoff(hz)
    setParams(p => ({ ...p, filterCutoff: hz }))
  }, [])

  const setFilterResonance = useCallback((value) => {
    engine.setFilterResonance(value)
    setParams(p => ({ ...p, filterResonance: value }))
  }, [])

  // ─── Envelope ───────────────────────────────────────────────────────────────

  const setAttack = useCallback((s) => {
    engine.setAttack(s)
    setParams(p => ({ ...p, attack: s }))
  }, [])

  const setDecay = useCallback((s) => {
    engine.setDecay(s)
    setParams(p => ({ ...p, decay: s }))
  }, [])

  const setSustain = useCallback((v) => {
    engine.setSustain(v)
    setParams(p => ({ ...p, sustain: v }))
  }, [])

  const setRelease = useCallback((s) => {
    engine.setRelease(s)
    setParams(p => ({ ...p, release: s }))
  }, [])

  // ─── LFO ────────────────────────────────────────────────────────────────────

  const setLFOWaveform = useCallback((type) => {
    engine.setLFOWaveform(type)
    setParams(p => ({ ...p, lfoWaveform: type }))
  }, [])

  const setLFORate = useCallback((hz) => {
    engine.setLFORate(hz)
    setParams(p => ({ ...p, lfoRate: hz }))
  }, [])

  const setLFODepth = useCallback((depth) => {
    engine.setLFODepth(depth)
    setParams(p => ({ ...p, lfoDepth: depth }))
  }, [])

  const setLFOTarget = useCallback((target) => {
    engine.setLFOTarget(target)
    setParams(p => ({ ...p, lfoTarget: target }))
  }, [])

  // ─── Sequences ───────────────────────────────────────────────────────────────

  const startSequence = useCallback(async (index) => {
    await ensureInit()
    // Stop drone if playing
    if (isDroning) {
      engine.stopDrone()
      setIsDroning(false)
    }
    sequencer.startSequence(index)
    setActiveSequenceIndex(index)
    setIsSequencePlaying(true)
  }, [ensureInit, isDroning])

  const stopSequence = useCallback(() => {
    sequencer.stopSequence()
    setActiveSequenceIndex(null)
    setIsSequencePlaying(false)
  }, [])

  // ─── Effects ─────────────────────────────────────────────────────────────────

  const setReverbMix = useCallback((mix) => {
    engine.setReverbMix(mix)
    setParams(p => ({ ...p, reverbMix: mix }))
  }, [])

  const setReverbDecay = useCallback((s) => {
    engine.setReverbDecay(s)
    setParams(p => ({ ...p, reverbDecay: s }))
  }, [])

  const setDelayMix = useCallback((mix) => {
    engine.setDelayMix(mix)
    setParams(p => ({ ...p, delayMix: mix }))
  }, [])

  const setDelayTime = useCallback((s) => {
    engine.setDelayTime(s)
    setParams(p => ({ ...p, delayTime: s }))
  }, [])

  const setDelayFeedback = useCallback((v) => {
    engine.setDelayFeedback(v)
    setParams(p => ({ ...p, delayFeedback: v }))
  }, [])

  return {
    params,
    isDroning,
    audioReady,
    startDrone,
    stopDrone,
    sequences: sequencer.SEQUENCE_META,
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
    getAnalyser: engine.getAnalyser,
  }
}
