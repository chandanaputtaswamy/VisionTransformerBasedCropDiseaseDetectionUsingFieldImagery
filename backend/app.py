import sys
import os

# Ensure site-packages path
sys.path.append(r"C:\Users\ashwi\AppData\Roaming\Python\Python312\site-packages")

from flask import Flask, request, jsonify, send_from_directory, render_template_string
from flask_cors import CORS
from model_service import ViTCropClassifier
from disease_database import parse_class_name, get_disease_details

app = Flask(__name__, static_folder=None)
CORS(app)  # Enable Cross-Origin Resource Sharing for React frontend

# Paths
MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "best_vit_crop_disease.pth"))
SAMPLES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "sample_images"))

print("Initializing ViT Model Classifier...")
try:
    classifier = ViTCropClassifier(MODEL_PATH)
except Exception as e:
    print(f"Error loading model: {e}")
    classifier = None

# Dedicated API Dashboard HTML template for http://localhost:5000/
API_DASHBOARD_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AgriVision REST API Dashboard</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono&display=swap">
    <style>
        :root {
            --bg-dark: #0b1311;
            --bg-card: rgba(18, 30, 26, 0.85);
            --border-glass: rgba(52, 211, 153, 0.2);
            --emerald: #10b981;
            --teal: #2dd4bf;
            --text-main: #f1f5f9;
            --text-muted: #94a3b8;
        }
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: var(--bg-dark);
            color: var(--text-main);
            margin: 0;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
        }
        .container {
            max-width: 860px;
            width: 100%;
        }
        .card {
            background: var(--bg-card);
            border: 1px solid var(--border-glass);
            border-radius: 20px;
            padding: 32px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            margin-bottom: 24px;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
            border-bottom: 1px solid var(--border-glass);
            padding-bottom: 20px;
            margin-bottom: 24px;
        }
        .title {
            font-size: 1.6rem;
            font-weight: 800;
            margin: 0;
            background: linear-gradient(135deg, #34d399, #2dd4bf);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .badge {
            background: rgba(16, 185, 129, 0.15);
            color: #34d399;
            border: 1px solid rgba(52, 211, 153, 0.3);
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 700;
        }
        .btn-launch {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: #fff;
            text-decoration: none;
            font-weight: 700;
            padding: 12px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.35);
            transition: all 0.2s ease;
        }
        .btn-launch:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(16, 185, 129, 0.5);
        }
        .endpoint-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
            gap: 16px;
        }
        .endpoint-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border-glass);
            border-radius: 14px;
            padding: 18px;
        }
        .method {
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            font-size: 0.75rem;
            padding: 2px 8px;
            border-radius: 6px;
            text-transform: uppercase;
        }
        .method-get { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }
        .method-post { background: rgba(52, 211, 153, 0.2); color: #34d399; }
        .path {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.95rem;
            font-weight: 600;
            color: #fff;
            margin-left: 8px;
        }
        a.api-link {
            color: #34d399;
            text-decoration: none;
        }
        a.api-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <div>
                    <h1 class="title">🌾 AgriVision REST API Backend</h1>
                    <p style="color: var(--text-muted); font-size: 0.88rem; margin: 6px 0 0 0;">
                        PyTorch Vision Transformer (<code style="color:#34d399">vit_small_patch16_224</code>) Classification Engine
                    </p>
                </div>
                <span class="badge">● REST API Server (Port 5000)</span>
            </div>

            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(52, 211, 153, 0.25); border-radius: 14px; padding: 20px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                <div>
                    <h3 style="margin: 0; font-size: 1.05rem; color: #fff;">Looking for the AgriVision Web Diagnostic UI?</h3>
                    <p style="margin: 4px 0 0 0; font-size: 0.84rem; color: var(--text-muted);">
                        The interactive React Diagnostic Web App runs on port 5173.
                    </p>
                </div>
                <a href="http://localhost:5173" class="btn-launch" target="_blank">
                    Open React Web App (Port 5173) ↗
                </a>
            </div>

            <h2 style="font-size: 1.15rem; margin: 0 0 16px 0; color: #fff;">📡 Registered REST API Endpoints</h2>

            <div class="endpoint-grid">
                <div class="endpoint-card">
                    <span class="method method-get">GET</span>
                    <span class="path"><a href="/api/health" class="api-link" target="_blank">/api/health</a></span>
                    <p style="font-size: 0.82rem; color: var(--text-muted); margin: 8px 0 0 0;">
                        Returns model status, architecture (<code>vit_small_patch16_224</code>), 107 classes count, validation accuracy (95.17%), and device hardware.
                    </p>
                </div>

                <div class="endpoint-card">
                    <span class="method method-get">GET</span>
                    <span class="path"><a href="/api/classes" class="api-link" target="_blank">/api/classes</a></span>
                    <p style="font-size: 0.82rem; color: var(--text-muted); margin: 8px 0 0 0;">
                        Returns full breakdown of all 107 agricultural categories across 25 crop species.
                    </p>
                </div>

                <div class="endpoint-card">
                    <span class="method method-get">GET</span>
                    <span class="path"><a href="/api/sample-images" class="api-link" target="_blank">/api/sample-images</a></span>
                    <p style="font-size: 0.82rem; color: var(--text-muted); margin: 8px 0 0 0;">
                        Lists sample test field photography images available for quick demonstration.
                    </p>
                </div>

                <div class="endpoint-card">
                    <span class="method method-post">POST</span>
                    <span class="path">/api/predict</span>
                    <p style="font-size: 0.82rem; color: var(--text-muted); margin: 8px 0 0 0;">
                        Accepts multipart image upload, runs PyTorch ViT inference, returns top-5 prediction scores, symptoms, organic remedies, and prevention.
                    </p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
"""


@app.route("/", methods=["GET"])
def index():
    return render_template_string(API_DASHBOARD_HTML)


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online" if classifier else "degraded",
        "model_loaded": classifier is not None,
        "model_name": classifier.model_name if classifier else None,
        "num_classes": len(classifier.class_names) if classifier else 0,
        "accuracy": f"{classifier.best_val_acc * 100:.2f}%" if classifier else "N/A",
        "device": str(classifier.device) if classifier else "N/A"
    })


@app.route("/api/classes", methods=["GET"])
def get_classes():
    if not classifier:
        return jsonify({"error": "Model not loaded"}), 500
        
    classes_list = []
    crops_summary = {}
    
    for idx, c in enumerate(classifier.class_names):
        crop, disease, is_healthy = parse_class_name(c)
        crops_summary[crop] = crops_summary.get(crop, 0) + 1
        classes_list.append({
            "id": idx,
            "raw_name": c,
            "crop": crop,
            "disease": disease,
            "is_healthy": is_healthy
        })
        
    return jsonify({
        "total_classes": len(classes_list),
        "total_crops": len(crops_summary),
        "crops_breakdown": crops_summary,
        "classes": classes_list
    })


@app.route("/api/sample-images", methods=["GET"])
def list_sample_images():
    if not os.path.exists(SAMPLES_DIR):
        return jsonify({"samples": []})
        
    samples = []
    sample_meta = {
        "apple_scab.jpg": {"name": "Apple Scab Leaf", "crop": "Apple"},
        "corn_rust.jpg": {"name": "Corn Common Rust Leaf", "crop": "Corn"},
        "tomato_blight.jpg": {"name": "Tomato Early Blight", "crop": "Tomato"},
        "grape_rot.jpg": {"name": "Grape Black Rot", "crop": "Grape"},
        "healthy_leaf.jpg": {"name": "Healthy Plant Leaf", "crop": "Healthy"}
    }
    
    for fname in os.listdir(SAMPLES_DIR):
        if fname.endswith((".jpg", ".png", ".jpeg")):
            meta = sample_meta.get(fname, {"name": fname.replace("_", " ").title(), "crop": "Crop"})
            samples.append({
                "filename": fname,
                "title": meta["name"],
                "crop": meta["crop"],
                "url": f"/api/sample-images/{fname}"
            })
            
    return jsonify({"samples": samples})


@app.route("/api/sample-images/<filename>", methods=["GET"])
def get_sample_image(filename):
    return send_from_directory(SAMPLES_DIR, filename)


@app.route("/api/predict", methods=["POST"])
def predict():
    if not classifier:
        return jsonify({"error": "Model failed to load on backend"}), 500
        
    if "file" not in request.files and not request.data:
        return jsonify({"error": "No image file provided in request"}), 400
        
    try:
        if "file" in request.files:
            file = request.files["file"]
            img_bytes = file.read()
        else:
            img_bytes = request.data
            
        if not img_bytes:
            return jsonify({"error": "Uploaded image file is empty"}), 400
            
        results = classifier.predict(img_bytes, top_k=5)
        return jsonify(results)
        
    except Exception as e:
        print(f"Prediction exception: {e}")
        return jsonify({"error": f"Failed to process image: {str(e)}"}), 500


if __name__ == "__main__":
    print("Starting Flask Backend server on http://localhost:5000...")
    app.run(host="0.0.0.0", port=5000, debug=False)
