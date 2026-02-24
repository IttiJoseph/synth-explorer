# PRD: Analog Synthesizer Explorer

**Version:** 1.0  
**Author:** Itti  
**Date:** February 2026  
**Status:** Final

---

## 1. Overview

A single-page web application that lets complete beginners explore and understand analog sound synthesis by interacting with a virtual synthesizer. Users manipulate real controls — oscillators, filters, envelopes, LFOs, and effects — and hear (and see) how each parameter shapes sound. The goal isn't to build a production synth; it's to make synthesis *click* for someone who's never touched one.

---

## 2. Problem Statement

Analog synthesis is intimidating. Most learning resources are either dense YouTube tutorials, expensive hardware, or DAW plugins designed for producers — not learners. There's a gap for a zero-friction, browser-based tool where a curious person can twist a knob, hear what happens, and understand *why* it happened — all in under 60 seconds from landing on the page.

---

## 3. Target Users

- **Complete beginners to audio/synthesis** — no prior knowledge of waveforms, frequencies, or signal flow assumed
- **General curious web visitors** — people who stumble across the link and want to play with something interesting for 5–15 minutes

### What they're NOT
- Professional producers looking for a DAW replacement
- Musicians who already understand subtractive synthesis

---

## 4. Design Principles

1. **Sound first, theory second** — every control immediately produces audible change; explanations support, not lead
2. **Smart defaults hide complexity** — LFO depth at 0%, effects mix at 0%, drone mode on — the initial sound is clean and simple even though all controls are available
3. **Play first, learn below** — the synth is the main event; a standalone learning section below explains the "why" for users who want to go deeper
4. **No wrong moves** — every parameter combination should produce *something* interesting, never silence or harsh noise without warning
5. **Instant gratification** — sound plays within 1 click/tap of landing on the page

---

## 5. Core Feature Set

### 5.1 Oscillator Section

The sound source. This is the starting point of the signal chain.

| Parameter | Control Type | Range | Default |
|-----------|-------------|-------|---------|
| Waveform | Toggle/selector | Sine, Square, Sawtooth | Sawtooth |
| Frequency (Pitch) | Knob or slider | 20 Hz – 2,000 Hz (log scale) | 440 Hz (A4) |
| Amplitude (Volume) | Slider | 0 – 100% | 70% |

**Behavior notes:**
- Waveform selector should show a visual preview of each wave shape alongside its name
- Frequency knob should snap to common musical notes with an option to go free-form

### 5.2 Filter Section

Shapes the tone by removing frequencies. This is the heart of subtractive synthesis.

| Parameter | Control Type | Range | Default |
|-----------|-------------|-------|---------|
| Filter type | Toggle | Low-pass, High-pass, Band-pass | Low-pass |
| Cutoff frequency | Knob | 20 Hz – 20,000 Hz (log scale) | 5,000 Hz |
| Resonance (Q) | Knob | 0 – 100% | 20% |

**Behavior notes:**
- Resonance at high values should produce the characteristic "squelchy" self-oscillation — but safely clamped so it doesn't blow out speakers
- Filter type change should be smooth (no clicks or pops)

### 5.3 Envelope (ADSR)

Controls how the sound evolves over time when triggered.

| Parameter | Control Type | Range | Default |
|-----------|-------------|-------|---------|
| Attack | Slider | 0 ms – 3,000 ms | 10 ms |
| Decay | Slider | 0 ms – 3,000 ms | 300 ms |
| Sustain | Slider | 0 – 100% | 70% |
| Release | Slider | 0 ms – 5,000 ms | 500 ms |

**Behavior notes:**
- Envelope should be visualizable as a line graph that updates in real-time as sliders move
- Two envelope targets: amplitude (always active) and filter cutoff (togglable)
- In drone mode, ADSR is bypassed (sound sustains continuously) — envelope shaping is heard when sequences are playing

### 5.4 LFO (Low Frequency Oscillator)

Adds movement and modulation — makes sounds feel alive.

| Parameter | Control Type | Range | Default |
|-----------|-------------|-------|---------|
| LFO waveform | Toggle | Sine, Square, Triangle | Sine |
| Rate | Knob | 0.1 Hz – 20 Hz | 2 Hz |
| Depth | Knob | 0 – 100% | 0% (off by default) |
| Target | Selector | Pitch, Filter Cutoff, Amplitude | Filter Cutoff |

**Behavior notes:**
- LFO depth at 0% by default so the sound is "clean" on first load — users opt into modulation
- Visual indicator showing the LFO wave cycling in real-time

