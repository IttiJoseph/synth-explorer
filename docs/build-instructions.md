# Build Instructions: Analog Synthesizer Explorer

**Purpose:** How to approach the build — tech decisions, file structure, build order, and Claude Code-specific guidance.  
**Companion to:** PRD (Document 1) and Visual Reference (Document 2)

---

## 1. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Audio engine** | Tone.js | Wraps Web Audio API with built-in synth, sequencer, ADSR, LFO, and effects. Dramatically reduces boilerplate for everything in the PRD. |
| **UI framework** | React (via Vite) | Component-based architecture maps 1:1 to synth sections. Vite gives fast HMR for iterating on controls. |
| **Styling** | Tailwind CSS | Rapid iteration, utility-first, no context-switching to CSS files. |
| **Visualization** | Canvas API (via React refs) | Real-time oscilloscope needs 60fps — Canvas is the lightest option. No need for D3 here. |
| **Hosting** | GitHub Pages | Free, push-to-deploy. Use `gh-pages` npm package for easy deploys from Vite. |

### Key Libraries

```
tone                  # Audio engine — synth, sequencer, effects, LFO
react                 # UI framework
tailwindcss           # Styling
gh-pages              # Deployment to GitHub Pages
```

**No additional UI component libraries.** Sliders and toggles should be built with native HTML inputs styled with Tailwind. Keep dependencies minimal.

### Claude Code Skill

Install the official `frontend-design` skill before building any UI (Step 3 onwards). This prevents Claude Code from generating generic "AI slop" — default Inter font, purple gradients, cookie-cutter layouts — and pushes it toward distinctive, intentional design.

```bash
# In Claude Code terminal:
/plugin marketplace add anthropics/skills
```

Or manually:
```bash
mkdir -p .claude/skills/frontend-design
curl -o .claude/skills/frontend-design/SKILL.md https://raw.githubusercontent.com/anthropics/claude-code/main/plugins/frontend-design/skills/frontend-design/SKILL.md
```

No other skills needed — your PRD and this document provide all the project-specific context.

---

## 2. Project Structure

