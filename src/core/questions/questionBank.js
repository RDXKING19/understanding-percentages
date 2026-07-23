// src/core/questions/questionBank.js
// Procedural question generator — 100 questions, 10 types, 10 worlds
import { BADGES } from '../../config/worlds.config.js';
import {
  randInt, shuffleArray, makePercentValue, roundToBenchmark, benchmarkBounds,
  positionBetween, benchmarkOptions, percentOptions, numberOptions,
  NICE_FRACTIONS, NICE_DECIMALS, NICE_PERCENTS, makeNiceWhole,
  percentOfNumber, PRECISION_NAMES,
} from '../percentages/percentages.js';

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Decide the benchmark "precision" (spacing) a percent rounds to, based on
// difficulty. Mirrors the reference's diff-scaled precision selection.
function setupForDiff(diff) {
  if (diff === 1) return { precision: 25 };                                  // e.g. 38% → nearest 25%
  if (diff === 2) return Math.random() > 0.5 ? { precision: 25 } : { precision: 10 }; // → nearest 25% or 10%
  return Math.random() > 0.5 ? { precision: 10 } : { precision: 5 };          // → nearest 10% or 5%
}

// Difficulty-scaled percent + whole-number pairs for percent-of-a-number
// calculations, always chosen so the exact result is a clean integer.
function percentForDiff(diff) {
  if (diff === 1) return pick([10, 20, 25, 50, 75]);
  return pick(NICE_PERCENTS);
}
function wholeForDiff(diff) {
  if (diff === 1) return makeNiceWhole(1, 5);   // 20–100
  if (diff === 2) return makeNiceWhole(2, 10);  // 40–200
  return makeNiceWhole(3, 15);                  // 60–300
}

const englishNames = ['Emma', 'James', 'Oliver', 'Sophie', 'Lucas', 'Mia', 'Noah',
  'Ava', 'Ethan', 'Grace', 'Henry', 'Lily', 'Jack', 'Chloe', 'Ryan', 'Ella'];

const contexts = [
  { unit: 'students',      descriptor: 'walk to school',   emoji: '🚸' },
  { unit: 'stickers',      descriptor: 'are gold stars',    emoji: '🏷️' },
  { unit: 'marbles',       descriptor: 'are blue',          emoji: '🔵' },
  { unit: 'cupcakes',      descriptor: 'have sprinkles',    emoji: '🧁' },
  { unit: 'library books', descriptor: 'are mystery novels', emoji: '📚' },
  { unit: 'trading cards', descriptor: 'are rare',          emoji: '🃏' },
  { unit: 'garden seeds',  descriptor: 'have sprouted',     emoji: '🌱' },
];

// Q1: Percent line diagram — round the marked value to the nearest benchmark
function genQ1(id, diff) {
  const { precision } = setupForDiff(diff);
  const value = makePercentValue(1, 99);
  const rounded = roundToBenchmark(value, precision);
  const bounds = benchmarkBounds(value, precision);
  const position = positionBetween(value, bounds.lowerValue, bounds.upperValue);
  const precLabel = PRECISION_NAMES[precision];
  return {
    id, type: 'percent_benchmark_line', world: 0, difficulty: diff,
    value, place: precision, display: rounded.display,
    lowerDisplay: bounds.lowerDisplay, upperDisplay: bounds.upperDisplay, position,
    questionText: `Look at the percent line. What is ${value}% rounded to the nearest ${precLabel}?`,
    visual: 'percline',
    hint1: `${value}% sits between ${bounds.lowerDisplay} and ${bounds.upperDisplay}.`,
    hint2: `${value}% is ${rounded.remainder} past ${bounds.lowerDisplay} — that's ${rounded.roundUp ? 'halfway or more' : 'less than halfway'} to ${bounds.upperDisplay}.`,
    explanation: `${value}% rounds to ${rounded.display}.`,
    options: benchmarkOptions(rounded.display, precision, [bounds.lowerDisplay, bounds.upperDisplay]),
    correctAnswer: rounded.display,
  };
}

