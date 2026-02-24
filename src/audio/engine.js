/**
 * engine.js — Tone.js audio engine for Synth Explorer
 *
 * Signal chain:
 *   Synth (osc + amp envelope) → Filter → Reverb → FeedbackDelay → Limiter → Destination
 *                                                                  ↓
 *                                                               Analyser (oscilloscope tap)
 *
 * Architecture rule: NO React, NO DOM, NO state management here.
 * Pure Tone.js. All functions accept plain values and update audio nodes.
 */

import * as Tone from 'tone';

// ─── Default values (match CLAUDE.md / PRD Section 5) ─────────────────────────

export const DEFAULTS = {
  frequency:       440,
  waveform:        'sawtooth',
  amplitude:       0.7,
  filterType:      'lowpass',
  filterCutoff:    5000,
  filterResonance: 0.2,    // normalized 0–1 → mapped to Q internally
  attack:          0.01,   // seconds
  decay:           0.3,    // seconds
  sustain:         0.7,    // 0–1
  release:         0.5,    // seconds
  lfoWaveform:     'sine',
  lfoRate:         2,      // Hz
  lfoDepth:        0,      // 0–1 (0 = off)
  lfoTarget:       'filter',
  reverbMix:       0,      // 0–1
  reverbDecay:     2,      // seconds
  delayMix:        0,      // 0–1
  delayTime:       0.3,    // seconds
  delayFeedback:   0.4,    // 0–0.8
};

// ─── Internal state ────────────────────────────────────────────────────────────

const state = { ...DEFAULTS, isDroning: false };

// ─── Utilities ─────────────────────────────────────────────────────────────────

// Map normalized resonance (0–1) → Q value
// 0% → Q 0.1 (flat), 100% → Q 20 (squelchy, capped below self-oscillation)
function resonanceToQ(r) {
  return 0.1 + r * 19.9;
}

// Safe gainToDb: treat near-zero as silence (-60 dB) to avoid -Infinity
function safeGainToDb(gain) {
  return gain < 0.001 ? -60 : Tone.gainToDb(gain);
}

// ─── Node construction ─────────────────────────────────────────────────────────

const synth = new Tone.Synth({
  oscillator: { type: DEFAULTS.waveform },
  envelope: {
    attack:  DEFAULTS.attack,
    decay:   DEFAULTS.decay,
    sustain: DEFAULTS.sustain,
    release: DEFAULTS.release,
  },
});

const filter = new Tone.Filter({
  type:      DEFAULTS.filterType,
  frequency: DEFAULTS.filterCutoff,
  Q:         resonanceToQ(DEFAULTS.filterResonance),
  rolloff:   -24,
});

// Reverb: wet=0 by default (dry), decay starts generating immediately
const reverb = new Tone.Reverb({
  decay:    DEFAULTS.reverbDecay,
  wet:      DEFAULTS.reverbMix,
  preDelay: 0.01,
});

// FeedbackDelay: wet=0 by default
const delay = new Tone.FeedbackDelay({
  delayTime: DEFAULTS.delayTime,
  feedback:  DEFAULTS.delayFeedback,
  wet:       DEFAULTS.delayMix,
});

// Master limiter: -3 dBFS ceiling prevents volume spikes from high resonance combos
const limiter = new Tone.Limiter(-3);

// Analyser for oscilloscope — taps post-limiter
const analyser = new Tone.Analyser('waveform', 1024);

// Dedicated gain node for LFO amplitude modulation (tremolo).
// Keeping this separate from synth.volume avoids the dB-vs-linear unit mismatch
// that occurs when connecting an LFO directly to a Param<"decibels">.
const tremoloGain = new Tone.Gain(1);

// LFO — starts running immediately, depth=0 so min=max=0 (no modulation)
const lfo = new Tone.LFO({
  type:      DEFAULTS.lfoWaveform,
  frequency: DEFAULTS.lfoRate,
  min:       0,
  max:       0,
  amplitude: 1,
}).start();

// ─── Signal chain ──────────────────────────────────────────────────────────────

synth.chain(tremoloGain, filter, reverb, delay, limiter, Tone.getDestination());
limiter.connect(analyser);  // oscilloscope tap (read-only, no audio output)

// Set initial volume from defaults
synth.volume.value = safeGainToDb(DEFAULTS.amplitude);

// ─── LFO routing ──────────────────────────────────────────────────────────────
// Disconnect → reset modulated params → reconnect to new target with scaled range

