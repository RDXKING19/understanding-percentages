import React from 'react';
import { Home, Volume2, VolumeX } from 'lucide-react';

export const JOURNEY_ITEMS = [
  { icon: '🤔', label: 'Wonder', phase: 'wonder' },
  { icon: '📖', label: 'Story', phase: 'story' },
  { icon: '🧪', label: 'Simulate', phase: 'simulate' },
  { icon: '🎮', label: 'Practice', phase: 'play' },
  { icon: '📓', label: 'Reflect', phase: 'reflect' },
];

/**
 * Fixed top-centre JourneyBar — supports direct phase switching
 * (clicking any step navigates immediately, not linear-only).
 */
export default function PhaseNav({
  currentPhase,
  onPhaseClick,
  onHome,
  showHome,
  audioEnabled,
  onToggleAudio,
}) {
  if (currentPhase === 'intro') return null;

  return (
    <nav className="journey-bar" aria-label="Module phase navigation">
      {showHome && (
        <button
          className="journey-home-btn"
          onClick={onHome}
          aria-label="Go to home"
        >
          <Home size={20} />
        </button>
      )}
      {JOURNEY_ITEMS.map((item, idx) => (
        <React.Fragment key={item.phase}>
          <button
            className={`journey-step ${currentPhase === item.phase ? 'active' : ''}`}
            onClick={() => onPhaseClick(item.phase)}
            aria-current={currentPhase === item.phase ? 'step' : undefined}
          >
            <span className="journey-step-icon" aria-hidden="true">{item.icon}</span>
            <span className="journey-step-label">{item.label}</span>
            <span className="journey-step-dot" />
          </button>
          {idx < JOURNEY_ITEMS.length - 1 && <span className="journey-connector" aria-hidden="true" />}
        </React.Fragment>
      ))}
      <button
        className="journey-volume-btn"
        onClick={onToggleAudio}
        aria-label={audioEnabled ? 'Mute narration' : 'Unmute narration'}
      >
        {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </nav>
  );
}