// Q2: Percent sentence — fill the blank
function genQ2(id, diff) {
  const { precision } = setupForDiff(diff);
  const value = makePercentValue(1, 99);
  const rounded = roundToBenchmark(value, precision);
  const bounds = benchmarkBounds(value, precision);
  const precLabel = PRECISION_NAMES[precision];
  return {
    id, type: 'percent_sentence_blank', world: 0, difficulty: diff,
    value, place: precision, display: rounded.display,
    questionText: `Round ${value}% to the nearest ${precLabel}. ${value}% ≈ ___`,
    visual: 'sentence',
    hint1: `Find the two benchmarks ${value}% sits between: ${bounds.lowerDisplay} and ${bounds.upperDisplay}.`,
    hint2: `${value}% is ${rounded.roundUp ? 'past the halfway point, so round up' : 'before the halfway point, so round down'}.`,
    explanation: `${value}% rounds to ${rounded.display}.`,
    options: benchmarkOptions(rounded.display, precision, [bounds.lowerDisplay, bounds.upperDisplay]),
    correctAnswer: rounded.display,
  };
}

// Q3: Percent grid — read the shaded percent directly
function genQ3(id, diff) {
  const min = diff === 1 ? 10 : diff === 2 ? 5 : 1;
  const max = diff === 1 ? 90 : diff === 2 ? 95 : 99;
  const percent = randInt(min, max);
  return {
    id, type: 'percent_grid_picture', world: 0, difficulty: diff,
    value: percent, display: `${percent}%`,
    questionText: `Look at the percent grid below. What percent is shaded?`,
    visual: 'grid', gridPercent: percent,
    hint1: `The grid has 100 squares total — count how many are shaded.`,
    hint2: `${percent} out of 100 squares are shaded.`,
    explanation: `${percent} out of 100 squares shaded means ${percent}% is shaded.`,
    options: percentOptions(percent),
    correctAnswer: `${percent}%`,
  };
}

// Q4: Word problem — real-world "percent of a number"
function genQ4(id, diff) {
  const percent = percentForDiff(diff);
  const whole = wholeForDiff(diff);
  const answer = percentOfNumber(percent, whole);
  const name = pick(englishNames);
  const c = pick(contexts);
  return {
    id, type: 'word_problem', world: 0, difficulty: diff,
    value: percent, whole, display: String(answer),
    questionText: `${name} has ${whole} ${c.unit}. ${percent}% of them ${c.descriptor}. How many ${c.unit} ${c.descriptor}?`,
    visual: 'grid', gridPercent: percent, itemEmoji: c.emoji, characterName: name,
    hint1: `${percent}% means ${percent} out of every 100.`,
    hint2: `${percent}% of ${whole} = ${percent}/100 × ${whole} = ${answer}.`,
    explanation: `${percent}% of ${whole} is ${answer} ${c.unit}.`,
    options: numberOptions(answer, [whole - answer]),
    correctAnswer: answer,
  };
}

// Q5: Percent equivalence link — connects a fraction/decimal to its percent
function genQ5(id, diff) {
  const useFraction = Math.random() > 0.5;
  let label, percent;
  if (useFraction) {
    const f = pick(NICE_FRACTIONS);
    label = `${f.num}/${f.den}`;
    percent = f.percent;
  } else {
    const dd = pick(NICE_DECIMALS);
    label = dd.decimal;
    percent = dd.percent;
  }
  return {
    id, type: 'percent_equivalence_link', world: 0, difficulty: diff,
    value: percent, display: `${percent}%`,
    questionText: `${label} is the same amount as ___`,
    visual: 'sentence',
    hint1: useFraction
      ? `Percent means "per hundred" — think what ${label} would be out of 100.`
      : `To change a decimal to a percent, move the decimal point two places to the right.`,
    hint2: `${label} = ${percent}%.`,
    explanation: `${label} and ${percent}% represent the exact same amount.`,
    options: percentOptions(percent),
    correctAnswer: `${percent}%`,
  };
}

