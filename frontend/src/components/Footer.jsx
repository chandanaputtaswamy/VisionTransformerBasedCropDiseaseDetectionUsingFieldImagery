import React from 'react';
import { Sprout, Cpu, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      marginTop: '60px',
      borderTop: '1px solid var(--border-glass)',
      background: 'rgba(11, 19, 17, 0.9)',
      padding: '32px 24px',
      fontSize: '0.84rem',
      color: 'var(--text-subtle)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sprout size={20} className="text-gradient" />
          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
            AgriVision ViT-S/16 Deep Learning System
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Architecture: <strong style={{ color: '#fff' }}>vit_small_patch16_224</strong></span>
          <span>•</span>
          <span>Top-1 Accuracy: <strong style={{ color: '#34d399' }}>95.17%</strong></span>
          <span>•</span>
          <span>Classes: <strong style={{ color: '#fff' }}>107</strong></span>
        </div>
      </div>
    </footer>
  );
}
