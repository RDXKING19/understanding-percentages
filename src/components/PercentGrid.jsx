// src/components/PercentGrid.jsx
// Topic-adapted equivalent of reference's PlaceValueChart.jsx
// Shows a 10x10 grid (100 squares) with `percent` of them shaded — the
// classic "percent = per hundred" model. Squares fill row by row so the
// shaded amount is easy to count and compare.

export default function PercentGrid({ percent, compact = false, showCaption = true, label }) {
  const shaded = Math.max(0, Math.min(100, Math.round(percent)));
  const cells = Array.from({ length: 100 }, (_, i) => i < shaded);

  return (
    <div
      className={`percent-grid-wrap${compact ? ' compact' : ''}`}
      role="img"
      aria-label={`Percent grid showing ${shaded} out of 100 squares shaded${label ? `, ${label}` : ''}`}
    >
      <div className="percent-grid">
        {cells.map((isShaded, i) => (
          <div key={i} className={`percent-cell${isShaded ? ' shaded' : ''}`} />
        ))}
      </div>
      {showCaption && (
        <div className="percent-grid-caption">
          {shaded} out of 100 shaded
        </div>
      )}
    </div>
  );
}
