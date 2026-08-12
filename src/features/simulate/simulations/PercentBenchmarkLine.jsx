// src/features/simulate/simulations/PercentBenchmarkLine.jsx
// Topic-adapted equivalent of reference's RoundOnTheLine.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button.jsx';
import PercentLineDiagram from '../../../components/PercentLineDiagram.jsx';
import { sounds } from '../../../utils/audio.js';
import {
  randInt, makePercentValue, roundToBenchmark, benchmarkBounds,
  positionBetween, PRECISION_NAMES,
} from '../../../core/percentages/percentages.js';

const ROUNDS = 3;

function genRound() {
  const precision = randInt(0, 1) === 0 ? 25 : 10; // keep this station approachable
  const value = makePercentValue(1, 99);
  const rounded = roundToBenchmark(value, precision);
  const bounds = benchmarkBounds(value, precision);
  const position = positionBetween(value, bounds.lowerValue, bounds.upperValue);
  return {
    value, precision,
    lowerDisplay: bounds.lowerDisplay, upperDisplay: bounds.upperDisplay,
    position, correctSide: rounded.roundUp ? 'upper' : 'lower',
    display: rounded.display, placeLabel: PRECISION_NAMES[precision],
    valueDisplay: `${value}%`,
  };
}

export default function PercentBenchmarkLine({ onComplete }) {
  const [round, setRound]         = useState(0);
  const [setup, setSetup]         = useState(null);
  const [selected, setSelected]   = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore]         = useState(0);

  const newRound = () => { setSetup(genRound()); setSelected(null); setConfirmed(false); };
  useEffect(() => { newRound(); }, []);
  if (!setup) return null;

  const isCorrect = selected === setup.correctSide;

  const tapSide = (side) => { if (!confirmed) { sounds.click(); setSelected(side); } };
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

      {/* ── Instruction ── */}
      <p className="sim-instruction">
        Round {setup.valueDisplay} to the nearest {setup.placeLabel}. Tap the benchmark it's closest to!
      </p>

      {/* ── Hint strip ── */}
      <div style={{ fontSize: '0.9rem', fontWeight: 800, textAlign: 'center', color: 'var(--gold)', marginBottom: 8 }}>
        📏 Is it closer to the left or right benchmark? Tap your answer below!
      </div>

      {/* ── Percent line ── */}
      <PercentLineDiagram
        lowerDisplay={setup.lowerDisplay}
        upperDisplay={setup.upperDisplay}
        valueDisplay={setup.valueDisplay}
        position={setup.position}
        correctSide={confirmed ? setup.correctSide : null}
        selectedSide={selected}
        confirmed={confirmed}
        animated
      />

      {/* ── Tap targets ── */}
      <div className="numberline-tap-row">
        <button
          className={`nl-tap-btn${selected === 'lower' ? ' selected' : ''}${confirmed ? (setup.correctSide === 'lower' ? ' correct' : selected === 'lower' ? ' wrong' : ' disabled') : ''}`}
          onClick={() => tapSide('lower')} disabled={confirmed}>
          ⬅ {setup.lowerDisplay}
        </button>
        <button
          className={`nl-tap-btn${selected === 'upper' ? ' selected' : ''}${confirmed ? (setup.correctSide === 'upper' ? ' correct' : selected === 'upper' ? ' wrong' : ' disabled') : ''}`}
          onClick={() => tapSide('upper')} disabled={confirmed}>
          {setup.upperDisplay} ➡
        </button>
      </div>

      {/* ── Action — just below tap buttons ── */}
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
              {isCorrect ? '🎉 Correct! You found the nearest benchmark!' : `❌ Answer: ${setup.display}`}
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
