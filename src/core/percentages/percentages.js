// src/core/percentages/percentages.js
//
// Shared percentage engine. All calculations are done on plain INTEGERS
// (percent points, whole numbers) so results are always exact — no
// floating-point surprises, and no confusion for a Grade 5 learner.
//
// precision: the "benchmark spacing" a percent is rounded to — 25, 10, or 5
// (e.g. rounding 38% to the nearest 10% → 40%).

export const PRECISION_NAMES = { 25: '25%', 10: '10%', 5: '5%' };

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** A random whole-number percent value between min and max (inclusive). */
export function makePercentValue(min = 1, max = 99) {
  return randInt(min, max);
}

/**
 * Round a percent `value` to the nearest benchmark at the given `precision`
 * (25, 10, or 5). Returns the exact result plus the "deciding remainder" —
 * how far past the lower benchmark the value sits — so the UI/explanations
 * can show *why* it rounded the way it did (ties round up, same rule as
 * "5 or more, round up").
 */
export function roundToBenchmark(value, precision) {
  const lower = Math.floor(value / precision) * precision;
  const upper = lower + precision;
  const remainder = value - lower;
  const roundUp = remainder * 2 >= precision; // remainder >= half the gap
  const rounded = roundUp ? upper : lower;
  return {
    value: rounded,
    display: `${rounded}%`,
    remainder,
    half: precision / 2,
    roundUp,
  };
}

/** The two neighbouring benchmarks (lower/upper) that bracket `value`. */
export function benchmarkBounds(value, precision) {
  const lower = Math.floor(value / precision) * precision;
  const upper = Math.min(100, lower + precision);
  return {
    lowerDisplay: `${lower}%`,
    upperDisplay: `${upper}%`,
    lowerValue: lower,
    upperValue: upper,
  };
}

/** Fraction 0..1 of how far `value` sits between lowerValue and upperValue. */
export function positionBetween(value, lowerValue, upperValue) {
  if (upperValue === lowerValue) return 0.5;
  return Math.min(1, Math.max(0, (value - lowerValue) / (upperValue - lowerValue)));
}

/**
 * Generate up to 4 plausible multiple-choice benchmark options (always
 * includes the correct display string). Seeds with the common student
 * mistakes — the un-rounded lower/upper neighbours — then fills with
 * nearby benchmark steps at the same precision.
 */
export function benchmarkOptions(correctDisplay, precision, seeds = []) {
  const opts = new Set([correctDisplay]);
  seeds.forEach((s) => opts.add(s));

  const correctVal = Number(correctDisplay.replace('%', ''));
  const offsets = shuffleArray([precision, -precision, precision * 2, -precision * 2]);
  for (const off of offsets) {
    if (opts.size >= 4) break;
    const c = correctVal + off;
    if (c >= 0 && c <= 100) opts.add(`${c}%`);
  }
  let guard = 0;
  while (opts.size < 4 && guard < 20) {
    guard++;
    const c = correctVal + (Math.random() > 0.5 ? 1 : -1) * precision * randInt(3, 6);
    if (c >= 0 && c <= 100) opts.add(`${c}%`);
  }

  const rest = [...opts].filter((o) => o !== correctDisplay);
  const final = shuffleArray(rest).slice(0, 3);
  final.push(correctDisplay);
  return shuffleArray(final);
}

/**
 * Plausible wrong-answer percents for a "what percent is shaded?" grid
 * question — classic student slips: off by a small amount, the complement
 * (100 - correct), or a transposed-digit style neighbour.
 */
export function percentOptions(correctPercent) {
  const opts = new Set([correctPercent]);
  const candidates = shuffleArray([
    correctPercent + 10, correctPercent - 10,
    correctPercent + 5, correctPercent - 5,
    100 - correctPercent,
    correctPercent + 1, correctPercent - 1,
  ]);
  for (const c of candidates) {
    if (opts.size >= 4) break;
    if (c >= 0 && c <= 100 && c !== correctPercent) opts.add(c);
  }
  let guard = 0;
  while (opts.size < 4 && guard < 20) {
    guard++;
    const c = randInt(0, 100);
    if (c !== correctPercent) opts.add(c);
  }
  const rest = [...opts].filter((o) => o !== correctPercent);
  const final = shuffleArray(rest).slice(0, 3);
  final.push(correctPercent);
  return shuffleArray(final).map((p) => `${p}%`);
}

