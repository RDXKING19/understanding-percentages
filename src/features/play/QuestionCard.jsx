// src/features/play/QuestionCard.jsx
import React from 'react';
import HintBubble from '../../components/HintBubble.jsx';
import PercentLineDiagram from '../../components/PercentLineDiagram.jsx';
import PercentGrid from '../../components/PercentGrid.jsx';

function GridMatchOption({ opt, correctKey, selected, confirmed, onClick }) {
  let cls = '';
  if (confirmed) {
    if (opt.key === correctKey) cls = 'correct';
    else if (opt.key === selected) cls = 'wrong';
    else cls = 'disabled';
  } else if (selected === opt.key) cls = 'selected';
  return (
    <button className={`array-match-btn${cls ? ' ' + cls : ''}`} onClick={onClick}>
      <PercentGrid percent={opt.percent} compact showCaption={false} />
    </button>
  );
}

/**
 * Renders a single question card with topic badge, visual aid,
 * question text, option grid, optional hint, and mascot row.
 */
export default function QuestionCard({
  question,
  selected,
  confirmed,
  onSelect,
  showHint,
  worldAccent,
}) {
  const {
    type, questionText, visual, options, correctAnswer, explanation,
    lowerDisplay, upperDisplay, position, value, gridPercent,
    matchOptions,
  } = question;

  const topicLabel = type.replace(/_/g, ' ');

  return (
    <div className="question-card glass-card">
      {/* Topic badge */}
      <div className="topic-badge" style={{ borderColor: `${worldAccent}66`, color: worldAccent }}>
        {topicLabel}
      </div>

      {/* Question text */}
      <p className="question-text">{questionText}</p>

      {/* Visual aid */}
      {visual === 'percline' && (
        <div className="question-visual">
          <PercentLineDiagram
            lowerDisplay={lowerDisplay}
            upperDisplay={upperDisplay}
            valueDisplay={`${value}%`}
            position={position}
            animated
          />
        </div>
      )}
      {visual === 'grid' && (
        <div className="question-visual">
          <PercentGrid percent={gridPercent ?? value} />
        </div>
      )}

      {/* Hint */}
      {showHint && !confirmed && (
        <HintBubble>{question.hint1}</HintBubble>
      )}

      {/* Options */}
      {type === 'match_grid' ? (
        <div className="array-match-options">
          {matchOptions.map((opt) => (
            <GridMatchOption
              key={opt.key}
              opt={opt}
              correctKey={correctAnswer}
              selected={selected}
              confirmed={confirmed}
              onClick={() => !confirmed && onSelect(opt.key)}
            />
          ))}
        </div>
      ) : (
        <div className="options-grid">
          {options.map((opt) => {
            let cls = 'option-btn';
            if (confirmed) {
              if (opt === correctAnswer) cls += ' correct';
              else if (opt === selected) cls += ' wrong';
              else cls += ' disabled';
            } else if (selected === opt) {
              cls += ' selected';
            }
            return (
              <button key={opt} className={cls} onClick={() => onSelect(opt)} disabled={confirmed}>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* Explanation shown after confirmation */}
      {confirmed && explanation && (
        <div style={{
          marginTop: 14,
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.8)',
        }}>
          💡 {explanation}
        </div>
      )}

      {/* Mascot */}
      <div className="mascot-container" style={{ marginTop: 16 }}>
        <span className="mascot" aria-hidden="true">🦜</span>
        <div className="speech-bubble">
          {confirmed
            ? selected === correctAnswer
              ? "Brilliant! You got it! 🎉"
              : "Keep trying! You'll get it! 💪"
            : "Think: what does percent mean?"}
        </div>
      </div>
    </div>
  );
}
