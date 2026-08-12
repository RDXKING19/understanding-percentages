// src/features/simulate/simulations/PercentGridSpotlight.jsx
// Topic-adapted equivalent of reference's PlaceValueSpotlight.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button.jsx';
import PercentGrid from '../../../components/PercentGrid.jsx';
import { sounds } from '../../../utils/audio.js';
import { randInt, percentOptions } from '../../../core/percentages/percentages.js';

const ROUNDS = 3;

function genRound() {
  const percent = randInt(5, 95);
  return {
    percent,
    display: `${percent}%`,
    options: percentOptions(percent),
  };
}

export default function PercentGridSpotlight({ onComplete }) {
  const [round, setRound]         = useState(0);
  const [setup, setSetup]         = useState(null);
  const [selected, setSelected]   = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore]         = useState(0);

  const newRound = () => { setSetup(genRound()); setSelected(null); setConfirmed(false); };
  useEffect(() => { newRound(); }, []);
  if (!setup) return null;

  const isCorrect = selected === setup.display;

  const handleConfirm = () => {
    if (!selected || confirmed) return;
    setConfirmed(true);
    isCorrect ? (sounds.correct(), setScore((s) => s + 1)) : sounds.wrong();
  };
  const handleNext = () => {
    const next = round + 1;
    if (next >= ROUNDS) { onComplete?.(score); return; }
    setRound(next); newRound();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, minHeight: 0 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6,
        fontSize: '0.78rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
        <span>Round {round + 1} / {ROUNDS}</span>
        <span>Score: {score}/{round}</span>
      </div>

      <p className="sim-instruction">What percent of the grid is shaded?</p>

      {/* ── Hint strip ── */}
      <div style={{ fontSize: '0.9rem', fontWeight: 800, textAlign: 'center', color: 'var(--gold)', marginBottom: 8 }}>
        🔍 Count every shaded square — each one equals 1%!
      </div>

      {/* ── Diagram ── */}
      <PercentGrid percent={setup.percent} showCaption={false} />

      {/* ── Options ── */}
      <div className="options-grid">
        {setup.options.map((opt) => {
          let cls = 'option-btn';
          if (confirmed) {
            if (opt === setup.display) cls += ' correct';
            else if (opt === selected) cls += ' wrong';
            else cls += ' disabled';
          } else if (selected === opt) cls += ' selected';
          return (
            <button key={opt} className={cls} onClick={() => !confirmed && setSelected(opt)}>
              {opt}
            </button>
          );
        })}
      </div>

      {/* ── Action — just below options ── */}
      <div style={{ marginTop: 10, flexShrink: 0 }}>
        {!confirmed ? (
          <Button variant="primary" size="sm" onClick={handleConfirm} disabled={!selected} style={{ width: '100%' }}>
            Check Answer ✓
          </Button>
        ) : (
          <>
            <div style={{
              padding: '8px 14px', borderRadius: 'var(--radius-md)', marginBottom: 8,
              background: isCorrect ? 'rgba(0,230,118,0.12)' : 'rgba(255,82,82,0.12)',
              border: `1px solid ${isCorrect ? 'rgba(0,230,118,0.4)' : 'rgba(255,82,82,0.4)'}`,
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.88rem', textAlign: 'center',
            }}>
              {isCorrect ? '🎉 Correct! You counted the shaded squares!' : `❌ Answer: ${setup.display}`}
            </div>
            <Button variant="primary" size="sm" onClick={handleNext} style={{ width: '100%' }}>
              {round + 1 >= ROUNDS ? 'Finish ⭐' : 'Next Round →'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
