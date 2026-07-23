// src/components/PercentLineDiagram.jsx
// Topic-adapted equivalent of reference's NumberLineDiagram.jsx
// Same SVG structure/sizing conventions, relabelled for percentages.
//
// Shows a percent value (the gold chip) positioned between its two
// benchmark neighbours (lowerDisplay / upperDisplay, e.g. "25%" / "50%").
// Endpoints can be marked selected/correct/wrong once an answer has been
// confirmed.

export default function PercentLineDiagram({
  lowerDisplay,
  upperDisplay,
  valueDisplay,
  position = 0.5,
  correctSide = null,   // 'lower' | 'upper' | null
  selectedSide = null,  // 'lower' | 'upper' | null
  confirmed = false,
  animated = false,
}) {
  const x1 = 40, x2 = 260, y = 108;
  const clamped = Math.min(1, Math.max(0, position));
  const markerX = x1 + (x2 - x1) * clamped;
  const midX = (x1 + x2) / 2;
  const chipW = 74;

  const fill = (side) => {
    if (confirmed) {
      if (side === correctSide) return '#00e676';
      if (side === selectedSide && side !== correctSide) return '#ff5252';
      return '#4A90D9';
    }
    return side === selectedSide ? '#ffe033' : '#4A90D9';
  };
  const stroke = (side) => {
    if (confirmed) {
      if (side === correctSide) return '#00b25a';
      if (side === selectedSide && side !== correctSide) return '#c62828';
      return '#2E5C8A';
    }
    return side === selectedSide ? '#c9a600' : '#2E5C8A';
  };

  return (
    <svg
      viewBox="0 0 300 160"
      className={`number-line-diagram${animated ? ' animated' : ''}`}
      role="img"
      aria-label={`Percent line from ${lowerDisplay} to ${upperDisplay}${valueDisplay ? `, marking ${valueDisplay}` : ''}`}
    >
      {/* Value chip + stem pointing down at its position on the line */}
      {valueDisplay != null && (
        <>
          <line x1={markerX} y1={44} x2={markerX} y2={y - 8} stroke="#FFC107" strokeWidth="2" strokeDasharray="3 3" />
          <rect x={markerX - chipW / 2} y="20" width={chipW} height="26" rx="8" fill="#FFC107" />
          <text x={markerX} y="38" textAnchor="middle" className="diagram-marker-num">{valueDisplay}</text>
        </>
      )}

      {/* Line + end ticks + midpoint tick */}
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="#9B8AC4" strokeWidth="3" />
      <line x1={x1} y1={y - 8} x2={x1} y2={y + 8} stroke="#9B8AC4" strokeWidth="3" />
      <line x1={x2} y1={y - 8} x2={x2} y2={y + 8} stroke="#9B8AC4" strokeWidth="3" />
      <line x1={midX} y1={y - 5} x2={midX} y2={y + 5} stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeDasharray="3 3" />
      <circle cx={markerX} cy={y} r="7" fill="#FFC107" stroke="#fff" strokeWidth="2" />

      {/* Lower endpoint */}
      <circle cx={x1} cy={y} r="28" fill={fill('lower')} stroke={stroke('lower')} strokeWidth="3" />
      <text x={x1} y={y + 6} textAnchor="middle" className="diagram-num">{lowerDisplay}</text>

      {/* Upper endpoint */}
      <circle cx={x2} cy={y} r="28" fill={fill('upper')} stroke={stroke('upper')} strokeWidth="3" />
      <text x={x2} y={y + 6} textAnchor="middle" className="diagram-num">{upperDisplay}</text>
    </svg>
  );
}