// Q6: True / False
function genQ6(id, diff) {
  const percent = percentForDiff(diff);
  const whole = wholeForDiff(diff);
  const correct = percentOfNumber(percent, whole);
  const isTrue = Math.random() > 0.5;
  const complement = whole - correct; // classic slip: found the complement instead
  const wrongVal = complement === correct ? correct + Math.max(5, Math.round(whole * 0.05)) : complement;
  const shown = isTrue ? correct : wrongVal;
  return {
    id, type: 'true_false', world: 0, difficulty: diff,
    value: percent, whole, display: String(shown),
    questionText: `Is this correct? ${percent}% of ${whole} = ${shown}`,
    visual: 'sentence',
    hint1: `${percent}% of ${whole} means ${percent}/100 × ${whole}.`,
    hint2: `${percent}% of ${whole} = ${correct}.`,
    explanation: `${percent}% of ${whole} is actually ${correct}, so the statement is ${isTrue ? 'True ✓' : 'False ✗'}.`,
    options: ['True', 'False'],
    correctAnswer: isTrue ? 'True' : 'False',
  };
}

// Q7: Match the grid — pick the grid showing the correct shaded percent
function genQ7(id, diff) {
  const min = diff === 1 ? 10 : 1;
  const max = diff === 1 ? 90 : 99;
  const percent = randInt(min, max);

  const candidates = shuffleArray([
    percent - 20, percent - 15, percent - 8, percent + 8, percent + 15, percent + 20,
  ].filter((v) => v >= 0 && v <= 100 && v !== percent));
  const wrongs = [];
  for (const c of candidates) {
    if (wrongs.length >= 3) break;
    if (!wrongs.includes(c)) wrongs.push(c);
  }
  while (wrongs.length < 3) {
    const c = randInt(0, 100);
    if (c !== percent && !wrongs.includes(c)) wrongs.push(c);
  }

  const raw = shuffleArray([
    { p: percent, isCorrect: true },
    { p: wrongs[0], isCorrect: false },
    { p: wrongs[1], isCorrect: false },
    { p: wrongs[2], isCorrect: false },
  ]);
  const matchOptions = raw.map((o, i) => ({ key: `grid_${i}_${o.p}`, percent: o.p }));
  const correctOpt = matchOptions[raw.findIndex((o) => o.isCorrect)].key;

  return {
    id, type: 'match_grid', world: 0, difficulty: diff,
    value: percent, display: `${percent}%`,
    questionText: `Which grid correctly shows ${percent}% shaded?`,
    visual: 'match_grid', matchOptions,
    hint1: `Count carefully — ${percent}% means ${percent} out of 100 squares.`,
    hint2: `Look for the grid with exactly ${percent} shaded squares.`,
    explanation: `The grid with ${percent} shaded squares out of 100 shows ${percent}%.`,
    options: matchOptions.map((o) => o.key),
    correctAnswer: correctOpt,
  };
}

// Q8: Find the original number (reverse) — percent of WHAT equals the part?
function genQ8(id, diff) {
  const percent = percentForDiff(diff);
  const whole = wholeForDiff(diff);
  const part = percentOfNumber(percent, whole);

  const distractors = new Set();
  let guard = 0;
  while (distractors.size < 3 && guard < 60) {
    guard++;
    const candWhole = makeNiceWhole(1, 15);
    if (candWhole === whole) continue;
    if (percentOfNumber(percent, candWhole) === part) continue;
    distractors.add(candWhole);
  }

  return {
    id, type: 'find_original_number', world: 0, difficulty: diff,
    value: percent, whole, display: String(whole),
    questionText: `${percent}% of which number is ${part}?`,
    visual: 'sentence',
    hint1: `Try: ${percent}% of the answer should equal ${part}.`,
    hint2: `${part} ÷ ${percent} × 100 = ${whole}.`,
    explanation: `${percent}% of ${whole} = ${part}, so the answer is ${whole}.`,
    options: shuffleArray([whole, ...[...distractors].slice(0, 3)]),
    correctAnswer: whole,
  };
}

