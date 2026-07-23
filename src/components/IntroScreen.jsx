import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button.jsx';

const PHASES = [
  { icon: '🤔', label: 'Wonder',   desc: 'A math mystery!' },
  { icon: '📖', label: 'Story',    desc: "The sticker sale" },
  { icon: '🧪', label: 'Simulate', desc: 'Percent on the grid' },
  { icon: '🎮', label: 'Play',     desc: '100 challenges' },
  { icon: '📓', label: 'Reflect',  desc: 'Quiz & review' },
];

const FEATURES = [
  { icon: '🎯', label: '100 Questions' },
  { icon: '💯', label: 'Percent = Per Hundred' },
  { icon: '🏆', label: 'Badges & XP' },
];

export default function IntroScreen({ onBegin }) {
  return (
    <div className="intro-screen">
      <motion.div className="intro-badge"
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        ✨ Intellia Global · Grade 5 Math
      </motion.div>

      <motion.h1 className="intro-title"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.08, type: 'spring', stiffness: 200, damping: 16 }}>
        <span className="title-main">Understanding Percentages</span>
        <span className="title-sub">Percent with Confidence!</span>
      </motion.h1>

      {/* Mascot teaser */}
      <motion.div className="mascot-container"
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
        <span className="mascot" role="img" aria-label="Percy the Parrot">🦜</span>
        <div className="speech-bubble">Let's explore understanding percentages! 🎯</div>
      </motion.div>

      {/* Journey map */}
      <motion.div className="intro-journey-map"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
        {PHASES.map((step, i) => (
          <motion.div key={step.label} className="intro-journey-step glass-card"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 + i * 0.06 }}>
            <span className="step-icon" role="img" aria-hidden="true">{step.icon}</span>
            <div className="step-label">{step.label}</div>
            <div className="step-desc">{step.desc}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <Button variant="primary" size="lg" onClick={onBegin}>🚀 Begin Your Journey!</Button>
      </motion.div>

      <div className="intro-feature-cards">
        {FEATURES.map(f => (
          <div key={f.label} className="intro-feature-card glass-card">{f.icon} {f.label}</div>
        ))}
      </div>
    </div>
  );
}
