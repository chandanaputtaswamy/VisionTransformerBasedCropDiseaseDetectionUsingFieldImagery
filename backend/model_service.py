import sys
import os
import io
import time
from PIL import Image

# Ensure user site packages are in path for PyTorch and timm
sys.path.append(r"C:\Users\ashwi\AppData\Roaming\Python\Python312\site-packages")

import torch
from torchvision import transforms
import timm

from disease_database import get_disease_details

class ViTCropClassifier:
    def __init__(self, model_path):
        self.model_path = model_path
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = None
        self.class_names = []
        self.img_size = 224
        self.model_name = "vit_small_patch16_224"
        self.best_val_acc = 0.0
        
        # PyTorch Image Preprocessing Pipeline
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
        self.load_model()

    def load_model(self):
        print(f"Loading Vision Transformer checkpoint from {self.model_path}...")
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file not found at {self.model_path}")
            
        checkpoint = torch.load(self.model_path, map_location=self.device, weights_only=False)
        self.model_name = checkpoint.get("model_name", "vit_small_patch16_224")
        self.class_names = checkpoint.get("class_names", [])
        num_classes = checkpoint.get("num_classes", len(self.class_names) or 107)
        self.best_val_acc = float(checkpoint.get("best_val_acc", 0.9516))
        self.img_size = checkpoint.get("img_size", 224)
        
        print(f"Creating {self.model_name} architecture for {num_classes} classes...")
        self.model = timm.create_model(self.model_name, num_classes=num_classes, pretrained=False)
        
        state_dict = checkpoint.get("model_state_dict", checkpoint)
        self.model.load_state_dict(state_dict)
        self.model.to(self.device)
        self.model.eval()
        print(f"Model successfully loaded on {self.device}! Total classes: {len(self.class_names)}")

    def predict(self, image_bytes, top_k=5):
        start_time = time.time()
        
        # Open and convert image to RGB
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(img_tensor)
            probabilities = torch.softmax(outputs, dim=1)[0]
            
        top_probs, top_indices = torch.topk(probabilities, k=min(top_k, len(self.class_names)))
        
        top_probs = top_probs.cpu().tolist()
        top_indices = top_indices.cpu().tolist()
        
        top_predictions = []
        for prob, idx in zip(top_probs, top_indices):
            raw_class = self.class_names[idx] if idx < len(self.class_names) else f"Class_{idx}"
            details = get_disease_details(raw_class)
            top_predictions.append({
                "class_index": idx,
                "raw_class_name": raw_class,
                "crop": details["crop"],
                "disease": details["disease"],
                "is_healthy": details["is_healthy"],
                "probability": round(prob * 100, 2),
                "confidence_score": round(prob, 4)
            })
            
        primary = top_predictions[0]
        primary_details = get_disease_details(primary["raw_class_name"])
        
        inference_time_ms = round((time.time() - start_time) * 1000, 2)
        
        return {
            "primary_prediction": primary,
            "disease_info": primary_details,
            "top_predictions": top_predictions,
            "model_metadata": {
                "model_architecture": self.model_name,
                "validation_accuracy": round(self.best_val_acc * 100, 2),
                "device": str(self.device),
                "inference_time_ms": inference_time_ms
            }
        }
