// src/features/simulate/simulations/PercentItOut.jsx
// Topic-adapted equivalent of reference's RoundItOut.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button.jsx';
import NumberPad from '../../../components/NumberPad.jsx';
import { sounds } from '../../../utils/audio.js';
import { randInt, makeNiceWhole, percentOfNumber, NICE_PERCENTS } from '../../../core/percentages/percentages.js';

const ROUNDS = 3;

function genRound() {
  const percent = NICE_PERCENTS[randInt(0, NICE_PERCENTS.length - 1)];
  const whole = makeNiceWhole(1, 8); // 20–160
  const answer = percentOfNumber(percent, whole);
  return {
    percent, whole,
    promptDisplay: `${percent}% of ${whole}`,
    answer,
  };
}

export default function PercentItOut({ onComplete }) {
  const [round, setRound]         = useState(0);
  const [setup, setSetup]         = useState(null);
  const [value, setValue]         = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore]         = useState(0);

  const newRound = () => { setSetup(genRound()); setValue(''); setConfirmed(false); };
  useEffect(() => { newRound(); }, []);
  if (!setup) return null;

  const isCorrect = Number(value) === setup.answer;

  const handleSubmit = () => {
    if (!value || confirmed) return;
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

      <p className="sim-instruction">Find the percent of the number!</p>

      {/* ── Equation ── */}
      <div className="number-sentence">
        <span className="ns-num">{setup.promptDisplay}</span>
        <span className="ns-op">=</span>
        <span className="ns-blank">{value || '?'}</span>
      </div>

      {/* ── Number pad (hidden after confirm) ── */}
      {!confirmed && <NumberPad value={value} onChange={setValue} onSubmit={handleSubmit} />}

      {/* ── Action — just below number pad ── */}
      <div style={{ marginTop: 10, flexShrink: 0 }}>
        {!confirmed ? (
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!value} style={{ width: '100%' }}>
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
              {isCorrect ? '🎉 Correct! You found the percent perfectly!' : `❌ Answer: ${setup.answer}`}
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
