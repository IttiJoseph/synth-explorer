# Synth Explorer

An educational analog synthesizer web app for beginners.

## Project Documents
- PRD: docs/prd-analog-synth.md
- Build Instructions: docs/build-instructions.md
- Visual Reference: docs/visual-reference/

## Architecture Rules
- audio/ folder = Tone.js logic ONLY. No React, no DOM, no state.
- components/ folder = UI ONLY. Never import Tone.js directly.
- useAudioEngine hook = the ONLY bridge between audio and UI.
- Follow the build order in docs/build-instructions.md step by step.

## Tech Stack
- React (Vite) + Tone.js + Tailwind CSS + Canvas API
- Deploy to GitHub Pages

## Defaults (from PRD)
- Oscillator: Sawtooth, 440 Hz, 70% amplitude
- Filter: Low-pass, 5000 Hz cutoff, 20% resonance
- ADSR: 10ms attack, 300ms decay, 70% sustain, 500ms release
- LFO: Sine, 2 Hz, 0% depth (off), target: filter cutoff
- Effects: Reverb 0% mix / 2s decay, Delay 0% mix / 300ms / 40% feedback
- Master limiter on output