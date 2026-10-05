import React from 'react';
import { Sprout, Cpu, ShieldCheck, Database, History, Search } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, healthStatus, historyCount }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-glass)',
      background: 'rgba(11, 19, 17, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '16px 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('scanner')}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Sprout size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                Agri<span className="text-gradient">Vision</span>
              </h1>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                ViT-S/16
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', margin: 0 }}>
              Vision Transformer Crop Disease Detection • 107 Classes
            </p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
          <button
            onClick={() => setActiveTab('scanner')}
            className={activeTab === 'scanner' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.88rem' }}
          >
            <Cpu size={16} /> Diagnostic Scanner
          </button>
          
          <button
            onClick={() => setActiveTab('catalog')}
            className={activeTab === 'catalog' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.88rem' }}
          >
            <Database size={16} /> Disease Catalog
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.88rem', position: 'relative' }}
          >
            <History size={16} /> History
            {historyCount > 0 && (
              <span style={{
                background: '#10b981',
                color: '#fff',
                borderRadius: '50%',
                fontSize: '0.7rem',
                width: '18px',
                height: '18px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                marginLeft: '4px'
              }}>
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* System Health pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: healthStatus?.model_loaded ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            border: `1px solid ${healthStatus?.model_loaded ? 'rgba(52, 211, 153, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: healthStatus?.model_loaded ? '#10b981' : '#f43f5e',
              boxShadow: healthStatus?.model_loaded ? '0 0 10px #10b981' : '0 0 10px #f43f5e'
            }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: healthStatus?.model_loaded ? '#34d399' : '#f43f5e' }}>
              {healthStatus?.model_loaded ? `ViT Ready (${healthStatus?.accuracy || '95.17%'} Acc)` : 'Backend Offline'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
