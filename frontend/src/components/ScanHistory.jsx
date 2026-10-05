import React from 'react';
import { History, Trash2, ArrowUpRight, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ScanHistory({ history, onSelectHistory, onClearHistory }) {
  if (!history || history.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto'
        }}>
          <History size={28} className="text-gradient" />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 6px 0' }}>No Scan History Yet</h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
          Perform diagnostic scans in the Scanner tab to build your localized field audit history.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '28px', borderRadius: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History className="text-gradient" size={22} /> Audit Scan History ({history.length})
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Stored locally in your browser workspace
          </p>
        </div>

        <button onClick={onClearHistory} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', color: '#fb7185' }}>
          <Trash2 size={14} /> Clear History
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {history.map((item, idx) => {
          const isHealthy = item.results.primary_prediction.is_healthy;
          return (
            <div
              key={idx}
              className="glass-card glass-card-interactive"
              onClick={() => onSelectHistory(item)}
              style={{
                padding: '16px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img
                  src={item.imageSrc}
                  alt="Thumb"
                  style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-glass)' }}
                />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className={`badge ${isHealthy ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                      {isHealthy ? <ShieldCheck size={11} /> : <AlertCircle size={11} />}
                      {isHealthy ? 'Healthy' : item.results.disease_info.severity}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {item.timestamp}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                    {item.results.primary_prediction.crop} — {item.results.primary_prediction.disease}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                    Confidence Match: <strong style={{ color: '#34d399' }}>{item.results.primary_prediction.probability}%</strong>
                  </p>
                </div>
              </div>

              <div className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                View <ArrowUpRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