function reconnectLFO() {
  // Disconnect safely — LFO may have no connections on first call (depth was 0)
  try { lfo.disconnect(); } catch (_) {}

  // Reset overridden state on Signal targets.
  // Tone.js's connectSignal() sets signal.overridden = true when an LFO connects to a
  // Signal, which makes _fromType() permanently return 0 for all subsequent rampTo()
  // calls. We must clear this flag before rampTo() to restore manual control.
  filter.frequency.overridden = false;
  synth.detune.overridden = false;

  // Restore manually-controlled values (works now that overridden is cleared)
  filter.frequency.rampTo(state.filterCutoff, 0.03);
  synth.detune.rampTo(0, 0.03);
  tremoloGain.gain.rampTo(1, 0.03);

  if (state.lfoDepth === 0) return;

  const { lfoDepth, lfoTarget, filterCutoff } = state;

  switch (lfoTarget) {
    case 'filter': {
      // connectSignal will zero filter.frequency's base value (setValueAtTime(0,0)) and
      // set overridden=true. Since the base will be 0, we use ABSOLUTE Hz values so the
      // LFO itself provides the full frequency value (not a delta).
      const downRoom = filterCutoff - 20;
      const upRoom   = 20000 - filterCutoff;
      lfo.min = Math.max(20,    filterCutoff - lfoDepth * downRoom * 0.8);
      lfo.max = Math.min(20000, filterCutoff + lfoDepth * upRoom   * 0.8);
      lfo.connect(filter.frequency);
      break;
    }
    case 'pitch': {
      // connectSignal zeros synth.detune's base (0 cents = no pitch change, correct).
      // LFO then drives absolute detune in cents: ±200 cents = ±2 semitones at full depth.
      const cents = lfoDepth * 200;
      lfo.min = -cents;
      lfo.max =  cents;
      lfo.connect(synth.detune);
      break;
    }
    case 'amplitude': {
      // tremoloGain.gain is a Param (not a Signal) — connectSignal will NOT set overridden,
      // but it WILL cancel automations and zero the base (setValueAtTime(0,0)).
      // Use absolute gain values so LFO drives the full gain value from the zeroed base.
      lfo.min = 1 - lfoDepth;  // absolute gain: (1−depth) to 1
      lfo.max = 1;
      lfo.connect(tremoloGain.gain);
      break;
    }
  }
}

// ─── Initialization ────────────────────────────────────────────────────────────

/**
 * Must be called from a user gesture (click/tap) to satisfy browser autoplay policy.
 * Safe to call multiple times — Tone.start() is idempotent.
 */
export async function init() {
  await Tone.start();
}

// ─── Drone control ─────────────────────────────────────────────────────────────

/**
 * Start a continuous drone note at the current frequency.
 * ADSR envelope fires once on attack; sustain holds until stopDrone().
 */
export function startDrone() {
  if (state.isDroning) return;
  state.isDroning = true;
  synth.triggerAttack(state.frequency);
}

/**
 * Release the drone note (envelope enters release phase).
 */
export function stopDrone() {
  if (!state.isDroning) return;
  state.isDroning = false;
  synth.triggerRelease();
}

// ─── Oscillator ────────────────────────────────────────────────────────────────

/**
 * @param {string} type  'sine' | 'square' | 'sawtooth'
 */
export function setWaveform(type) {
  state.waveform = type;
  synth.oscillator.type = type;
}

// Alias used in build instructions API
export const setOscillator = setWaveform;

/**
 * @param {number} hz  20–2000 Hz
 */
export function setFrequency(hz) {
  state.frequency = hz;
  if (state.isDroning) {
    synth.frequency.rampTo(hz, 0.05);
  }
  if (state.lfoTarget === 'pitch') reconnectLFO();
}

/**
 * @param {number} value  0–1 (maps to dB internally)
 */
export function setAmplitude(value) {
  state.amplitude = value;
  synth.volume.rampTo(safeGainToDb(value), 0.02);
  if (state.lfoTarget === 'amplitude') reconnectLFO();
}

// ─── Filter ────────────────────────────────────────────────────────────────────

/**
 * @param {string} type  'lowpass' | 'highpass' | 'bandpass'
 */
export function setFilterType(type) {
  state.filterType = type;
  filter.type = type;
}

/**
 * @param {number} hz  20–20000 Hz
 */
export function setFilterCutoff(hz) {
  state.filterCutoff = hz;
  filter.frequency.rampTo(hz, 0.02);
  if (state.lfoTarget === 'filter') reconnectLFO();
}

