// src/features/wonder/WonderPhase.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/Button.jsx';
import { WONDER_QUESTIONS } from './wonder.constants.js';
import { wonderHookNarration } from '../../utils/narration.js';

const REACTIONS = [
  { emoji: '🤔', label: 'I Wonder!' },
  { emoji: '💡', label: 'I Think I Know!' },
  { emoji: '😮', label: 'Wow!' },
];

export default function WonderPhase({ onComplete, playNarration }) {
  const [step, setStep] = useState(0); // 0=orb, 1=mascot, 2=card, 3=btn
  const [reactionPick, setReactionPick] = useState(null);
  const wonder = useMemo(
    () => WONDER_QUESTIONS[Math.floor(Math.random() * WONDER_QUESTIONS.length)],
    []
  );
  const narrationFiredRef = useRef(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 400),
      setTimeout(() => setStep(2), 800),
      setTimeout(() => setStep(3), 1400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (step >= 2 && !narrationFiredRef.current) {
      narrationFiredRef.current = true;
      const segments = wonderHookNarration(wonder);
      if (segments.length > 0) playNarration?.(segments);
    }
  }, [step, wonder, playNarration]);

  return (
    <div className="wonder-screen">
      {/* Pulsing orb */}
      <motion.div
        className="wonder-orb"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
      >
        ?
      </motion.div>

      {/* Mascot */}
      {step >= 1 && (
        <motion.div
          className="mascot-container"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.span
            className="mascot"
            role="img"
            aria-label="Percy"
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            style={{ display: 'inline-block' }}
          >
            🦜
          </motion.span>
          <div className="speech-bubble">Hmm, I wonder… what do you think? 🤔</div>
        </motion.div>
      )}

      {/* Question card */}
      {step >= 2 && (
        <motion.div
          className="wonder-card glass-card"
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div className="wonder-emoji" role="img" aria-hidden="true">{wonder.emoji}</div>
          <p className="wonder-question">{wonder.question}</p>
          <p className="wonder-subtext">{wonder.subtext}</p>

          {/* Tappable Emoji Reaction Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
            {REACTIONS.map((item, idx) => {
              const isSelected = reactionPick === idx;
              const isDimmed = reactionPick !== null && !isSelected;
              return (
                <motion.button
                  key={idx}
                  onClick={() => setReactionPick(idx)}
                  animate={isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'var(--color-text)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    outline: isSelected ? '3px solid var(--gold)' : 'none',
                    opacity: isDimmed ? 0.5 : 1,
                    transition: 'opacity 0.2s, outline 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{item.emoji}</span> {item.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* CTA button */}
      {step >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="btn-glow-pulse"
        >
          <Button variant="primary" size="lg" onClick={onComplete}>
            Let's Discover! ✨
          </Button>
        </motion.div>
      )}
    </div>
  );
}