```
synth-explorer/
├── CLAUDE.md                       # Project context for Claude Code (references PRD + build instructions)
├── docs/
│   ├── prd-analog-synth.md         # Document 1: PRD
│   ├── build-instructions.md       # Document 3: Build instructions (this file)
│   └── visual-reference/           # Document 2: Visual reference (wireframe + moodboard)
├── public/
│   └── favicon.ico
├── src/
│   ├── main.jsx                    # App entry point
│   ├── App.jsx                     # Main layout — assembles all sections
│   │
│   ├── audio/                      # All Tone.js logic — no UI here
│   │   ├── engine.js               # Core synth setup: oscillator → filter → envelope → effects → limiter → output
│   │   ├── sequences.js            # Note sequences (the iconic riffs) as data arrays
│   │   └── presets.js              # Preset definitions as parameter objects
│   │
│   ├── components/                 # UI components — no audio logic here
│   │   ├── SignalFlowDiagram.jsx   # Interactive signal chain visualization
│   │   ├── OscillatorPanel.jsx     # Waveform selector, frequency, amplitude
│   │   ├── FilterPanel.jsx         # Filter type, cutoff, resonance
│   │   ├── EnvelopePanel.jsx       # ADSR sliders + envelope shape preview
│   │   ├── LFOPanel.jsx            # LFO waveform, rate, depth, target
│   │   ├── EffectsPanel.jsx        # Reverb + delay controls
│   │   ├── TransportBar.jsx        # Drone toggle + sequence selector
│   │   ├── Oscilloscope.jsx        # Real-time waveform canvas
│   │   ├── PresetBar.jsx           # Preset selection strip
│   │   └── Tooltip.jsx             # Reusable tooltip component
│   │
│   ├── learning/                   # Learning section — completely standalone
│   │   └── LearningSection.jsx     # Static content + diagram components
│   │
│   ├── hooks/                      # Custom React hooks
│   │   └── useAudioEngine.js       # Hook that bridges audio/engine.js ↔ React state
│   │
│   └── styles/
│       └── index.css               # Tailwind directives + any custom CSS
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

### Architecture Principle: Strict Separation

**`audio/` folder = Tone.js logic only.** No React, no DOM, no state. Pure functions and objects that accept parameters and control sound.

**`components/` folder = UI only.** Components read/write state and call into the audio engine via the `useAudioEngine` hook. They never import Tone.js directly.

**`useAudioEngine` hook = the bridge.** This single hook initializes the audio engine, exposes parameter setters, and manages the Tone.js lifecycle (start/stop AudioContext on user gesture). All components talk to audio through this hook.

This separation means the audio engine can be tested/debugged independently, and UI changes never accidentally break sound.

---

## 3. Build Order

Build in this exact sequence. Each step should be working and testable before moving to the next. Do not skip ahead.

### Step 1: Project Scaffolding
- **Prerequisites:** Node.js, Git, GitHub account, VS Code + Claude Code extension (see Getting Started Guide)
- `npm create vite@latest synth-explorer -- --template react`
- Install dependencies: `tone`, `tailwindcss`, `@tailwindcss/vite`, `gh-pages`
- Configure Tailwind
- Create `docs/` folder and place the PRD, this file, and visual reference inside
- Create `CLAUDE.md` in project root with the following content:

```markdown
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
```

- Install the `frontend-design` skill (see Section 1 above)
- Verify dev server runs with a blank page
- **Test:** `npm run dev` loads without errors

### Step 2: Audio Engine (No UI Yet)
- Build `audio/engine.js` — create the full Tone.js signal chain:
  - `Tone.Synth` or `Tone.MonoSynth` → `Tone.Filter` → `Tone.Reverb` → `Tone.FeedbackDelay` → `Tone.Limiter` → `Tone.getDestination()`
  - Expose functions: `startDrone()`, `stopDrone()`, `setOscillator(type)`, `setFrequency(hz)`, `setFilterCutoff(hz)`, `setFilterResonance(q)`, `setADSR(a,d,s,r)`, `setLFO(waveform, rate, depth, target)`, `setReverb(mix, decay)`, `setDelay(mix, time, feedback)`
- Wire up `Tone.Analyser` for oscilloscope data
- Add `Tone.Limiter` as the final node before output
- **Test:** Open browser console, manually call `startDrone()` and parameter setters. Verify sound plays and changes. This is the most critical step — everything else is UI on top of this.

### Step 3: Basic Controls + Drone Mode
- **Note:** From this step onwards, the `frontend-design` skill will automatically activate when Claude Code builds UI components. If you have your visual reference doc ready, tell Claude Code to reference `docs/visual-reference/` for design direction.
- Build `useAudioEngine` hook — wraps engine.js, manages React state for all parameters
- Build `TransportBar.jsx` — Play/Stop drone toggle (triggers `Tone.start()` on first click for browser autoplay policy)
- Build `OscillatorPanel.jsx` — waveform selector + frequency slider + amplitude slider
- Build `FilterPanel.jsx` — filter type toggle + cutoff knob + resonance knob
- Layout in `App.jsx` — stack panels vertically for now
- **Test:** Click play, hear drone, move sliders, hear changes in real-time

### Step 4: Envelope + LFO
- Build `EnvelopePanel.jsx` — four ADSR sliders + live envelope shape preview (Canvas or SVG)
- Build `LFOPanel.jsx` — waveform toggle, rate, depth, target selector
- Wire ADSR and LFO into the audio engine
- **Test:** In drone mode, LFO depth > 0 produces audible wobble. Switching to sequence mode (Step 5) will test ADSR.

### Step 5: Sequences
- Define 5–7 sequences in `audio/sequences.js` as arrays of `{ note, duration, time }` objects
- Implement sequence playback using `Tone.Sequence` or `Tone.Part`
- Build sequence selector into `TransportBar.jsx` — dropdown or button row
- Handle mode switching: drone mode stops sequence, sequence mode stops drone
- **Test:** Select a sequence, hit play, hear the riff loop. Switch sequences without audio glitches. Tweak filter/LFO while sequence plays.

### Step 6: Effects
- Build `EffectsPanel.jsx` — reverb (mix + decay) and delay (mix + time + feedback)
- Wire into audio engine
- **Test:** With a sequence playing, bring up reverb mix — sound should gain space. Bring up delay — hear echoes.

### Step 7: Oscilloscope
- Build `Oscilloscope.jsx` — Canvas element that reads `Tone.Analyser` waveform data at 60fps via `requestAnimationFrame`
- Style it to look good (green line on dark background is the classic look, but follow visual reference doc)
- **Test:** Waveform visually changes when switching oscillator type, adjusting filter, enabling LFO

### Step 8: Signal Flow Diagram
- Build `SignalFlowDiagram.jsx` — visual representation of the chain
- Highlight active section based on which panel the user is currently interacting with (track via state in App.jsx)
- **Test:** Click on filter controls, filter section highlights in the diagram

### Step 9: Presets
- Define 6–8 presets in `audio/presets.js` as objects with all parameter values
- Build `PresetBar.jsx` — row of preset buttons with names and 1-line descriptions
- Selecting a preset updates all React state → which flows into audio engine via useAudioEngine
- **Test:** Click "Wobble" preset, all knobs/sliders visually snap to new positions, sound changes to match

### Step 10: Tooltips
- Build `Tooltip.jsx` — reusable component, shows on hover/click of `?` icon
- Add tooltip content to every control across all panels
- Keep tone conversational per the PRD
- **Test:** Hover over resonance `?` icon, see "Boosts frequencies right at the cutoff point. Crank it up for that classic 'wah' sound."

### Step 11: Learning Section
- Build `LearningSection.jsx` — static content below the synth
- ~500–800 words covering: what is synthesis, waveforms, filters, ADSR, LFO, effects
- Add simple diagrams (SVG or static images) per topic
- Clear visual separator between synth and learning section
- **Test:** Scroll below synth, content reads well, diagrams render, no interaction with synth above

### Step 12: Polish + Deploy
- Review all defaults match the PRD (LFO depth 0%, effects mix 0%, drone mode default, etc.)
- Ensure master limiter prevents volume spikes at extreme settings
- Test full flow: land on page → hit play → tweak knobs → try presets → play sequences → scroll to learn
- Add `README.md` with project description
- Configure `vite.config.js` for GitHub Pages (`base` path)
- Deploy with `gh-pages -d dist`
- **Test:** Live site loads, audio works, all controls functional

---

## 4. Tone.js Quick Reference

Since Claude Code will be writing the audio engine, here are the key Tone.js patterns it should use:

### Signal Chain Setup
```javascript
// Core chain
const synth = new Tone.MonoSynth().chain(
  filter,       // Tone.Filter
  reverb,       // Tone.Reverb
  delay,        // Tone.FeedbackDelay
  limiter,      // Tone.Limiter
  Tone.getDestination()
);