// Q9: Harder percent (extension) — percent increase / decrease, two steps
function genQ9(id, diff) {
  const percent = pick([10, 20, 25, 50]);
  const whole = makeNiceWhole(2, 12);
  const isIncrease = Math.random() > 0.5;
  const changeAmt = percentOfNumber(percent, whole);
  const result = isIncrease ? whole + changeAmt : whole - changeAmt;
  const verb = isIncrease ? 'increases' : 'decreases';
  return {
    id, type: 'harder_percent', world: 0, difficulty: diff,
    value: percent, whole, display: String(result),
    questionText: `A price of $${whole} ${verb} by ${percent}%. What is the new price?`,
    visual: 'sentence',
    hint1: `First find ${percent}% of $${whole}: that's $${changeAmt}.`,
    hint2: isIncrease ? `Add $${changeAmt} to $${whole}.` : `Subtract $${changeAmt} from $${whole}.`,
    explanation: `${percent}% of $${whole} is $${changeAmt}, so the new price is $${result}.`,
    options: numberOptions(result, [whole, changeAmt]),
    correctAnswer: result,
  };
}

// Q10: Find the percent from a fraction (foundational skill for every percent problem)
function genQ10(id, diff) {
  const pool = diff === 1
    ? NICE_FRACTIONS.filter((f) => [2, 4, 5, 10].includes(f.den))
    : NICE_FRACTIONS;
  const f = pick(pool);
  return {
    id, type: 'find_percent_from_fraction', world: 0, difficulty: diff,
    value: f.percent, display: `${f.percent}%`, showDecider: false,
    questionText: `What percent is equivalent to ${f.num}/${f.den}?`,
    visual: 'grid', gridPercent: f.percent,
    hint1: `Think about ${f.num}/${f.den} as a number out of 100.`,
    hint2: `${f.num}/${f.den} = ${f.percent}/100.`,
    explanation: `${f.num}/${f.den} is equivalent to ${f.percent}%. Knowing these benchmark fractions helps with every percent skill!`,
    options: percentOptions(f.percent),
    correctAnswer: `${f.percent}%`,
  };
}

const DISTRIBUTION = [
  ['percent_benchmark_line',     genQ1,  [5, 3, 2]],
  ['percent_sentence_blank',     genQ2,  [4, 4, 2]],
  ['percent_grid_picture',       genQ3,  [5, 3, 2]],
  ['word_problem',               genQ4,  [3, 4, 3]],
  ['percent_equivalence_link',   genQ5,  [4, 3, 3]],
  ['true_false',                 genQ6,  [5, 3, 2]],
  ['match_grid',                 genQ7,  [4, 4, 2]],
  ['find_original_number',       genQ8,  [3, 4, 3]],
  ['harder_percent',             genQ9,  [3, 4, 3]],
  ['find_percent_from_fraction', genQ10, [3, 4, 3]],
];

export function generateSessionQuestions() {
  let all = [];
  let counter = 1;
  for (const [type, genFn, [e, m, h]] of DISTRIBUTION) {
    for (let i = 0; i < e; i++) all.push(genFn(`${type}_${counter++}`, 1));
    for (let i = 0; i < m; i++) all.push(genFn(`${type}_${counter++}`, 2));
    for (let i = 0; i < h; i++) all.push(genFn(`${type}_${counter++}`, 3));
  }
  all = shuffleArray(all);
  all.forEach((q, idx) => { q.world = Math.floor(idx / 10); });
  return all;
}

export const BADGE_TESTS = {
  first_percent:   (s) => s.totalScore > 0,
  hot_streak:      (s) => s.maxStreak >= 5,
  grid_star:       (s) => s.simulateDone,
  percent_pro:     (s) => s.totalQuestions > 0 && s.totalScore / s.totalQuestions >= 0.8,
  perfect_percent: (s) => s.worldResults.some((w) => w && w.correct === w.total),
  boss_slayer:     (s) => s.bossWon,
  full_journey:    (s) => s.reflectDone,
};

export function checkBadges(sessionState) {
  return BADGES.filter((b) => (BADGE_TESTS[b.id] ? BADGE_TESTS[b.id](sessionState) : false));
}

export function scoreAnswer({ isCorrect, isFirstTry, streak }) {
  if (!isCorrect) return { xp: 0, newStreak: 0 };
  let xp = isFirstTry ? 10 : 5;
  const newStreak = streak + 1;
  if (newStreak >= 5 && newStreak % 5 === 0) xp += 5;
  return { xp, newStreak };
}

export function calcStars(correctCount, totalCount = 10) {
  const pct = totalCount > 0 ? correctCount / totalCount : 0;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

export function isWorldUnlocked() {
  return true; // direct phase/world switching is allowed throughout
}
