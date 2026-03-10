# BrowserWave

An interactive analog synthesizer in the browser — built to teach the fundamentals of sound synthesis.

**[Live Demo →](https://ittijoseph.github.io/browser-wave/)**

---

## What is it?

BrowserWave is an educational web synthesizer for beginners. You can tweak oscillators, filters, envelopes, and effects in real time and hear exactly what each control does. Hit play to drone a tone, or pick one of 7 iconic sequences from the playlist to jam along with.

A learning section below the synth explains the signal chain in plain English — no prior music or audio knowledge needed.

---

## Features

**Synthesis controls**
- **Oscillator** — Sine, square, and sawtooth waveforms; frequency (20–2000 Hz); amplitude
- **Filter** — Low-pass, high-pass, and band-pass; cutoff (20–20,000 Hz); resonance
- **Envelope (ADSR)** — Attack, decay, sustain, release shaping
- **LFO** — Sine, triangle, square, and sawtooth modulation at 0.1–20 Hz; routable to filter, pitch, or amplitude
- **Effects** — Reverb (mix + decay) and delay (mix + time + feedback)

**Interaction**
- Drone mode for continuous sound while tweaking knobs
- 7 iconic riff sequences: *Nightcall*, *Blue Monday*, *Jump*, *Take On Me*, *Chamber of Reflection*, *Giorgio*, *Flashing Lights*
- 7 curated presets: Init, Wobble, Acid, Pad, Lead, Bass, Pluck

**Visualization**
- Real-time oscilloscope (Canvas, 60 fps)
- Signal flow diagram (OSC → ENV → FILTER → FX → OUT)
- Tooltips on every control

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Audio engine | [Tone.js](https://tonejs.github.io/) |
| UI | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Oscilloscope | Canvas API |
| Hosting | GitHub Pages |

---

## Getting Started

```bash
git clone https://github.com/IttiJoseph/browser-wave.git
cd browser-wave
npm install
npm run dev
```

Open [http://localhost:5173/browser-wave/](http://localhost:5173/browser-wave/)

---

## Deploy

```bash
npm run deploy
```

Builds to `dist/` and publishes to the `gh-pages` branch.

---

## Architecture

The codebase enforces a strict separation between audio and UI:

```
src/
  audio/         # Tone.js logic only — no React, no DOM
  components/    # React UI only — never imports Tone.js directly
  hooks/
    useAudioEngine.js  # The only bridge between audio and UI
```

This makes the audio engine independently testable and keeps the React components free of Web Audio complexity.

---

## Author

Built by [Itti Joseph](https://itti.framer.website/)
