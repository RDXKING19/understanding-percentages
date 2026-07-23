// scripts/generate_audio.js
//
// Pre-generates all known narration phrases as .mp3 files into
// public/assets/audio/ and writes src/utils/audioMap.js.
//
// Usage: npm run generate-audio
// Requires: VITE_ELEVENLABS_API_KEY in .env.local

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const [key, ...vals] = line.split('=');
    if (key && !process.env[key.trim()]) {
      process.env[key.trim()] = vals.join('=').trim();
    }
  }
}
loadEnv();

const API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('❌  VITE_ELEVENLABS_API_KEY not set in .env.local');
  process.exit(1);
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const VOICE_MODEL = 'eleven_multilingual_v2';
const AUDIO_DIR = path.join(__dirname, '..', 'public', 'assets', 'audio');
const MAP_PATH  = path.join(__dirname, '..', 'src', 'utils', 'audioMap.js');

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30 },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50 },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60 },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20 },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40 },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80 },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30 },
};

// ── Phrases to pre-generate ────────────────────────────────────────────────
// Every string here must exactly match the text passed to playNarration()
// in src/utils/narration.js, so audioMap.js lookups succeed at runtime.
// Generated from the segments actually fired by the app — keep this in
// sync whenever narration.js changes.
const phrases = [
  // WONDER — narrated text is built from each WONDER_QUESTIONS entry
  // (question + subtext), so it always matches the on-screen card exactly.
  { text: "Hmm, I wonder! A sign says '25% OFF' a $20 toy. How much do you actually save?", style: 'encouragement' },
  { text: "Percent tells us a part of the price — but what part?", style: 'thinking' },
  { text: "Hmm, I wonder! In Priya's class, 8 out of 10 students voted for pizza. What percent is that?", style: 'encouragement' },
  { text: "Percent means 'out of 100' — even when the total isn't 100!", style: 'thinking' },
  { text: "Hmm, I wonder! A goalie saved 18 out of 20 shots. Is that a good percentage?", style: 'encouragement' },
  { text: "Percentages help us compare performance fairly!", style: 'thinking' },
  { text: "Hmm, I wonder! If a glass is 0.5 full, what percent full is that?", style: 'encouragement' },
  { text: "Decimals and percents are just two ways of writing the same amount!", style: 'thinking' },
  { text: "Hmm, I wonder! How do we turn a fraction like 3/4 into a percent?", style: 'encouragement' },
  { text: "Hint: what do 3/4 and 75/100 have in common?", style: 'thinking' },
  // STORY — The Sticker Sale
  { text: "Priya's class has a booth at the school fair, selling stickers! They made exactly 100 stickers to sell — a nice round number. By lunchtime, 42 of the 100 stickers are sold. Dev wants to tell everyone how the booth is doing, but saying 42 out of 100 every time feels clunky. Priya wonders... is there a simpler way to describe this amount? Let's help Priya and Dev!", style: 'statement' },
  { text: "We can use percent! says Priya. Percent means per hundred — it tells us how many out of every 100. Since exactly 42 of the 100 stickers are sold, that's 42 percent. Percent lets us describe and compare parts of a whole using the very same friendly scale of 100, every time. Percent means out of 100!", style: 'statement' },
  { text: "Dev shows the connection: 42 percent is the same amount as the fraction 42 over 100, and the decimal 0.42. Whether we write it as a fraction, a decimal, or a percent, says Dev, it's still the exact same amount — just written in a different way! Percent, fraction, decimal — same amount!", style: 'statement' },
  { text: "By the end of the fair, Priya and Dev could describe every booth's sales using percentages. Now let's practice finding percentages of all kinds of amounts. Are you ready? Your turn now!", style: 'celebration' },
  // SIMULATE
  { text: "Station one — Percent on the Grid! A line marks a percent between two benchmarks. Tap the benchmark it's closest to. Let's go!", style: 'statement' },
  { text: "Station two — Percent Grid Spotlight! Look at the shaded grid. Find how many of the 100 squares are shaded. Look carefully!", style: 'statement' },
  { text: "Final station — Percent It Out! You will see a percent-of-a-number problem to solve. Use the number pad to type your answer. You've got this!", style: 'statement' },
  // PLAY — Boss Battle
  { text: "The Boss Battle begins! Answer the questions correctly to defeat the boss and claim your Percent Pro trophy!", style: 'emphasis' },
  { text: "You defeated the boss! The Golden Percent Trophy is yours!", style: 'celebration' },
  // INTRO / reserved — not currently narrated on-screen, but pre-generated
  // for future use (e.g. if IntroScreen narration is wired in later).
  { text: "Let's explore understanding percentages!", style: 'encouragement' },
];


