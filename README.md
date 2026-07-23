# Understanding Percentages — Grade 5 Math Module

Interactive Grade 5 Math module teaching percentages — percent as
"per hundred", fraction/decimal/percent equivalence, benchmark percent
estimation, and finding a percent of a number — through a 5-phase guided
journey: **Wonder → Story → Simulate → Play → Reflect**.

Built with the same architecture/engine as the Grade 5 "Rounding Decimals"
module (itself built on the Grade 2 "Equal Groups" multiplication module) —
only the content and a few interaction visuals have been swapped for this
topic.

## Quick start

```bash
npm install
npm run dev       # local dev server
npm run build      # production build → dist/
```

## Story artwork

The story phase ships with generated placeholder illustrations at
`src/assets/story/1.png` … `4.png`, sized **1600×640 px** — the same
size used by the reference module. Replace them with your own artwork of
the same dimensions — see `src/assets/story/README.md` for exact
per-slide content and descriptions.

## Optional: narration audio

No pre-generated voice audio ships with this module (`src/utils/audioMap.js`
is empty) — narration text still exists and the module works fine with
narration silently skipped. To generate real audio with ElevenLabs:

```bash
echo "VITE_ELEVENLABS_API_KEY=your_key_here" > .env.local
npm run generate-audio
```

## What's different from the reference module

- **Content**: all story/wonder/simulate/play/reflect text rewritten for
  understanding percentages (characters: Priya, Dev, and mascot Percy the
  Parrot).
- **New visuals**: `PercentGrid` (a 10×10 shaded-square grid) and
  `PercentLineDiagram` (a benchmark percent line) replace the number-line
  and place-value-chart visuals, used across Simulate and Play.
- **New Simulate stations**: Percent on the Line (round to the nearest
  benchmark), Percent Grid Spotlight (read the shaded percent), Percent
  It Out (type the percent of a number, using the number pad).
- **Question bank**: 100 procedurally generated questions across 10
  question types (`src/core/questions/questionBank.js`), built on an
  exact-integer percentage engine (`src/core/percentages/percentages.js`)
  that keeps every answer a clean whole number — no floating-point
  surprises.
- **Larger fonts for visibility**: Simulate and Play/game screens use
  bigger text, bigger tap targets, and roomier spacing for easier reading
  and smoother tapping through the games; Story/Wonder/Reflect sizing is
  unchanged from the reference module.
