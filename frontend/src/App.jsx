import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import DiagnosticCard from './components/DiagnosticCard';
import ProbabilityChart from './components/ProbabilityChart';
import DiseaseDetailTabs from './components/DiseaseDetailTabs';
import DiseaseCatalog from './components/DiseaseCatalog';
import ScanHistory from './components/ScanHistory';
import Footer from './components/Footer';

import { fetchHealth, fetchClasses, fetchSampleImages } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [healthStatus, setHealthStatus] = useState(null);
  const [classData, setClassData] = useState(null);
  const [samples, setSamples] = useState([]);
  
  // Prediction results state
  const [analysisResults, setAnalysisResults] = useState(null);
  const [activeImageSrc, setActiveImageSrc] = useState(null);
  
  // History state in localStorage
  const [scanHistory, setScanHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('agri_scan_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Initial load
  useEffect(() => {
    async function loadInitialData() {
      const health = await fetchHealth();
      setHealthStatus(health);

      const classes = await fetchClasses();
      setClassData(classes);

      const samplesData = await fetchSampleImages();
      setSamples(samplesData.samples || []);
    }

    loadInitialData();
    const interval = setInterval(async () => {
      const health = await fetchHealth();
      setHealthStatus(health);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agri_scan_history', JSON.stringify(scanHistory));
    } catch (err) {
      console.error('Failed to save scan history:', err);
    }
  }, [scanHistory]);

  const handleAnalysisComplete = (results, imageSrc) => {
    setAnalysisResults(results);
    setActiveImageSrc(imageSrc);

    // Add to history log
    const newEntry = {
      timestamp: new Date().toLocaleString(),
      results: results,
      imageSrc: imageSrc
    };

    setScanHistory((prev) => [newEntry, ...prev.slice(0, 19)]);
  };

  const handleResetScan = () => {
    setAnalysisResults(null);
    setActiveImageSrc(null);
  };

  const handleSelectHistoryItem = (item) => {
    setAnalysisResults(item.results);
    setActiveImageSrc(item.imageSrc);
    setActiveTab('scanner');
  };

  const handleClearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('agri_scan_history');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        healthStatus={healthStatus}
        historyCount={scanHistory.length}
      />

      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        {activeTab === 'scanner' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Input upload / capture component */}
            <ImageUploader
              onAnalysisComplete={handleAnalysisComplete}
              samples={samples}
            />

            {/* Analysis Results Display */}
            {analysisResults && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <DiagnosticCard
                  results={analysisResults}
                  imageSrc={activeImageSrc}
                  onReset={handleResetScan}
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                  <ProbabilityChart topPredictions={analysisResults.top_predictions} />
                  <DiseaseDetailTabs diseaseInfo={analysisResults.disease_info} />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'catalog' && (
          <DiseaseCatalog classData={classData} />
        )}

        {activeTab === 'history' && (
          <ScanHistory
            history={scanHistory}
            onSelectHistory={handleSelectHistoryItem}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