// Analyser taps into the chain for visualization
const analyser = new Tone.Analyser('waveform', 1024);
limiter.connect(analyser);
```

### LFO
```javascript
const lfo = new Tone.LFO({
  frequency: 2,    // rate in Hz
  min: 200,        // target param min
  max: 5000        // target param max
}).start();

// Route to target
lfo.connect(filter.frequency);  // filter cutoff
// Or: lfo.connect(synth.detune) for pitch
// Or: lfo.connect(synth.volume) for amplitude
```

### Sequences
```javascript
const seq = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, "8n", time);
}, ["C3", "E3", "G3", "B3"], "8n");

seq.loop = true;
seq.start(0);
Tone.getTransport().start();
```

### Browser Autoplay
```javascript
// MUST be called from a user gesture (click/tap)
await Tone.start();
```

---

## 5. Claude Code Prompting Strategy

This section is guidance for how to work with Claude Code effectively during the build.

### Approach: One Step at a Time

Feed Claude Code the PRD and this document at the start. Then prompt step-by-step following the build order above. Do NOT ask Claude Code to build the entire app in one go.

**Good prompting pattern:**
```
"We're on Step 2. Build the audio engine in src/audio/engine.js. 
Follow the signal chain from the PRD: oscillator → filter → envelope → 
effects → limiter → output. Use Tone.js. Expose functions for setting 
every parameter listed in the PRD Section 5. Don't build any UI yet."
```

**Bad prompting pattern:**
```
"Build the entire synth app based on the PRD."
```

### Use `/compact` Between Steps

Long Claude Code sessions degrade as the context window fills up. After completing each step, run:
```
/compact Keep the architecture decisions and what we've built so far. Drop the implementation details.
```
This clears the conversation history while preserving what matters. Do this especially after Steps 2, 5, and 9 (the longest steps).

### Use Plan Mode First

Before each step, switch to plan mode (`Shift+Tab`) and ask Claude Code to outline its approach. Review the plan, then switch to execution mode. This catches bad architectural decisions before code gets written.

### After Each Step: Test Before Moving On

After Claude Code finishes a step, manually test it before prompting the next step. If something is broken, fix it in the same step before continuing. This prevents compounding errors.

### When Things Break

Audio is tricky. Common issues Claude Code might hit:
- **No sound:** Usually a missing `await Tone.start()` — must be triggered by user click
- **Clicks/pops on parameter change:** Use `rampTo()` instead of setting values directly
- **Sequence timing off:** Make sure `Tone.getTransport().start()` is called
- **Oscilloscope blank:** Check that `Tone.Analyser` is connected to the right node in the chain
- **Volume spikes:** Verify the `Tone.Limiter` is the last node before destination

### File Discipline

If Claude Code tries to put audio logic in React components or React code in the audio folder, push back. The separation matters — it's the single most important architectural decision for keeping this project manageable.

### Commit After Every Working Step

After each step passes testing, commit your work:
```bash
git add .
git commit -m "Step N: description of what was built"
```
This gives you a safety net — if Claude Code breaks something in a later step, you can roll back to the last working state with `git checkout .`

---

## 6. Deployment

### GitHub Pages via Vite

```bash
# In vite.config.js
export default defineConfig({
  base: '/synth-explorer/',  // Must match your GitHub repo name
  plugins: [react()]
})

# In package.json, add:
"scripts": {
  "deploy": "vite build && gh-pages -d dist"
}

# Deploy
npm run deploy
```

The site will be live at `https://<your-username>.github.io/synth-explorer/`

---

*This document should be provided to Claude Code alongside the PRD (Document 1) and Visual Reference (Document 2). For initial environment setup, see the Getting Started Guide.*