// ── Helpers ───────────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 55);
}

// ── CLI args ──────────────────────────────────────────────────────────────
// node scripts/generate_audio.js --index 4
// node scripts/generate_audio.js --text "Hello there!" --style celebration
// node scripts/generate_audio.js --list                (show all phrases + indices)
function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--index') out.index = parseInt(args[++i], 10);
    if (args[i] === '--text') out.text = args[++i];
    if (args[i] === '--style') out.style = args[++i];
    if (args[i] === '--list') out.list = true;
  }
  return out;
}

async function generateAudio(text, style) {
  const settings = VOICE_SETTINGS[style] ?? VOICE_SETTINGS.statement;
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'xi-api-key': API_KEY },
      body: JSON.stringify({ text, model_id: VOICE_MODEL, voice_settings: settings }),
    }
  );
  if (!res.ok) throw new Error(`ElevenLabs error ${res.status}: ${await res.text()}`);
  const buf = await res.arrayBuffer();
  return Buffer.from(buf);
}

// ── Main ──────────────────────────────────────────────────────────────────
(async () => {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  const { index, text: cliText, style: cliStyle, list } = parseArgs();

  if (list) {
    phrases.forEach((p, i) => console.log(`[${i}] (${p.style}) ${p.text.slice(0, 70)}…`));
    return;
  }

  if (cliText) {
    const style = cliStyle || 'statement';
    const filename = `audio_${slugify(cliText)}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    console.log(`🎙  Generating single statement (${style}): "${cliText.slice(0, 60)}…"`);
    const buf = await generateAudio(cliText, style);
    fs.writeFileSync(filePath, buf);
    console.log(`✅  Saved: public/assets/audio/${filename}`);
    return;
  }

  if (Number.isInteger(index)) {
    const phrase = phrases[index];
    if (!phrase) {
      console.error(`❌  No phrase at index ${index}. Run with --list to see valid indices.`);
      return;
    }
    const filename = `audio_${slugify(phrase.text)}_${index}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    console.log(`🎙  Generating [${index}] ${phrase.style}: "${phrase.text.slice(0, 60)}…"`);
    const buf = await generateAudio(phrase.text, phrase.style);
    fs.writeFileSync(filePath, buf);
    console.log(`✅  Saved: public/assets/audio/${filename}`);
    console.log(`ℹ️   This single run does NOT rewrite audioMap.js — run without flags to regenerate the full map.`);
    return;
  }

  // No flags: full batch generation
  const audioMapEntries = [];
  let generated = 0;

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const filename = `audio_${slugify(text)}_${i}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    const assetPath = `assets/audio/${filename}`;

    audioMapEntries.push([text, assetPath]);

    if (fs.existsSync(filePath)) {
      console.log(`⏭  Skipping (exists): ${filename}`);
      continue;
    }

    try {
      process.stdout.write(`🎙  Generating [${i + 1}/${phrases.length}] ${style}: "${text.slice(0, 48)}…" `);
      const buf = await generateAudio(text, style);
      fs.writeFileSync(filePath, buf);
      console.log(`✓ ${filename}`);
      generated++;
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error(`\n❌  Failed: ${err.message}`);
    }
  }

  const mapContent = `// src/utils/audioMap.js
// AUTO-GENERATED by scripts/generate_audio.js — do not edit by hand.
// Run \`npm run generate-audio\` to regenerate.

export const audioMap = {
${audioMapEntries.map(([text, p]) => `  ${JSON.stringify(text)}: ${JSON.stringify(p)},`).join('\n')}
};
`;
  fs.writeFileSync(MAP_PATH, mapContent);

  console.log(`\n✅  Done. Generated ${generated} new files. audioMap.js updated (${audioMapEntries.length} entries).`);
})();
