const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Backend health check failed');
    return await res.json();
  } catch (err) {
    console.error('Health API error:', err);
    return { status: 'offline', model_loaded: false };
  }
}

export async function fetchClasses() {
  try {
    const res = await fetch(`${API_BASE_URL}/classes`);
    if (!res.ok) throw new Error('Failed to fetch class database');
    return await res.json();
  } catch (err) {
    console.error('Classes API error:', err);
    return { total_classes: 0, classes: [] };
  }
}

export async function fetchSampleImages() {
  try {
    const res = await fetch(`${API_BASE_URL}/sample-images`);
    if (!res.ok) throw new Error('Failed to fetch sample images');
    return await res.json();
  } catch (err) {
    console.error('Sample images API error:', err);
    return { samples: [] };
  }
}

export async function predictImage(fileOrBlob) {
  const formData = new FormData();
  formData.append('file', fileOrBlob);

  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Prediction failed with HTTP ${res.status}`);
  }

  return await res.json();
}

export async function predictSample(sampleUrl) {
  const sampleRes = await fetch(`http://localhost:5000${sampleUrl}`);
  if (!sampleRes.ok) throw new Error('Failed to download sample image');
  const blob = await sampleRes.blob();
  return await predictImage(blob);
}
