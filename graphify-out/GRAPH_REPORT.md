# Graph Report - den-braille-typewriter  (2026-09-27)

## Corpus Check
- 149 files · ~124,048 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 36 file(s) not represented in the graph (top: .tex 17, .css 8, (none) 6)

## Summary
- 1237 nodes · 2416 edges · 96 communities (62 shown, 26 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 81 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d36ad618`
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
- AudioProvider.tsx
- cs
- package.json
- qi
- cn
- Arquitetura alvo
- AudioProvider
- ao
- Key.ts
- Typewriter.tsx
- Bt
- devDependencies
- remove
- dependencies
- document.ts
- Es
- qn
- compilerOptions
- Jn
- scripts
- check-lint-baseline.mjs
- BrailleRendererDemoPage.tsx
- machine.ts
- publicBasePathFromHomepage
- vitest
- Design System: Máquina Den Braille
- W
- check-architecture.mjs
- check-audit-baseline.mjs
- manifest.json
- Value proposition canvas
- session.ts
- Challenge Mode Braille Interface
- Renderer visual Braille — alpha.3
- Perkins Braille Typewriter
- Braille Simulator SWOT Analysis
- Longitudinal Value Perspective
- Braille simulator keyboard
- TMDEI Dissertation Formatting Guide
- Produto
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
- handleBlankKeyPressed
- Braille simulator domain glossary
- Perfil português Braille 2018
- Changelog and release history
- Distributed accessibility contract
- PRODUCT.md
- Demonstração visual de Impressões de cela

## God Nodes (most connected - your core abstractions)
1. `Cell` - 73 edges
2. `Typewriter()` - 60 edges
3. `cs` - 40 edges
4. `xt` - 29 edges
5. `AudioProvider()` - 28 edges
6. `Arquitetura alvo` - 28 edges
7. `Key` - 26 edges
8. `remove()` - 23 edges
9. `W` - 23 edges
10. `qi` - 23 edges

## Surprising Connections (you probably didn't know these)
- `Braille simulator domain glossary` --references--> `Portuguese Braille orthography 2018`  [EXTRACTED]
  CONTEXT.md → docs/Grafia Braille para a Língua Portuguesa.pdf
- `English technical contracts` --semantically_similar_to--> `Repository agent instructions`  [INFERRED] [semantically similar]
  docs/adr/0013-ingles-nos-contratos-tecnicos.md → AGENTS.md
- `Braille simulator project overview` --references--> `Arquitetura alvo`  [EXTRACTED]
  README.md → docs/architecture/README.md
- `Braille document as interpretation source` --conceptually_related_to--> `Braille simulator domain glossary`  [INFERRED]
  docs/adr/0002-documento-braille-e-grafia-contextual.md → CONTEXT.md
- `createWebStorage()` --calls--> `createLocalStoragePreferencesStorage()`  [EXTRACTED]
  tests/contracts/preferences-storage.test.ts → src/preferences/adapters/web/local-storage/localStorage.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Free Mode Capability Composition** — src_session_readme_typing_session, src_braille_readme_braille_capability, src_feedback_readme_multimodal_feedback, src_preferences_readme_simulator_preferences [EXTRACTED 1.00]

## Communities (96 total, 26 thin omitted)

### Community 0 - "braille/public.ts"
Cohesion: 0.13
Nodes (27): BrailleDocument, DocumentPosition, PositionedCellImpression, AmbiguousSegment, areAdjacent(), BrailleInterpretation, cellKey(), digits (+19 more)

### Community 1 - "FreePage.tsx"
Cohesion: 0.06
Nodes (61): createFreeSession(), freeModeRequirements, FreePage(), interpretedText(), portugueseSpokenCharacters, resolveAutomaticReading(), resolveSpokenCharacter(), createMemoryPreferencesStorage() (+53 more)

### Community 2 - "feedback/public.ts"
Cohesion: 0.07
Nodes (48): createMemoryFeedbackOutput(), MemoryFeedbackOutput, createWebSoundOutput(), WebAudio, WebAudioFactory, createBrowserSpeechOutput(), createWebSpeechOutput(), selectVoice() (+40 more)

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
Cohesion: 0.09
Nodes (20): Typewriter(), handleActionKeyPressed(), handleActionKeyReleased(), handleArrowKeyPressed(), handleArrowKeyReleased(), handleBackspaceKeyReleased(), handleBlankKeyReleased(), handleControlKeyPressed() (+12 more)

### Community 7 - "xt"
Cohesion: 0.07
Nodes (4): getElementFromSelector(), Ks, st, xt

### Community 8 - "AudioProvider.tsx"
Cohesion: 0.11
Nodes (13): react, challengeModeInstructionsPortuguese, freeModeInstructionsPortuguese, AudioContext, playFreeModeAudio(), useAudioContext(), AudioStub, letterChords (+5 more)

### Community 10 - "package.json"
Cohesion: 0.07
Nodes (26): engines, node, homepage, name, private, version, bootstrap, eslint (+18 more)

### Community 13 - "Arquitetura alvo"
Cohesion: 0.11
Nodes (20): Idioma do código, Documentação de domínio, GitHub Issues, Funções de triagem, Estrutura alvo, Prontidão Alpha 2, Modernização incremental, Baseline operacional (+12 more)

### Community 14 - "AudioProvider"
Cohesion: 0.11
Nodes (25): handleToogleViewModeKeyPressed(), AudioProvider(), playAudio(), playBrailleViewAudio(), playChallengeModeAudio(), playChallengeModeInstructionsAudio(), playEnterAudio(), playHowToAccessInstructionsAudio() (+17 more)

### Community 16 - "Key.ts"
Cohesion: 0.18
Nodes (16): handleKeyPressed(), handleKeyReleased(), handleMappedKeyPressed(), handleMappedKeyReleased(), handleUnmappedKeyPressed(), wasKeyPressedWithCtrl(), actionKeys, arrowKeys (+8 more)

### Community 17 - "Typewriter.tsx"
Cohesion: 0.25
Nodes (11): immutable, addTextToTextArea(), getPreviousCharacter(), NOutput(), OutputProps, TypewriterProps, cellStringMap, cellToString() (+3 more)

### Community 19 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-plugin-react-hooks, eslint-plugin-testing-library, jsdom, prettier, @testing-library/dom, @testing-library/jest-dom (+8 more)

### Community 20 - "remove"
Cohesion: 0.15
Nodes (3): d(), on(), remove()

### Community 21 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, bootstrap, @fortawesome/fontawesome-svg-core, @fortawesome/free-brands-svg-icons, @fortawesome/free-regular-svg-icons, @fortawesome/free-solid-svg-icons, @fortawesome/react-fontawesome, fp-ts (+7 more)

### Community 22 - "document.ts"
Cohesion: 0.12
Nodes (29): advancePosition(), BrailleDocumentReformat, confirmBrailleDocumentReformat(), ContinuousPaperConfiguration, createBrailleGrid(), createDocumentPosition(), firstPosition(), freezeDocument() (+21 more)

### Community 25 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, allowJs, checkJs, esModuleInterop, forceConsistentCasingInFileNames, jsx, lib, module (+6 more)

### Community 26 - "Jn"
Cohesion: 0.06
Nodes (6): focusableChildren(), H, Jn, sn, ui(), s()

### Community 27 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, architecture, audit, build, ci, format, lint, preview (+4 more)

### Community 28 - "check-lint-baseline.mjs"
Cohesion: 0.24
Nodes (7): baseline, eslint, { newFailures, resolvedFailures }, rootDirectory, evaluateLint(), fingerprint(), baseline

### Community 30 - "BrailleRendererDemoPage.tsx"
Cohesion: 0.13
Nodes (23): react-router-dom, @testing-library/react, BrailleRendererDemoPage(), restoreDefaults(), dots, DotState, examples, initialDots (+15 more)

### Community 31 - "machine.ts"
Cohesion: 0.16
Nodes (18): embossCell(), CellImpression, applyIntent(), createEngineState(), createResult(), createState(), DirectOperationType, EngineEvent (+10 more)

### Community 32 - "publicBasePathFromHomepage"
Cohesion: 0.36
Nodes (5): publicBasePathFromHomepage(), @vitejs/plugin-react, createNotFoundPage(), preparePagesArtifact(), publicBasePath

### Community 33 - "vitest"
Cohesion: 0.16
Nodes (18): vitest, assertCoordinate(), assertPositiveInteger(), createBrailleDocument(), createGridPosition(), createPaperConfiguration(), eraseCellDots(), freezeMargins() (+10 more)

### Community 34 - "Design System: Máquina Den Braille"
Cohesion: 0.11
Nodes (18): Colors, Components, Design System: Máquina Den Braille, Do:, Do's and Don'ts, Don't:, Elevation & Depth, Hierarchy (+10 more)

### Community 35 - "W"
Cohesion: 0.14
Nodes (3): Q, W, Y

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

### Community 40 - "session.ts"
Cohesion: 0.35
Nodes (11): applyDocumentOperation(), interpretBrailleDocument(), sourceLines(), activeCapture(), applyMachineTransition(), applySessionInput(), createResult(), createSnapshot() (+3 more)

### Community 41 - "Challenge Mode Braille Interface"
Cohesion: 0.33
Nodes (6): Answer Verification, Audio Controls, Braille Response Area, Challenge Mode Braille Interface, Physical Key Mapping, Target Word

### Community 43 - "Renderer visual Braille — alpha.3"
Cohesion: 0.40
Nodes (4): Contrato implementado, Procedimento manual aplicável, Renderer visual Braille — alpha.3, Verificação automática

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

### Community 50 - "Produto"
Cohesion: 0.18
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product Principles (+3 more)

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

### Community 94 - "handleBlankKeyPressed"
Cohesion: 0.20
Nodes (14): handleBlankKeyPressed(), handleDotKeyPressed(), handleMuteKeyboardSoundsKeyPressed(), handleTypewriterKeyPressed(), isKeyboardMuted(), keyAlreadyPressed(), muteKeyboard(), noKeysPressed() (+6 more)

### Community 95 - "Braille simulator domain glossary"
Cohesion: 0.40
Nodes (6): Braille simulator domain glossary, Pure Braille machine engine, Braille document as interpretation source, Typing session as pure coordinator, Independent simulator experiences, Portuguese Braille orthography 2018

### Community 96 - "Perfil português Braille 2018"
Cohesion: 0.40
Nodes (6): Perfil português Braille 2018, Algoritmo de Interpretação Braille, Capacidade Braille, Feedback Multimodal, Preferências do Simulador, Sessão de Digitação

### Community 98 - "Changelog and release history"
Cohesion: 0.40
Nodes (5): Repository agent instructions, Changelog and release history, Git Flow and versioned releases, English technical contracts, Versioned prerelease workflow

### Community 99 - "Distributed accessibility contract"
Cohesion: 0.40
Nodes (5): Semantic multimodal feedback, Distributed accessibility contract, Interface-driven testing guardrails, Continuous integration workflow, Braille simulator project overview

## Knowledge Gaps
- **368 isolated node(s):** `semi`, `singleQuote`, `tabWidth`, `delete`, `name` (+363 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 516 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `AudioProvider.tsx` to `FreePage.tsx`, `feedback/public.ts`, `Key`, `package.json`, `Typewriter.tsx`, `BrailleRendererDemoPage.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `FreePage.tsx`, `feedback/public.ts`, `AudioProvider.tsx`, `package.json`, `Key.ts`, `Typewriter.tsx`, `BrailleRendererDemoPage.tsx`, `machine.ts`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `Cell` connect `Cell` to `Key.ts`, `Typewriter.tsx`, `AudioProvider.tsx`, `FreePage.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `Typewriter()` (e.g. with `handleBackspaceKeyPressed()` and `handleBackspaceKeyReleased()`) actually correct?**
  _`Typewriter()` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Are the 20 inferred relationships involving `AudioProvider()` (e.g. with `createBrowserSpeechOutput()` and `playAboutModeAudio()`) actually correct?**
  _`AudioProvider()` has 20 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `tabWidth` to the rest of the system?**
  _368 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `braille/public.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1330049261083744 - nodes in this community are weakly interconnected._