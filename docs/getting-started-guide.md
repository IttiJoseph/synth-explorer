# Getting Started: Setup Guide

Your step-by-step guide from opening VS Code to your first Claude Code prompt. Every single step is here — nothing assumed.

---

## Step 0: One-Time Setup (Git + GitHub)

### 0.1 Open VS Code

1. Open VS Code from your Applications folder (Mac) or Start Menu (Windows)
2. You'll see a Welcome tab — you can close it

### 0.2 Open the Terminal Inside VS Code

- **Mac:** Press `Cmd + `` ` (backtick — the key above Tab, left of 1)
- **Windows:** Press `Ctrl + `` `
- A terminal panel will appear at the bottom of VS Code. This is where you'll type all commands.

### 0.3 Check if Git is Installed

Type this in the terminal and press Enter:
```bash
git --version
```
- If you see a version number (like `git version 2.39.0`) → Git is installed, skip to 0.4
- If you get an error → install Git:
  - **Mac:** Type `xcode-select --install` and press Enter, then follow the prompts
  - **Windows:** Download from https://git-scm.com/download/win, run the installer with default settings, then restart VS Code

### 0.4 Configure Git with Your Identity

Type these two commands one at a time (replace with your actual name and email):
```bash
git config --global user.name "Your Name"
```
```bash
git config --global user.email "your-email@example.com"
```
These commands won't show any output — that means they worked. Use the same email you'll use for GitHub.

### 0.5 Create a GitHub Account

1. Go to https://github.com in your browser
2. Click "Sign up" and create a free account
3. Use the same email you entered in step 0.4
4. You'll need this account later for deploying your project

---

## Step 1: Create the Project

### 1.1 Navigate to Your Desktop

In the VS Code terminal, type:
```bash
cd ~/Desktop
```
This tells the terminal "go to my Desktop folder." All commands after this will happen there.

### 1.2 Create the Project

Type:
```bash
npm create vite@latest synth-explorer -- --template react
```
- If it asks "Need to install the following packages... Ok to proceed?" → type `y` and press Enter
- This creates a new folder on your Desktop called `synth-explorer` with a React starter project inside

### 1.3 Open the Project in VS Code

Type:
```bash
code ~/Desktop/synth-explorer
```
- A **new VS Code window** will open with the `synth-explorer` project
- **Switch to this new window** — do all remaining work here
- You can close the old VS Code window

### 1.4 Open the Terminal in the New Window

In the new VS Code window:
- Press `Cmd + `` ` (Mac) or `Ctrl + `` ` (Windows) to open the terminal
- The terminal should show something like `~/Desktop/synth-explorer`
- This means you're inside your project folder

### 1.5 Install Dependencies

Run these commands one at a time. Wait for each to finish before running the next:
```bash
npm install
```
```bash
npm install tone
```
```bash
npm install -D tailwindcss @tailwindcss/vite gh-pages
```
You'll see progress output for each. Warnings are normal — errors are not.

### 1.6 Test That Everything Works

Type:
```bash
npm run dev
```
You should see output like:
```
VITE v6.x.x  ready in 300ms

➜  Local:   http://localhost:5173/
```
- **Hold `Cmd` (Mac) or `Ctrl` (Windows) and click the URL** to open it in your browser
- You should see the default Vite + React page (spinning logos)
- **Keep this terminal running** — it's your live dev server. Don't close it.

> **Tip:** If you need to run more commands while the dev server is running, click the `+` icon in the terminal panel to open a second terminal tab.

---

## Step 2: Set Up Project Files

### 2.1 Create the Docs Folder

Look at the **left sidebar** in VS Code — this is the **Explorer panel** showing your project files. If you don't see it, press `Cmd + Shift + E` (Mac) or `Ctrl + Shift + E` (Windows).

To create the `docs` folder:
1. Right-click on an empty area in the Explorer sidebar
2. Click **"New Folder"**
3. Type `docs` and press Enter

### 2.2 Add Your Documents to the Docs Folder

1. Open Finder (Mac) or File Explorer (Windows)
2. Find the three files you downloaded from our conversation:
   - `prd-analog-synth.md`
   - `build-instructions.md`
   - `getting-started-guide.md`
3. Drag and drop them into the `docs` folder in VS Code's sidebar

### 2.3 Create the Visual Reference Folder

1. Right-click on the `docs` folder in the sidebar
2. Click **"New Folder"**
3. Type `visual-reference` and press Enter
4. You'll add your wireframe and moodboard images here later

### 2.4 Create CLAUDE.md

This file tells Claude Code about your project. It reads this automatically.

1. Right-click on an **empty area** in the Explorer sidebar (not inside any folder — it needs to be at the top level, alongside `package.json`)
2. Click **"New File"**
3. Type `CLAUDE.md` and press Enter
4. The file will open in the editor. Paste in this content:

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

5. Save the file: `Cmd + S` (Mac) or `Ctrl + S` (Windows)

### 2.5 Verify Your File Structure

Your Explorer sidebar should now look something like this:
```
synth-explorer/
├── CLAUDE.md              ← you just created this
├── docs/
│   ├── prd-analog-synth.md
│   ├── build-instructions.md
│   ├── getting-started-guide.md
│   └── visual-reference/  ← empty for now
├── node_modules/          ← created by npm install (don't touch)
├── public/
├── src/
├── index.html
├── package.json
├── vite.config.js
└── ... other config files
```

