import React, { useState } from 'react';
import { Stethoscope, Leaf, FlaskConical, ShieldAlert, CheckCircle } from 'lucide-react';

export default function DiseaseDetailTabs({ diseaseInfo }) {
  const [activeTab, setActiveTab] = useState('symptoms');
  if (!diseaseInfo) return null;

  const tabs = [
    { id: 'symptoms', label: 'Symptoms & Impact', icon: Stethoscope },
    { id: 'organic', label: 'Organic Remedies', icon: Leaf },
    { id: 'chemical', label: 'Chemical Solutions', icon: FlaskConical },
    { id: 'prevention', label: 'Field Prevention', icon: ShieldAlert },
  ];

  return (
    <div className="glass-card" style={{ padding: '24px', borderRadius: '20px' }}>
      {/* Tab navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-glass)',
        paddingBottom: '12px',
        marginBottom: '20px',
        overflowX: 'auto'
      }}>
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={isActive ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 16px', fontSize: '0.84rem', whiteSpace: 'nowrap' }}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content area */}
      <div style={{ minHeight: '160px' }}>
        {activeTab === 'symptoms' && (
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 12px 0', color: '#34d399' }}>
              Identified Symptoms & Visual Markers:
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {diseaseInfo.symptoms?.map((sym, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                  <CheckCircle size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'organic' && (
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 12px 0', color: '#2dd4bf' }}>
              Recommended Eco-Friendly & Organic Interventions:
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {diseaseInfo.organic_remedies?.map((rem, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                  <Leaf size={16} color="#2dd4bf" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>{rem}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'chemical' && (
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 12px 0', color: '#f59e0b' }}>
              Chemical Sprays & Active Ingredient Fungicides:
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {diseaseInfo.chemical_treatments?.map((chem, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                  <FlaskConical size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>{chem}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'prevention' && (
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 12px 0', color: '#38bdf8' }}>
              Agronomic Cultural & Field Prevention Measures:
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {diseaseInfo.prevention?.map((prev, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                  <ShieldAlert size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>{prev}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
