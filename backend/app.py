import sys
import os

# Ensure site-packages path
sys.path.append(r"C:\Users\ashwi\AppData\Roaming\Python\Python312\site-packages")

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from model_service import ViTCropClassifier
from disease_database import parse_class_name, get_disease_details

app = Flask(__name__)
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
