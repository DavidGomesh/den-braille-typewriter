# Graph Report - den-braille-typewriter  (2026-09-14)

## Corpus Check
- 138 files · ~118,809 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 34 file(s) not represented in the graph (top: .tex 17, (none) 6, .css 6)

## Summary
- 1175 nodes · 2301 edges · 88 communities (47 shown, 32 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 81 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5e7acdf0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- braille/public.ts
- FreePage.tsx
- feedback/public.ts
- Cell
- bootstrap.bundle.min.js
- Key
- Typewriter
- xt
- Journeys.test.tsx
- cs
- package.json
- qi
- cn
- Arquitetura alvo
- AudioProvider
- .hide
- Key.ts
- Typewriter.tsx
- Bt
- devDependencies
- on
- dependencies
- remove
- Es
- Ks
- compilerOptions
- H
- scripts
- check-lint-baseline.mjs
- Challenge
- us
- ui
- publicBasePathFromHomepage
- sn
- ._queueCallback
- W
- check-architecture.mjs
- check-audit-baseline.mjs
- manifest.json
- Value proposition canvas
- Challenge Mode Braille Interface
- Perkins Braille Typewriter
- Braille Simulator SWOT Analysis
- Longitudinal Value Perspective
- Braille simulator keyboard
- TMDEI Dissertation Formatting Guide
- Brailendo interface
- Braille Fácil interface
- Braillearning modes
- Braille character categorization
- Innovation process funnel
- Goal Question Metric Model
- Bootswatch Sketchy theme
- Braille Font Editor
- Braille simulator main menu
- architecture-policy.test.mjs
- .prettierrc.json
- quality-guardrails-policy.test.mjs
- Capability architecture and public interfaces
- Braille Alphabet Chart
- Braille-to-Keyboard Mapping
- BrailleType Mobile Input
- SingleTapBraille interface
- Braille Simulator Free Mode Interface
- delete
- Vite and automated Pages deployment
- Braille Dot Numbering
- Braillio Training Interface
- Portrait of Louis Braille
- Perky Duck Braille Editor
- Accessible Braille Simulator Value Proposition
- Concept Generation Cycle
- Goal Question Metric Map
- Braille Font Editor
- Página Não Encontrada
- React Logo
- React Application Branding
- Documentação de código
- Vite HTML entry point

## God Nodes (most connected - your core abstractions)
1. `Cell` - 73 edges
2. `Typewriter()` - 60 edges
3. `cs` - 40 edges
4. `xt` - 29 edges
5. `AudioProvider()` - 28 edges
6. `Arquitetura alvo` - 27 edges
7. `Key` - 26 edges
8. `remove()` - 23 edges
9. `W` - 23 edges
10. `qi` - 23 edges

## Surprising Connections (you probably didn't know these)
- `English technical contracts` --semantically_similar_to--> `Repository agent instructions`  [INFERRED] [semantically similar]
  docs/adr/0013-ingles-nos-contratos-tecnicos.md → AGENTS.md
- `Braille simulator domain glossary` --references--> `Portuguese Braille orthography 2018`  [EXTRACTED]
  CONTEXT.md → docs/Grafia Braille para a Língua Portuguesa.pdf
- `createWebStorage()` --calls--> `createLocalStoragePreferencesStorage()`  [EXTRACTED]
  tests/contracts/preferences-storage.test.ts → src/preferences/adapters/web/local-storage/localStorage.ts
- `setup()` --calls--> `createDefaultSimulatorPreferences()`  [EXTRACTED]
  tests/contracts/multimodal-feedback.test.ts → src/preferences/preferences.ts
- `TMDEI Dissertation Formatting Guide` --implements--> `TMDEI Dissertation Template`  [INFERRED]
  docs/tmdei-dissertation/main.pdf → docs/tmdei-dissertation/README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Free Mode Capability Composition** — src_session_readme_typing_session, src_braille_readme_braille_capability, src_feedback_readme_multimodal_feedback, src_preferences_readme_simulator_preferences [EXTRACTED 1.00]

## Communities (88 total, 32 thin omitted)

### Community 0 - "braille/public.ts"
Cohesion: 0.05
Nodes (87): advancePosition(), applyDocumentOperation(), assertCoordinate(), assertPositiveInteger(), BrailleDocument, BrailleDocumentReformat, BrailleGrid, confirmBrailleDocumentReformat() (+79 more)

### Community 1 - "FreePage.tsx"
Cohesion: 0.06
Nodes (78): createFreeSession(), freeModeRequirements, FreePage(), createPaperConfiguration(), ReviewDirection, MachineIntent, createBrailleDot(), createOrthographyProfile() (+70 more)

### Community 2 - "feedback/public.ts"
Cohesion: 0.07
Nodes (50): vitest, createMemoryFeedbackOutput(), MemoryFeedbackOutput, createWebSoundOutput(), WebAudio, WebAudioFactory, createBrowserSpeechOutput(), createWebSpeechOutput() (+42 more)

### Community 3 - "Cell"
Cohesion: 0.03
Nodes (65): Cell, C0, C1, C12, C123, C1234, C12345, C123456 (+57 more)

### Community 4 - "bootstrap.bundle.min.js"
Cohesion: 0.10
Nodes (45): Ae(), be(), Ce(), D(), De(), di(), $e(), Ee() (+37 more)

### Community 5 - "Key"
Cohesion: 0.06
Nodes (41): @fortawesome/free-solid-svg-icons, @fortawesome/react-fontawesome, getDefaultBootstrapClasses(), Keyboard(), KeyStatus, NKeyboardProps, getDefaultBootstrapClasses(), getKeyIcon() (+33 more)

### Community 6 - "Typewriter"
Cohesion: 0.08
Nodes (28): addTextToTextArea(), Typewriter(), handleArrowKeyReleased(), handleBackspaceKeyReleased(), handleBlankKeyPressed(), handleBlankKeyReleased(), handleDotKeyPressed(), handleEnterKeyPressed() (+20 more)

### Community 7 - "xt"
Cohesion: 0.11
Nodes (3): st, s(), xt

### Community 8 - "Journeys.test.tsx"
Cohesion: 0.09
Nodes (11): react, react-router-dom, @testing-library/react, playMainMenuAudio(), AudioStub, letterChords, speechSynthesisStub, UtteranceStub (+3 more)

### Community 10 - "package.json"
Cohesion: 0.07
Nodes (26): engines, node, homepage, name, private, version, bootstrap, eslint (+18 more)

### Community 13 - "Arquitetura alvo"
Cohesion: 0.05
Nodes (44): Repository agent instructions, Changelog and release history, Braille simulator domain glossary, Pure Braille machine engine, Braille document as interpretation source, Typing session as pure coordinator, Independent simulator experiences, Semantic multimodal feedback (+36 more)

### Community 14 - "AudioProvider"
Cohesion: 0.12
Nodes (20): handleMuteKeyboardSoundsKeyPressed(), handleToogleViewModeKeyPressed(), muteKeyboard(), unmuteKeyboard(), AudioProvider(), playAudio(), playBrailleViewAudio(), playChallengeModeAudio() (+12 more)

### Community 16 - "Key.ts"
Cohesion: 0.16
Nodes (18): handleActionKeyPressed(), handleActionKeyReleased(), handleArrowKeyPressed(), handleControlKeyPressed(), handleKeyReleased(), handleMappedKeyPressed(), handleMappedKeyReleased(), actionKeys (+10 more)

### Community 17 - "Typewriter.tsx"
Cohesion: 0.22
Nodes (13): immutable, getPreviousCharacter(), NOutput(), OutputProps, TypewriterProps, cellStringMap, cellToString(), findCell() (+5 more)

### Community 19 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-plugin-react-hooks, eslint-plugin-testing-library, jsdom, prettier, @testing-library/dom, @testing-library/jest-dom (+8 more)

### Community 21 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, bootstrap, @fortawesome/fontawesome-svg-core, @fortawesome/free-brands-svg-icons, @fortawesome/free-regular-svg-icons, @fortawesome/free-solid-svg-icons, @fortawesome/react-fontawesome, fp-ts (+7 more)

### Community 25 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, allowJs, checkJs, esModuleInterop, forceConsistentCasingInFileNames, jsx, lib, module (+6 more)

### Community 27 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, architecture, audit, build, ci, format, lint, preview (+4 more)

### Community 28 - "check-lint-baseline.mjs"
Cohesion: 0.24
Nodes (7): baseline, eslint, { newFailures, resolvedFailures }, rootDirectory, evaluateLint(), fingerprint(), baseline

### Community 29 - "Challenge"
Cohesion: 0.25
Nodes (11): playChallengeModeInstructionsAudio(), playHowToAccessInstructionsAudio(), playRightAnswer(), playWordAudio(), playWrongAnswer(), Challenge(), getNextRandomWord(), playRandomWordAudio() (+3 more)

### Community 32 - "publicBasePathFromHomepage"
Cohesion: 0.36
Nodes (5): publicBasePathFromHomepage(), @vitejs/plugin-react, createNotFoundPage(), preparePagesArtifact(), publicBasePath

### Community 36 - "check-architecture.mjs"
Cohesion: 0.33
Nodes (8): typescript, ALLOWED_DEPENDENCIES, findArchitectureViolations(), importedModules(), listSourceFiles(), normalizedRelativePath(), projectRoot, SOURCE_EXTENSIONS

### Community 37 - "check-audit-baseline.mjs"
Cohesion: 0.28
Nodes (5): evaluateAudit(), baseline, audit, baseline, { regressions, newOccurrences, resolvedOccurrences }

### Community 38 - "manifest.json"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 39 - "Value proposition canvas"
Cohesion: 0.29
Nodes (7): Customer jobs, Gain creators, Gains, Pain relievers, Pains, Products and services, Value proposition canvas

### Community 41 - "Challenge Mode Braille Interface"
Cohesion: 0.33
Nodes (6): Answer Verification, Audio Controls, Braille Response Area, Challenge Mode Braille Interface, Physical Key Mapping, Target Word

### Community 45 - "Perkins Braille Typewriter"
Cohesion: 0.40
Nodes (5): Backspace Key, Perkins Braille Typewriter, Line Change Key, Six Dot Keys, Space Key

### Community 46 - "Braille Simulator SWOT Analysis"
Cohesion: 0.40
Nodes (5): Braille Simulator SWOT Analysis, Opportunities, Strengths, Threats, Weaknesses

### Community 47 - "Longitudinal Value Perspective"
Cohesion: 0.40
Nodes (5): Disposition, Ex Ante Value Creation, Ex Post Value Creation, Longitudinal Value Perspective, Transaction Value Creation

### Community 48 - "Braille simulator keyboard"
Cohesion: 0.40
Nodes (5): Backspace control, Braille simulator keyboard, Carriage return control, Six Braille dot keys, Space control

### Community 49 - "TMDEI Dissertation Formatting Guide"
Cohesion: 0.40
Nodes (5): ISEP Institutional Identity, TMDEI Dissertation Formatting Guide, Thesis Writing Comic, Electron Illustration, TMDEI Dissertation Template

### Community 51 - "Brailendo interface"
Cohesion: 0.50
Nodes (4): Brailendo interface, Educational modules, Multimodal Braille representation, Perkins keyboard input

### Community 52 - "Braille Fácil interface"
Cohesion: 0.50
Nodes (4): Braille Fácil interface, Braille print preview, Ink text editor, Perkins keyboard input

### Community 53 - "Braillearning modes"
Cohesion: 0.50
Nodes (4): Braillearning modes, Free mode, Tutorial mode, Word mode

### Community 54 - "Braille character categorization"
Cohesion: 0.50
Nodes (4): Braille character categorization, Dot-count categories, Six-dot cell geometry, Touch gesture mapping

### Community 55 - "Innovation process funnel"
Cohesion: 0.50
Nodes (4): Commercialization, Fuzzy front end, Innovation process funnel, New product development

### Community 56 - "Goal Question Metric Model"
Cohesion: 0.50
Nodes (4): Goals, Goal Question Metric Model, Metrics, Questions

### Community 57 - "Bootswatch Sketchy theme"
Cohesion: 0.50
Nodes (4): Bootswatch Sketchy theme, Button components, Hand-drawn visual style, Navbar components

### Community 58 - "Braille Font Editor"
Cohesion: 0.50
Nodes (4): Braille Glyph Catalog, Font Export Formats, Braille Font Editor, Unicode Character Mapping

### Community 59 - "Braille simulator main menu"
Cohesion: 0.50
Nodes (4): About navigation, Braille simulator main menu, Challenge mode navigation, Free mode navigation

### Community 61 - ".prettierrc.json"
Cohesion: 0.50
Nodes (3): semi, singleQuote, tabWidth

### Community 63 - "Capability architecture and public interfaces"
Cohesion: 0.67
Nodes (3): Thin pages by capabilities, Capability architecture and public interfaces, Incremental reversible migration

### Community 64 - "Braille Alphabet Chart"
Cohesion: 0.67
Nodes (3): Braille Alphabet Chart, Latin Alphabet, Six-Dot Braille Cells

### Community 65 - "Braille-to-Keyboard Mapping"
Cohesion: 0.67
Nodes (3): FDS JKL Chord Keys, Braille-to-Keyboard Mapping, Perkins Brailler Key Layout

### Community 66 - "BrailleType Mobile Input"
Cohesion: 0.67
Nodes (3): Handheld Smartphone, BrailleType Mobile Input, Touchscreen Braille Layout

### Community 67 - "SingleTapBraille interface"
Cohesion: 0.67
Nodes (3): Mobile text entry field, Single-tap Braille input, SingleTapBraille interface

### Community 68 - "Braille Simulator Free Mode Interface"
Cohesion: 0.67
Nodes (3): Braille Typing Area, Braille Simulator Free Mode Interface, Free Mode Multimodal Controls

## Knowledge Gaps
- **334 isolated node(s):** `semi`, `singleQuote`, `tabWidth`, `delete`, `name` (+329 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 478 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Cell` connect `Cell` to `Key.ts`, `Typewriter.tsx`, `FreePage.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `vitest` connect `feedback/public.ts` to `braille/public.ts`, `FreePage.tsx`, `Journeys.test.tsx`, `package.json`, `Key.ts`, `Typewriter.tsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `react` connect `Journeys.test.tsx` to `FreePage.tsx`, `feedback/public.ts`, `Key`, `package.json`, `Typewriter.tsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `Typewriter()` (e.g. with `handleBackspaceKeyPressed()` and `handleBackspaceKeyReleased()`) actually correct?**
  _`Typewriter()` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Are the 20 inferred relationships involving `AudioProvider()` (e.g. with `createBrowserSpeechOutput()` and `playAboutModeAudio()`) actually correct?**
  _`AudioProvider()` has 20 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `tabWidth` to the rest of the system?**
  _334 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `braille/public.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05483405483405483 - nodes in this community are weakly interconnected._