### 5.5 Effects

Post-processing to add space and character.

| Effect | Parameters | Defaults |
|--------|-----------|----------|
| Reverb | Mix (0–100%), Decay (0.1–10s) | Mix: 0%, Decay: 2s |
| Delay | Mix (0–100%), Time (50–1000ms), Feedback (0–80%) | Mix: 0%, Time: 300ms, Feedback: 40% |

**Behavior notes:**
- Effects are "mix" based — 0% = fully dry, 100% = fully wet
- Delay feedback capped at 80% to prevent runaway feedback loops
- Both effects off (0% mix) by default to keep initial sound clean

---

## 6. Interaction Model

### 6.1 Sound Triggering

All sound triggering is on-screen — no computer keyboard mapping. Two modes:

**Mode 1: Drone Mode (Default)**
- A prominent Play/Stop toggle button
- Sound runs continuously so users can freely tweak knobs and hear changes in real-time
- This is the primary mode — optimized for learning and experimentation
- ADSR envelope is bypassed in drone mode (sound is always "on" at sustain level)

**Mode 2: Sequence Mode**
- A selector offering 5–7 short iconic riffs (1–2 bars each) that loop continuously
- Each sequence is a recognizable melodic hook that makes the synth feel like a real instrument
- Sequences loop until stopped, so users can tweak parameters while the pattern plays
- Tempo is fixed per sequence (no BPM control — keep it simple)

**Example sequences (final selection TBD during build):**

| Sequence Name | Reference / Vibe | Notes |
|---------------|-----------------|-------|
| "Robot Funk" | Daft Punk – "Da Funk" riff | Gritty, repetitive, perfect for filter sweeps |
| "Midnight Run" | Synthwave / retrowave feel | Arpeggiated, shows off filter + LFO well |
| "Acid Line" | TB-303 acid house pattern | Classic for demonstrating resonance |
| "Space Intro" | Van Halen – "Jump" style stab | Big chords, shows envelope shaping |
| "Neon Drive" | A-ha / new wave arpeggio | Fast, rhythmic, good for delay effects |

**Sequence + Preset pairing:** Sequences work alongside any preset or manual settings. Selecting a sequence changes *only* the note pattern — all synth parameters stay under user control. This means users can load "Wobble" preset + "Acid Line" sequence and hear something that sounds like actual music they shaped.

**Copyright note:** These are iconic riffs from copyrighted material, used for personal/educational purposes only. If the project is ever published publicly, these should be replaced with original "inspired by" sequences.

### 6.2 Signal Flow Visualization

A simplified signal chain diagram at the top (or side) of the page showing:

```
[Oscillator] → [Filter] → [Amplifier/Envelope] → [Effects] → [Output]
```

- Each section highlights/glows when the user is interacting with its controls
- Helps beginners understand *where* in the chain their changes are happening

### 6.3 Live Waveform Display

A real-time oscilloscope-style visualizer showing:

