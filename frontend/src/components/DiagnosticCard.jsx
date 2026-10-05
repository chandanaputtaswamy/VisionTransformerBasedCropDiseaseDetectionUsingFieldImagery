import React from 'react';
import { ShieldCheck, AlertTriangle, Activity, Zap, Printer, RotateCcw, Award } from 'lucide-react';

export default function DiagnosticCard({ results, imageSrc, onReset }) {
  if (!results) return null;

  const { primary_prediction, disease_info, model_metadata } = results;
  const isHealthy = primary_prediction.is_healthy;
  const probability = primary_prediction.probability;

  // Determine severity badge style
  const getBadgeClass = (severity) => {
    if (isHealthy) return 'badge-emerald';
    if (severity === 'Severe' || severity === 'High') return 'badge-rose';
    return 'badge-amber';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-card" style={{ padding: '28px', borderRadius: '24px' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className={`badge ${getBadgeClass(disease_info.severity)}`}>
              {isHealthy ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
              {isHealthy ? 'Healthy Vegetation' : `${disease_info.severity} Risk Severity`}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              Crop: <strong style={{ color: '#fff' }}>{primary_prediction.crop}</strong>
            </span>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
            {primary_prediction.disease}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {disease_info.description}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handlePrint} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
            <Printer size={15} /> Export PDF Report
          </button>
          <button onClick={onReset} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
            <RotateCcw size={15} /> New Scan
          </button>
        </div>
      </div>

      {/* Grid view: Confidence Gauge & Model Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginTop: '24px',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '16px',
        border: '1px solid var(--border-glass)'
      }}>
        {/* Confidence Score Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Transformer Confidence Match
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: probability > 80 ? '#34d399' : '#fbbf24' }}>
              {probability}%
            </span>
          </div>

          <div style={{
            height: '10px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <div
              className="progress-bar-fill"
              style={{
                width: `${probability}%`,
                background: probability > 80
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : 'linear-gradient(90deg, #f59e0b, #fbbf24)'
              }}
            />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '6px' }}>
            Top-1 prediction score out of 107 agricultural targets
          </p>
        </div>

        {/* Inference Stats */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#34d399'
          }}>
            <Zap size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Latency & Hardware</span>
            <strong style={{ fontSize: '0.92rem', color: '#fff' }}>
              {model_metadata.inference_time_ms} ms <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>({model_metadata.device.toUpperCase()})</span>
            </strong>
          </div>
        </div>

        {/* Model Accuracy Badge */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.1)',
            color: '#38bdf8'
          }}>
            <Award size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Architecture</span>
            <strong style={{ fontSize: '0.92rem', color: '#fff' }}>
              ViT-Small/16 <span style={{ fontSize: '0.78rem', color: '#34d399' }}>({model_metadata.validation_accuracy}% Val Acc)</span>
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