---

## Step 3: Push to GitHub

### 3.1 Initialize Git

Open a new terminal tab (click `+` in the terminal panel) and run these one at a time:
```bash
git init
```
```bash
git add .
```
```bash
git commit -m "Initial project setup with docs"
```

### 3.2 Create the GitHub Repo

1. Go to https://github.com/new in your browser
2. Name it `synth-explorer`
3. Keep it **Public** (required for free GitHub Pages)
4. Do NOT check "Add a README" or any other option
5. Click **"Create repository"**
6. GitHub will show you setup instructions. Find the section that says **"...or push an existing repository from the command line"** and run those commands in your VS Code terminal. They look like:

```bash
git remote add origin https://github.com/YOUR-USERNAME/synth-explorer.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

- If it asks for your GitHub username and password, enter them
- If GitHub asks you to authenticate, follow the prompts (it may open a browser window)

---

## Step 4: Install VS Code Extensions

Press `Cmd + Shift + X` (Mac) or `Ctrl + Shift + X` (Windows) to open the Extensions panel.

Search for and install each of these (click "Install" next to each):

| Search for | Extension name | What it does |
|------------|---------------|--------------|
| `Tailwind CSS IntelliSense` | Tailwind CSS IntelliSense | Autocompletes Tailwind class names |
| `Prettier` | Prettier - Code formatter | Auto-formats code on save |
| `Error Lens` | Error Lens | Shows errors inline next to your code |
| `ES7+ React` | ES7+ React/Redux/GraphQL/React-Native snippets | Shortcuts for React code |

After installing, click back to the Explorer panel (`Cmd + Shift + E` / `Ctrl + Shift + E`) to return to your files.

---

## Step 5: Install the Frontend Design Skill

This prevents Claude Code from generating generic-looking UI.

In your VS Code terminal, open Claude Code and run:
```
/plugin marketplace add anthropics/skills
```

If that doesn't work, do it manually in a regular terminal tab:
```bash
mkdir -p .claude/skills/frontend-design
curl -o .claude/skills/frontend-design/SKILL.md https://raw.githubusercontent.com/anthropics/claude-code/main/plugins/frontend-design/skills/frontend-design/SKILL.md
```

---

## Step 6: Start Building with Claude Code

### 6.1 Open Claude Code

In VS Code, look for the Claude icon in the left sidebar and click it. Or use the command palette: `Cmd + Shift + P` (Mac) / `Ctrl + Shift + P` (Windows) → type "Claude" → select "Claude Code: Open".

### 6.2 Your First Prompt

Paste this into Claude Code:

```
I'm building an analog synthesizer web app. Read my project docs:
- CLAUDE.md (project root)
- docs/prd-analog-synth.md
- docs/build-instructions.md

We're starting Step 2 from the build instructions. Build the audio 
engine in src/audio/engine.js with the full Tone.js signal chain: 
oscillator → filter → envelope → reverb → delay → limiter → output. 
Expose functions for every parameter in PRD Section 5. Don't build 
any UI yet — I want to test this from the browser console first.
```

### 6.3 Testing the Audio Engine

After Claude Code creates the file:

1. Open your browser (where `npm run dev` is running)
2. Open DevTools: `Cmd + Option + J` (Mac) or `F12` (Windows) → click "Console" tab
3. Ask Claude Code: "Make the engine functions available on `window` so I can test from the console"
4. Then test in the browser console:

```javascript
await window.audioEngine.startDrone()       // Should hear sound
window.audioEngine.setOscillator('square')  // Sound should change
window.audioEngine.setFilterCutoff(500)     // Should sound muffled
window.audioEngine.stopDrone()              // Silence
```

If sound plays and changes, move to Step 3 in the build instructions.

### 6.4 Prompting Pattern for All Remaining Steps

Always follow this pattern:
```
Step [N] is working and tested. Let's move to Step [N+1]: [description 
from build instructions]. [Any specific notes about what you want.]
```

### 6.5 After Each Step

1. **Test** the feature in your browser
2. **Commit** your work:
```bash
git add .
git commit -m "Step N: what was built"
```
3. **Compact** Claude Code's memory (every 2-3 steps):
```
/compact Keep the architecture decisions and what we've built. Drop implementation details.
```

---

## Common Issues & Fixes

**"npm command not found"**
→ Node.js might not be in your PATH. Close and reopen VS Code entirely.

**Terminal shows wrong folder**
→ Type `pwd` to see where you are. Use `cd ~/Desktop/synth-explorer` to get back.

**No sound in browser**
→ Tone.js requires a user click before audio can play (browser autoplay policy). Make sure there's an `await Tone.start()` triggered by a button click.

**Dev server stopped**
→ The terminal running `npm run dev` might have closed. Open a new terminal tab and run `npm run dev` again.

**"Port 5173 already in use"**
→ Another dev server is still running. Close all terminal tabs and reopen one, then run `npm run dev`.

**Claude Code making changes you don't want**
→ Undo: `Cmd + Z` (Mac) / `Ctrl + Z` (Windows) in the file. Or use Git: `git checkout -- filename` to revert a specific file. Or `git checkout .` to revert everything since last commit.

**Audio glitching or crackling**
→ Ask Claude Code to use `rampTo()` instead of directly setting Tone.js parameter values.

**VS Code can't find a file**
→ Make sure you're in the right project. The title bar should say "synth-explorer".
