import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function ProbabilityChart({ topPredictions }) {
  if (!topPredictions || topPredictions.length === 0) return null;

  return (
    <div className="glass-card" style={{ padding: '24px', borderRadius: '20px' }}>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BarChart3 size={18} className="text-gradient" /> Top Class Predictions Breakdown
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {topPredictions.map((pred, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem', marginBottom: '6px' }}>
              <span style={{ fontWeight: idx === 0 ? 700 : 500, color: idx === 0 ? '#fff' : 'var(--text-muted)' }}>
                {idx + 1}. {pred.crop} — {pred.disease}
              </span>
              <span className="font-mono" style={{ fontWeight: 700, color: idx === 0 ? '#34d399' : 'var(--text-subtle)' }}>
                {pred.probability}%
              </span>
            </div>

            <div style={{
              height: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${pred.probability}%`,
                  background: idx === 0
                    ? 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)'
                    : 'rgba(255, 255, 255, 0.2)'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
