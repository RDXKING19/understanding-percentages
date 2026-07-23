// src/components/NumberPad.jsx
// Adapted from the reference NumberPad — adds a decimal-point key and a
// longer max length so learners can type answers like "14.4" or "5.00".
import { sounds } from '../utils/audio.js';

export default function NumberPad({ value, onChange, onSubmit, maxLength = 6 }) {
  const handleKey = (key) => {
    sounds.click();
    if (key === '⌫') {
      onChange(value.slice(0, -1));
    } else if (key === '✓') {
      if (value) onSubmit();
    } else if (key === '.') {
      if (!value.includes('.') && value.length < maxLength) onChange(value + key);
    } else {
      if (value.length < maxLength) onChange(value + key);
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫', '✓'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%', maxWidth: 280 }}>
      <div className="num-display">{value || '?'}</div>
      <div className="number-pad with-decimal">
        {keys.map((k) => (
          <button
            key={k}
            className={`num-key${k === '⌫' ? ' del' : ''}${k === '✓' ? ' submit submit-full' : ''}`}
            onClick={() => handleKey(k)}
            aria-label={k === '⌫' ? 'delete' : k === '✓' ? 'submit' : k === '.' ? 'decimal point' : k}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
