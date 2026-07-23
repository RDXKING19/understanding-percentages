// src/config/worlds.config.js
export const WORLDS = [
  { id: 0, name: 'Candy Land',     emoji: '🍬', accent: '#ff7043',
    description: 'Find what percent of the candy jar is gone',
    boss: { name: 'Sugar Percenter', emoji: '🍭', reward: 'Sweet Percent Badge 🍬' } },
  { id: 1, name: 'Jungle Trek',    emoji: '🌴', accent: '#4caf50',
    description: 'Work out what percent of the trail is hiked',
    boss: { name: 'Vine Estimator',  emoji: '🐍', reward: 'Jungle Percent Badge 🌴' } },
  { id: 2, name: 'Ocean Deep',     emoji: '🌊', accent: '#0ea5e9',
    description: 'Find what percent of the reef has been explored',
    boss: { name: 'Tide Percenter',  emoji: '🐙', reward: 'Ocean Percent Badge 🌊' } },
  { id: 3, name: 'Sky Islands',    emoji: '☁️', accent: '#ffd54f',
    description: 'Work out what percent of the sky is cloudy',
    boss: { name: 'Storm Percenter', emoji: '⛈️', reward: 'Sky Percent Badge ☁️' } },
  { id: 4, name: 'Volcano Peak',   emoji: '🌋', accent: '#ef5350',
    description: 'Find what percent of the gems have been collected',
    boss: { name: 'Magma Percenter', emoji: '🔥', reward: 'Volcano Percent Badge 🌋' } },
  { id: 5, name: 'Space Station',  emoji: '🚀', accent: '#9c27b0',
    description: 'Work out what percent of fuel is left for launch',
    boss: { name: 'Comet Percenter', emoji: '☄️', reward: 'Space Percent Badge 🚀' } },
  { id: 6, name: 'Dragon Cave',    emoji: '🐉', accent: '#ff5722',
    description: 'Find what percent of the gold hoard is counted',
    boss: { name: 'Ember Percenter', emoji: '🐲', reward: 'Dragon Percent Badge 🐉' } },
  { id: 7, name: 'Crystal Tower',  emoji: '💎', accent: '#3f51b5',
    description: 'Work out what percent of the tower is built',
    boss: { name: 'Prism Percenter', emoji: '🔮', reward: 'Crystal Percent Badge 💎' } },
  { id: 8, name: 'Rainbow Bridge', emoji: '🌈', accent: '#e91e63',
    description: 'Find what percent of the bridge is painted',
    boss: { name: 'Rainbow Percenter', emoji: '🦄', reward: 'Rainbow Percent Badge 🌈' } },
  { id: 9, name: 'Number Palace',  emoji: '🏰', accent: '#00bcd4',
    description: 'Master every percent skill there is',
    boss: { name: 'Percent Monarch', emoji: '👑', reward: 'Palace Percent Badge 🏰' } },
];

// ── Play modes (within each world) ──
export const PLAY_MODES = [
  {
    id: 'guided',
    name: 'Guided Practice',
    icon: '🧭',
    desc: '5 questions with hints, no time pressure',
    questionCount: 5,
    hints: true,
    timed: false,
    lives: false,
  },
  {
    id: 'independent',
    name: 'Independent Practice',
    icon: '✍️',
    desc: '10 questions, no hints, full XP',
    questionCount: 10,
    hints: false,
    timed: false,
    lives: false,
  },
  {
    id: 'timed',
    name: 'Timed Challenge',
    icon: '⏱️',
    desc: '8 questions in 60 seconds, bonus XP',
    questionCount: 8,
    hints: false,
    timed: true,
    timeLimit: 60,
    lives: false,
  },
  {
    id: 'boss',
    name: 'Boss Battle',
    icon: '👑',
    desc: '5 questions, 3 lives — defeat the boss!',
    questionCount: 5,
    hints: false,
    timed: false,
    lives: true,
  },
];

// ── Badges ──
export const BADGES = [
  { id: 'first_percent',    name: 'First Percent',         icon: '🏅', desc: 'First correct answer' },
  { id: 'hot_streak',       name: 'Hot Streak',            icon: '🔥', desc: '5 consecutive correct' },
  { id: 'grid_star',        name: 'Percent Grid Star',     icon: '🥈', desc: 'Completed Simulate' },
  { id: 'percent_pro',      name: 'Percent Pro',           icon: '🥇', desc: '80%+ correct overall' },
  { id: 'perfect_percent',  name: 'Perfect Percenter',     icon: '💎', desc: 'A perfect world score' },
  { id: 'boss_slayer',      name: 'Boss Slayer',           icon: '👑', desc: 'Defeated a boss battle' },
  { id: 'full_journey',     name: 'Full Journey',          icon: '🌟', desc: 'Completed every phase' },
];

// ── XP economy ──
export const XP_REWARDS = {
  CORRECT: 10,
  STREAK_BONUS: 15, // on 5+ streak (replaces base)
  STATION_COMPLETE: 20,
  WORLD_COMPLETE: 50,
  BOSS_WIN: 100,
};