/**
 * @param {number} value  0–1 normalized (0 = flat, 1 = maximum squelch, Q≈20)
 */
export function setFilterResonance(value) {
  state.filterResonance = value;
  filter.Q.rampTo(resonanceToQ(value), 0.02);
}

// ─── Envelope (ADSR) ───────────────────────────────────────────────────────────

/** @param {number} seconds  0–3 */
export function setAttack(seconds) {
  state.attack = seconds;
  synth.envelope.attack = seconds;
}

/** @param {number} seconds  0–3 */
export function setDecay(seconds) {
  state.decay = seconds;
  synth.envelope.decay = seconds;
}

/** @param {number} value  0–1 */
export function setSustain(value) {
  state.sustain = value;
  synth.envelope.sustain = value;
}

/** @param {number} seconds  0–5 */
export function setRelease(seconds) {
  state.release = seconds;
  synth.envelope.release = seconds;
}

/**
 * Set all four ADSR parameters at once.
 * @param {number} attack   seconds
 * @param {number} decay    seconds
 * @param {number} sustain  0–1
 * @param {number} release  seconds
 */
export function setADSR(attack, decay, sustain, release) {
  setAttack(attack);
  setDecay(decay);
  setSustain(sustain);
  setRelease(release);
}

// ─── LFO ───────────────────────────────────────────────────────────────────────

/** @param {string} type  'sine' | 'square' | 'triangle' */
export function setLFOWaveform(type) {
  state.lfoWaveform = type;
  lfo.type = type;
}

/** @param {number} hz  0.1–20 */
export function setLFORate(hz) {
  state.lfoRate = hz;
  lfo.frequency.rampTo(hz, 0.1);
}

/** @param {number} depth  0–1 (0 = off) */
export function setLFODepth(depth) {
  state.lfoDepth = depth;
  reconnectLFO();
}

/** @param {string} target  'pitch' | 'filter' | 'amplitude' */
export function setLFOTarget(target) {
  state.lfoTarget = target;
  reconnectLFO();
}

/**
 * Set all LFO parameters at once (matches build instructions API).
 * @param {string} waveform  'sine' | 'square' | 'triangle'
 * @param {number} rate      Hz
 * @param {number} depth     0–1
 * @param {string} target    'pitch' | 'filter' | 'amplitude'
 */
export function setLFO(waveform, rate, depth, target) {
  state.lfoWaveform = waveform;
  state.lfoRate     = rate;
  state.lfoDepth    = depth;
  state.lfoTarget   = target;
  lfo.type = waveform;
  lfo.frequency.rampTo(rate, 0.1);
  reconnectLFO();
}

// ─── Effects ───────────────────────────────────────────────────────────────────

/** @param {number} mix  0–1 */
export function setReverbMix(mix) {
  state.reverbMix = mix;
  reverb.wet.rampTo(mix, 0.05);
}

/** @param {number} seconds  0.1–10 */
export function setReverbDecay(seconds) {
  state.reverbDecay = seconds;
  reverb.decay = seconds;
}

/**
 * Set reverb parameters.
 * @param {number} mix      0–1
 * @param {number} decay    seconds
 */
export function setReverb(mix, decay) {
  setReverbMix(mix);
  setReverbDecay(decay);
}

/** @param {number} mix  0–1 */
export function setDelayMix(mix) {
  state.delayMix = mix;
  delay.wet.rampTo(mix, 0.05);
}

/** @param {number} seconds  0.05–1 */
export function setDelayTime(seconds) {
  state.delayTime = seconds;
  delay.delayTime.rampTo(seconds, 0.1);
}

/**
 * @param {number} value  0–0.8 (capped at 0.8 to prevent runaway feedback loops)
 */
export function setDelayFeedback(value) {
  state.delayFeedback = Math.min(0.8, value);
  delay.feedback.rampTo(state.delayFeedback, 0.05);
}

/**
 * Set delay parameters.
 * @param {number} mix       0–1
 * @param {number} time      seconds
 * @param {number} feedback  0–0.8
 */
export function setDelay(mix, time, feedback) {
  setDelayMix(mix);
  setDelayTime(time);
  setDelayFeedback(feedback);
}

// ─── Utilities ─────────────────────────────────────────────────────────────────

/** Returns the Tone.Analyser node for oscilloscope reads. */
export function getAnalyser() {
  return analyser;
}

/** Returns a snapshot of the current parameter state. */
export function getState() {
  return { ...state };
}

/** Returns true if the AudioContext is running (user has interacted). */
export function isReady() {
  return Tone.getContext().state === 'running';
}