- The final output waveform (what you're hearing)
- Updates live as parameters change

---

## 7. Learning Section

A standalone section below the synth that explains synthesis in plain English. Not a textbook — just enough to make the controls above make sense. Static content with simple illustrations/diagrams.

### 7.1 Content

One flowing piece that covers each aspect of the synth, in signal-chain order. The whole section should be skimmable in 2–3 minutes.

**What is synthesis?**
A 2–3 sentence intro. Synthesis = creating sound from scratch using electricity (or in our case, code). Analog synthesizers build sound by generating simple waveforms and then shaping them through a chain of processors.

**Waveforms: where sound starts**
- What a waveform is (air vibrating in a pattern)
- The 3 types on the synth: sine (pure/smooth), square (hollow/retro), sawtooth (buzzy/rich)
- Why they sound different (harmonics — more overtones = more texture)
- Diagram: visual of all 3 waveforms side by side with a one-word character description

**Filters: sculpting the tone**
- What a filter does (removes certain frequencies)
- Low-pass, high-pass, band-pass explained in one line each
- Resonance = boosting the edge — the "wah" sound
- Diagram: simple frequency spectrum with a cutoff line sweeping across

**Envelope (ADSR): shaping sound over time**
- Why a piano and an organ sound different even at the same note (it's the shape over time)
- Attack, Decay, Sustain, Release — one sentence each
- Diagram: the classic ADSR curve with each phase labeled

**LFO: adding movement**
- "A knob that turns itself" — automated wobble
- LFO → pitch = vibrato, LFO → filter = wah, LFO → volume = tremolo
- Diagram: a parameter value wobbling over time

**Effects: adding space**
- Reverb = simulated room (clap in a bathroom vs. a cathedral)
- Delay = repeating echoes
- Diagram: dry signal vs. wet signal visualized

### 7.2 Tone & Writing Style

- Conversational, not academic — "here's a cool thing" not "herein we discuss"
- Analogies grounded in everyday experience (mouths, rooms, instruments people have heard)
- Short paragraphs — 2–3 sentences max per block
- No jargon without immediate plain-English translation
- Total length: aim for ~500–800 words across all topics

---

## 8. Presets & Tooltips

These support both the synth and the learning section but live inside the synth UI itself.

### 8.1 Tooltips

- Every parameter has a small `?` icon that reveals a 1–2 sentence plain-English explanation
- Example: **Resonance** → *"Boosts frequencies right at the cutoff point. Crank it up for that classic 'wah' sound."*
- Tooltips should match the conversational tone of the learning section

### 8.2 Presets

6–8 curated presets that demonstrate key synthesis concepts. Each preset is a "hear this concept in action" moment.

| Preset Name | What It Demonstrates |
|-------------|---------------------|
| "Pure Tone" | Sine wave, no filter/effects — the simplest possible sound |
| "Buzzy Bass" | Sawtooth + low-pass filter — subtractive synthesis in action |
| "Laser Zap" | Fast pitch envelope — how envelopes shape sound over time |
| "Wobble" | LFO → filter cutoff — what modulation sounds like |
| "Ambient Pad" | Slow attack + reverb + delay — layering effects to create space |
| "Retro Lead" | Square wave + resonant filter — classic analog synth character |

- Each preset includes a 1-line description of what to listen for
- Users can tweak any preset — the parameters update to match, then the user experiments from there
- Presets work with any sequence for mix-and-match discovery

---

## 9. Technical Requirements

### 9.1 Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Audio engine | Tone.js | Wraps Web Audio API with built-in synth, sequencer, ADSR, LFO, and effects. Dramatically reduces boilerplate. |
| UI framework | React (via Vite) | Component-based, maps 1:1 to synth sections. Vite gives fast HMR. |
| Visualization | Canvas API | Real-time oscilloscope needs 60fps — Canvas is the lightest option. |
| Styling | Tailwind CSS | Rapid iteration, utility-first, no context-switching to CSS files. |
| Hosting | GitHub Pages | Free, push-to-deploy via `gh-pages` npm package. |

### 9.2 Audio Architecture (Tone.js)

```
Tone.MonoSynth → Tone.Filter → Tone.Reverb → Tone.FeedbackDelay
                                              → Tone.Analyser (Visualizer)
                                              → Tone.Limiter (Master Limiter)
                                              → Tone.getDestination()
```

- `Tone.MonoSynth` for oscillator with built-in ADSR envelope
- `Tone.Filter` for filter (lowpass, highpass, bandpass)
- `Tone.LFO` as a separate oscillator at sub-audio rate, routable to any target AudioParam
- `Tone.Analyser` for waveform visualization data
- `Tone.Limiter` as a safety limiter on the master output — prevents volume spikes from high resonance + amplitude combos
- `Tone.Sequence` or `Tone.Part` for riff sequence playback

### 9.3 Performance Targets

- **First sound:** < 1 second after user interaction (Web Audio requires user gesture to start)
- **Latency:** Parameter changes audible within 1 frame (~16ms)
- **Frame rate:** Visualizer runs at 60fps on mid-range devices
- **Bundle size:** < 500KB total (no heavy audio libraries)

### 9.4 Browser Support

- Chrome 80+, Firefox 75+, Safari 14+, Edge 80+
- Mobile: functional but optimized for desktop (knobs are easier with mouse)
- Graceful degradation: if Web Audio not supported, show a message rather than a broken page

---

## 10. Information Architecture

Since this is a single-page app, layout is everything. The page should read top-to-bottom as the signal flows left-to-right:

```
┌─────────────────────────────────────────────────────┐
│  Header: Title + "How Analog Synthesis Works"       │
├─────────────────────────────────────────────────────┤
│  Signal Flow Diagram (interactive)                  │
│  [OSC] → [FILTER] → [AMP/ENV] → [FX] → [OUT]      │
├──────────┬──────────┬──────────┬────────────────────┤
│          │          │          │                     │
│ Oscillator │ Filter  │  ADSR    │  Effects           │
│ Controls   │ Controls│ Controls │  Controls          │
│          │          │          │                     │
├──────────┴──────────┴──────────┴────────────────────┤
│  LFO Controls (spans width, connects to targets)    │
├─────────────────────────────────────────────────────┤
│  Waveform Visualizer / Oscilloscope                 │
├─────────────────────────────────────────────────────┤
│  Drone Toggle + Sequence Selector                   │
├─────────────────────────────────────────────────────┤
│  Presets Bar                                        │
╞═════════════════════════════════════════════════════╡
│                                                     │
│  Learning Section (standalone)                      │
│  - What is synthesis?                               │
│  - Waveforms    - Filters    - ADSR                 │
│  - LFO          - Effects                           │
│  - Simple diagrams per topic                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 11. Scope

This is a single-phase personal project for learning vibe coding. No product roadmap, no release plan. One build, one feature set — focused on making synthesis fun and understandable.

### Core Feature Set (Build Once)

**Sound Engine**
- Oscillator: 3 waveforms (sine, square, sawtooth) + frequency + amplitude
- Filter: all 3 types (low-pass, high-pass, band-pass) + cutoff + resonance
- ADSR envelope: amplitude + filter cutoff as targets
- LFO: sine/square/triangle, routable to pitch, filter cutoff, or amplitude
- Effects: reverb (mix + decay) and delay (mix + time + feedback)
- Master limiter on output to prevent volume spikes

**Triggering**
- Drone mode (play/stop toggle) — default
- 5–7 iconic riff sequences (1–2 bar loops)

**Visualization**
- Live waveform oscilloscope
- Signal flow diagram showing the chain, highlights active section
- ADSR envelope shape preview (updates as sliders move)

**Education & Exploration**
- Tooltips on every control (1–2 sentence plain-English explainers)
- 6–8 curated presets that demonstrate key synthesis concepts
- Presets work with any sequence for mix-and-match discovery
- Standalone learning section below the synth: ~500–800 words covering waveforms, filters, ADSR, LFO, and effects with simple diagrams

### Explicitly Out of Scope
- Guided walkthrough / onboarding overlay
- Shareable sound URLs
- MIDI or keyboard input
- Mobile optimization (desktop-first, if it works on mobile, great)
- Second oscillator / layering
- Dark/light theme toggle
- Fine-tune / detune control
- FFT spectrum view (oscilloscope only)

---

## 12. Success Metrics

Since this is a personal project for learning vibe coding, success is twofold:

**As a learning tool (for visitors):**
- Does someone understand what a filter does after 30 seconds of playing?
- Do presets + sequences make the synth feel fun, not intimidating?
- Does the learning section make the "why" click without feeling like homework?

**As a vibe coding exercise (for Itti):**
- Did the PRD → Claude Code workflow produce a working app?
- What needed manual intervention vs. what Claude Code handled well?
- How close did the output get to the intended design and functionality?

---

## 13. Handoff to Claude Code

This PRD is one of three documents that will be provided to Claude Code together. All three live in the project's `docs/` folder and are referenced from `CLAUDE.md` in the project root — which is how Claude Code discovers project context automatically.

### Document 1: PRD (this document)
**Purpose:** What to build and why  
**Status:** ✅ Complete  
**Contains:** Feature specs, parameter ranges, defaults, interaction model, learning section content, scope, information architecture

### Document 2: Visual Reference
**Purpose:** How it should look and feel  
**Status:** TBD — to be created separately  
**Should contain:**
- Rough wireframe or layout sketch (Figma export, hand-drawn scan, or screenshot markup)
- Moodboard / reference screenshots of synth UIs or web apps that capture the target aesthetic
- Color palette direction (dark? light? neon? minimal?)
- Typography preferences (if any)
- Control style preference (knobs vs sliders vs both, skeuomorphic vs flat)
- Any specific visual references for the learning section (illustration style, diagram approach)

### Document 3: Build Instructions
**Purpose:** How to approach the build — tech decisions, file structure, build order  
**Status:** ✅ Complete  
**Contains:** Tech stack (React + Vite + Tone.js + Tailwind), file/component structure, 12-step build order, Tone.js reference patterns, Claude Code prompting strategy, deployment instructions

### CLAUDE.md (Project Root)
**Purpose:** Entry point for Claude Code — summarizes architecture rules, defaults, and points to the docs above  
**Status:** ✅ Template in build instructions (created during Step 1)

---

*Visual design direction will be provided as a companion document (Document 2). Getting Started Guide covers environment setup prerequisites.*