// ── Fraction / Decimal / Percent equivalence ───────────────────────────────

// Curated "nice" fractions with exact percent equivalents — the standard
// Grade 5 benchmark fractions.
export const NICE_FRACTIONS = [
  { num: 1, den: 2, percent: 50 },
  { num: 1, den: 4, percent: 25 },
  { num: 3, den: 4, percent: 75 },
  { num: 1, den: 5, percent: 20 },
  { num: 2, den: 5, percent: 40 },
  { num: 3, den: 5, percent: 60 },
  { num: 4, den: 5, percent: 80 },
  { num: 1, den: 10, percent: 10 },
  { num: 3, den: 10, percent: 30 },
  { num: 7, den: 10, percent: 70 },
  { num: 9, den: 10, percent: 90 },
  { num: 1, den: 20, percent: 5 },
  { num: 1, den: 100, percent: 1 },
];

// Curated "nice" decimals with exact percent equivalents.
export const NICE_DECIMALS = [
  { decimal: '0.5', percent: 50 },
  { decimal: '0.25', percent: 25 },
  { decimal: '0.75', percent: 75 },
  { decimal: '0.1', percent: 10 },
  { decimal: '0.2', percent: 20 },
  { decimal: '0.3', percent: 30 },
  { decimal: '0.4', percent: 40 },
  { decimal: '0.6', percent: 60 },
  { decimal: '0.7', percent: 70 },
  { decimal: '0.8', percent: 80 },
  { decimal: '0.9', percent: 90 },
  { decimal: '0.05', percent: 5 },
];

/** Reduce a fraction to lowest terms (used for display of any num/den). */
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
export function simplifyFraction(num, den) {
  const g = gcd(num, den) || 1;
  return { num: num / g, den: den / g };
}

/** Percent → simplest-form fraction string, e.g. 75 → "3/4". */
export function percentToFractionDisplay(percent) {
  const { num, den } = simplifyFraction(percent, 100);
  return `${num}/${den}`;
}

/** Percent → decimal string, e.g. 42 → "0.42", 5 → "0.05", 100 → "1". */
export function percentToDecimalDisplay(percent) {
  if (percent === 100) return '1';
  if (percent % 10 === 0) return (percent / 100).toFixed(1);
  return (percent / 100).toFixed(2);
}

/**
 * Plausible wrong-answer whole numbers for a calculated result (dollars,
 * counts, etc.) — nearby values plus any specific "seed" distractors that
 * represent common student mistakes (e.g. the complement, or the raw
 * percent number mistaken for the answer).
 */
export function numberOptions(correct, seeds = []) {
  const opts = new Set([correct]);
  seeds.forEach((s) => { if (s !== correct && s >= 0) opts.add(s); });
  const step = correct >= 20 ? 5 : 1;
  let guard = 0;
  while (opts.size < 4 && guard < 30) {
    guard++;
    const delta = randInt(1, 8) * step;
    const cand = Math.random() > 0.5 ? correct + delta : Math.max(0, correct - delta);
    if (cand !== correct) opts.add(cand);
  }
  const rest = [...opts].filter((o) => o !== correct);
  const final = shuffleArray(rest).slice(0, 3);
  final.push(correct);
  return shuffleArray(final);
}

// ── Percent-of-a-number calculations ───────────────────────────────────────

// "Nice" percent values (all multiples of 5) that combine with a whole
// number that is a multiple of 20 to always give a clean integer result —
// no rounding needed, so learners focus on the percent concept itself.
export const NICE_PERCENTS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90];

/** A random "whole" that is always divisible cleanly by any NICE_PERCENTS entry. */
export function makeNiceWhole(minMult = 1, maxMult = 10) {
  return randInt(minMult, maxMult) * 20;
}

/** percent% of `whole` — always an exact integer when whole is a makeNiceWhole(). */
export function percentOfNumber(percent, whole) {
  return (percent * whole) / 100;
}

/** Reverse: the whole number such that percent% of it equals `part`. */
export function wholeFromPercentPart(percent, part) {
  return (part * 100) / percent;
}

/** Increase `base` by `percent`%. */
export function percentIncrease(base, percent) {
  return base + percentOfNumber(percent, base);
}

/** Decrease `base` by `percent`% (e.g. a discount). */
export function percentDecrease(base, percent) {
  return base - percentOfNumber(percent, base);
}
