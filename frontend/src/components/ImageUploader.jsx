import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, Sparkles, X, RefreshCw, CheckCircle2 } from 'lucide-react';
import { predictImage, predictSample } from '../services/api';

export default function ImageUploader({ onAnalysisComplete, samples }) {
  const [selectedImage, setSelectedImage] = useState(null); // File, Blob, or URL preview
  const [imageFile, setImageFile] = useState(null); // File or Blob to send
  const [sampleUrl, setSampleUrl] = useState(null); // Selected sample URL
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Handle Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }
    setErrorMsg(null);
    setImageFile(file);
    setSampleUrl(null);
    setSelectedImage(URL.createObjectURL(file));
  };

  // Camera Handling
  const startCamera = async () => {
    try {
      setErrorMsg(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setErrorMsg('Unable to access camera. Please allow camera permissions or upload an image file.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      stopCamera();
      if (blob) {
        const file = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' });
        processFile(file);
      }
    }, 'image/jpeg', 0.92);
  };

  // Select Sample Image
  const handleSelectSample = (sample) => {
    setErrorMsg(null);
    setImageFile(null);
    setSampleUrl(sample.url);
    setSelectedImage(`http://localhost:5000${sample.url}`);
  };

  // Trigger Model Inference
  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      let results;
      if (imageFile) {
        results = await predictImage(imageFile);
      } else if (sampleUrl) {
        results = await predictSample(sampleUrl);
      } else {
        throw new Error('No image selected');
      }

      onAnalysisComplete(results, selectedImage);
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMsg(err.message || 'Failed to analyze crop image. Is the backend server running?');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setImageFile(null);
    setSampleUrl(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="glass-card" style={{ padding: '28px', borderRadius: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} className="text-gradient" /> Field Image Input
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Upload or capture leaf imagery for Vision Transformer (ViT-S/16) disease classification
          </p>
        </div>

        {selectedImage && (
          <button onClick={clearSelection} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            <X size={14} /> Clear Image
          </button>
        )}
      </div>

      {errorMsg && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '12px',
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: '#fb7185',
          fontSize: '0.88rem',
          marginBottom: '20px'
        }}>
          {errorMsg}
        </div>
      )}

      {/* Camera Live View Modal / Area */}
      {isCameraActive ? (
        <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#000', height: '360px' }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="scan-line" />
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '12px',
            zIndex: 10
          }}>
            <button onClick={capturePhoto} className="btn-primary">
              <Camera size={18} /> Capture Leaf Photo
            </button>
            <button onClick={stopCamera} className="btn-secondary" style={{ background: 'rgba(0,0,0,0.7)' }}>
              Cancel
            </button>
          </div>
        </div>
      ) : selectedImage ? (
        /* Image Preview Box */
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid var(--border-glass-bright)',
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxHeight: '400px'
        }}>
          <img
            src={selectedImage}
            alt="Selected Crop Leaf"
            style={{ maxWidth: '100%', maxHeight: '380px', objectFit: 'contain', borderRadius: '12px' }}
          />
          {isAnalyzing && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(11, 19, 17, 0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              zIndex: 20
            }}>
              <div className="scan-line" />
              <RefreshCw size={40} className="text-gradient" style={{ animation: 'spin 1.5s linear infinite' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Executing ViT-S/16 Transformer Inference...</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Analyzing 197 patch embeddings against 107 agricultural categories
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Dropzone Box */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{
            border: `2px dashed ${dragOver ? 'var(--emerald-primary)' : 'rgba(52, 211, 153, 0.25)'}`,
            borderRadius: '18px',
            padding: '48px 24px',
            textAlign: 'center',
            background: dragOver ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(52, 211, 153, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <UploadCloud size={32} className="text-gradient" />
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px 0' }}>
            Drag & Drop Leaf Image Here
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
            Supports high-res field photography in JPEG, PNG, or WEBP format
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="btn-primary"
              style={{ fontSize: '0.88rem' }}
            >
              <ImageIcon size={16} /> Browse Files
            </button>
            <button
              onClick={startCamera}
              className="btn-secondary"
              style={{ fontSize: '0.88rem' }}
            >
              <Camera size={16} /> Open Camera
            </button>
          </div>
        </div>
      )}

      {/* Action & Samples bar */}
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {selectedImage && !isAnalyzing && (
          <button
            onClick={handleAnalyze}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1rem',
              justifyContent: 'center',
              borderRadius: '14px'
            }}
          >
            <Sparkles size={20} /> Run Vision Transformer Analysis
          </button>
        )}

        {/* 1-Click Sample selector */}
        {samples && samples.length > 0 && (
          <div>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              Or Try Quick 1-Click Test Samples:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {samples.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(s)}
                  className="btn-secondary"
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    borderRadius: '20px',
                    borderColor: sampleUrl === s.url ? 'var(--emerald-primary)' : 'var(--border-glass)',
                    background: sampleUrl === s.url ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)'
                  }}
                >
                  <CheckCircle2 size={13} color={sampleUrl === s.url ? '#34d399' : '#64748b'} />
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
