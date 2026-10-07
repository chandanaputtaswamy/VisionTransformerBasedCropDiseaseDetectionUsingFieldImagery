# AgriVision: Vision Transformer (ViT) Crop Disease Detection System

AgriVision is an end-to-end full-stack artificial intelligence application for detecting crop diseases and pest infestations from field photography. It uses a **Vision Transformer (`vit_small_patch16_224`)** PyTorch deep learning model trained on **107 agricultural categories** across 25 crop species with a **95.17% validation accuracy**.

---

## ⚡ Quick Start (Single Command)

If your server or runtime disconnects, you can restart both the Flask Backend and React Frontend concurrently with **one single command**:

### First-time setup (Windows PowerShell)
```powershell
python -m venv backend\venv
backend\venv\Scripts\python.exe -m pip install -r requirements.txt
npm install
npm --prefix frontend install
```

For terminal launches, activate the Python environment in each new terminal before running `npm start`:
```powershell
.\backend\venv\Scripts\Activate.ps1
npm start
```

The `start.bat` launcher activates this environment automatically.

### Option 1: Terminal Command
```bash
npm start
```

### Option 2: Windows Double-Click Launcher
Double-click **`start.bat`** in the project folder!

Both options will automatically start:
- 🐍 **Flask Backend API**: `http://localhost:5000`
- ⚛️ **React Web Frontend**: `http://localhost:5173`

---

## 🌟 Key Features

- **PyTorch ViT-Small/16 Model (`best_vit_crop_disease.pth`)**:
  - Classifies 107 agricultural targets (Apple, Banana, Cauliflower, Chilli, Coconut, Corn, Cotton, Grape, Groundnut, Potato, Rice, Soybean, Sugarcane, Tomato, Wheat, etc.).
  - Computes top-5 prediction probabilities and softmax confidence scores.
  - Sub-second CPU latency (~120ms).
- **Classy Modern React + Vite Frontend**:
  - **Glassmorphism UI** with emerald/cyan accent glows and responsive layouts.
  - **Drag & Drop Uploader** supporting JPEG, PNG, WEBP.
  - **Live Webcam Field Scanner** for mobile/laptop camera capture.
  - **1-Click Test Samples Gallery** for immediate demonstration.
  - **Interactive Diagnostic Card**: Crop & disease badges, severity rating (Low, Moderate, High, Severe), latency display.
  - **Top-5 Confidence Breakdown Chart**: Visual progress bars for multi-class probability scores.
  - **Tabbed Agronomic Guidance**: Visual symptoms, eco-friendly organic remedies, active chemical fungicides, and field prevention strategies.
  - **Disease Catalog**: Searchable directory of all 107 trained crop disease classes with category filtering.
  - **Audit Scan History**: Saved locally in browser `localStorage`.
  - **Export PDF Report**: Printable diagnostic summary.
- **Python Flask REST API Backend**:
  - `GET /api/health`: System health & model status check.
  - `GET /api/classes`: Returns list and breakdown of all 107 classes.
  - `GET /api/sample-images`: List of pre-built sample field images.
  - `POST /api/predict`: Runs PyTorch Vision Transformer inference on uploaded image bytes.

---

## 📂 Project Folder Structure

```
frontendNbackend/
├── start.bat                      # One-click launcher for Windows
├── package.json                   # Root package with 'npm start' concurrent script
├── best_vit_crop_disease.pth      # PyTorch ViT Model Checkpoint (86.8 MB)
├── backend/
│   ├── app.py                     # Flask REST API server (Port 5000)
│   ├── model_service.py           # PyTorch ViT inference engine & preprocessing
│   ├── disease_database.py        # 107 crop diseases knowledge base
│   └── sample_images/             # Pre-built sample field images
├── frontend/                      # React + Vite application (Port 5173)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css              # Custom Glassmorphic design system
│   │   └── components/
│   └── package.json
└── README.md
```
