// src/utils/narration.js
//
// Semantic helper functions wrap narration text with an ElevenLabs
// "style" tag. Every string here MUST exactly match the on-screen
// text shown in UI components (1:1 parity) and the `phrases` array
// in scripts/generate_audio.js, so audioMap.js lookups succeed.
// (No pre-generated audio ships with this module — narration falls
// back to a silent skip unless VITE_ELEVENLABS_API_KEY is set. See
// `npm run generate-audio` in the README for how to add voice.)

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'encouragement' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const celebrate = (text) => ({ text, style: 'celebration' });
export const instruct  = (text) => ({ text, style: 'instruction' });

export {
  VOICE_SETTINGS,
  VOICE_ID,
  VOICE_MODEL,
} from '../config/audio.config.js';

// ─── INTRO ────────────────────────────────────────────────────────────────
export function introNarration() {
  return [cheer("Let's explore understanding percentages!")];
}

// ─── WONDER ──────────────────────────────────────────────────────────────
// Narrates the EXACT question + subtext shown on screen (built from the
// WONDER_QUESTIONS entry itself) so audio/visual text can never drift apart.
export function wonderHookNarration(wonder) {
  if (!wonder) return [];
  return [
    cheer(`Hmm, I wonder! ${wonder.question}`),
    think(wonder.subtext),
  ];
}

// ─── STORY — "The Sticker Sale" ───────────────────────────────────────────
export const storyNarrations = {
  percentages: [
    say("Priya's class has a booth at the school fair, selling stickers! They made exactly 100 stickers to sell — a nice round number. By lunchtime, 42 of the 100 stickers are sold. Dev wants to tell everyone how the booth is doing, but saying 42 out of 100 every time feels clunky. Priya wonders... is there a simpler way to describe this amount? Let's help Priya and Dev!"),
    say("We can use percent! says Priya. Percent means per hundred — it tells us how many out of every 100. Since exactly 42 of the 100 stickers are sold, that's 42 percent. Percent lets us describe and compare parts of a whole using the very same friendly scale of 100, every time. Percent means out of 100!"),
    say("Dev shows the connection: 42 percent is the same amount as the fraction 42 over 100, and the decimal 0.42. Whether we write it as a fraction, a decimal, or a percent, says Dev, it's still the exact same amount — just written in a different way! Percent, fraction, decimal — same amount!"),
    celebrate("By the end of the fair, Priya and Dev could describe every booth's sales using percentages. Now let's practice finding percentages of all kinds of amounts. Are you ready? Your turn now!"),
  ],
};

// ─── SIMULATE ────────────────────────────────────────────────────────────
const SIMULATION_NARRATIONS = [
  [say("Station one — Percent on the Grid! A line marks a percent between two benchmarks. Tap the benchmark it's closest to. Let's go!")],
  [say("Station two — Percent Grid Spotlight! Look at the shaded grid. Find how many of the 100 squares are shaded. Look carefully!")],
  [say("Final station — Percent It Out! You will see a percent-of-a-number problem to solve. Use the number pad to type your answer. You've got this!")],
];

export function simulationStationNarration(stationIndex) {
  return SIMULATION_NARRATIONS[stationIndex] ?? [];
}

// ─── PLAY ─────────────────────────────────────────────────────────────────
export const CORRECT_NARRATIONS = [
  cheer("Excellent! You've got it!"),
  cheer("Brilliant! Keep going!"),
  cheer("That's exactly right! Well done!"),
];

export const WRONG_NARRATIONS = [
  think("Not quite, but good try! Remember, percent means out of 100."),
  think("Almost! Check your percent-of-number calculation, then try again."),
];

export function bossBattleNarration() {
  return [emphasize("The Boss Battle begins! Answer the questions correctly to defeat the boss and claim your Percent Pro trophy!")];
}

export function bossWinNarration() {
  return [celebrate("You defeated the boss! The Golden Percent Trophy is yours!")];
}
