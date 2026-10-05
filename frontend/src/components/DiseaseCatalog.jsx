import React, { useState, useMemo } from 'react';
import { Search, Database, Filter, ShieldCheck, AlertCircle } from 'lucide-react';

export default function DiseaseCatalog({ classData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('ALL');

  const cropsList = useMemo(() => {
    if (!classData?.crops_breakdown) return [];
    return Object.keys(classData.crops_breakdown).sort();
  }, [classData]);

  const filteredClasses = useMemo(() => {
    if (!classData?.classes) return [];
    return classData.classes.filter((c) => {
      const matchesSearch =
        c.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.raw_name.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCrop = selectedCrop === 'ALL' || c.crop === selectedCrop;
      return matchesSearch && matchesCrop;
    });
  }, [classData, searchTerm, selectedCrop]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Filter Controls */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Database className="text-gradient" size={24} /> Model Knowledge Base (107 Classes)
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Browse all crop species and pathogen targets trained in ViT-S/16
            </p>
          </div>

          <div className="badge badge-emerald" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            {classData?.total_crops || 0} Crops • {classData?.total_classes || 107} Categories
          </div>
        </div>

        {/* Search & Crop Filter Bar */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search crop, disease, or pathogen name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-glass)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--border-glass)',
              color: '#fff',
              fontSize: '0.88rem',
              outline: 'none',
              cursor: 'pointer',
              minWidth: '180px'
            }}
          >
            <option value="ALL">All Crops ({cropsList.length})</option>
            {cropsList.map((crop) => (
              <option key={crop} value={crop} style={{ background: '#121e1a' }}>
                {crop} ({classData.crops_breakdown[crop]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Disease Categories */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {filteredClasses.map((item) => (
          <div key={item.id} className="glass-card glass-card-interactive" style={{ padding: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Class #{item.id} • {item.crop}
              </span>
              <span className={`badge ${item.is_healthy ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                {item.is_healthy ? <ShieldCheck size={11} /> : <AlertCircle size={11} />}
                {item.is_healthy ? 'Healthy' : 'Pathogen'}
              </span>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              {item.disease}
            </h3>

            <p className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '8px', wordBreak: 'break-all' }}>
              {item.raw_name}
            </p>
          </div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>No crop diseases match your search criteria.</p>
        </div>
      )}
    </div>
  );
}
