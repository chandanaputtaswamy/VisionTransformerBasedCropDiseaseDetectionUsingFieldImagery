import sys
sys.path.append(r"C:\Users\ashwi\AppData\Roaming\Python\Python312\site-packages")
import torch
import timm

def test_load():
    path = "best_vit_crop_disease.pth"
    checkpoint = torch.load(path, map_location="cpu", weights_only=False)
    model_name = checkpoint.get("model_name", "vit_small_patch16_224")
    num_classes = checkpoint.get("num_classes", 107)
    
    print(f"Creating model {model_name} with {num_classes} classes...")
    model = timm.create_model(model_name, num_classes=num_classes, pretrained=False)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.eval()
    print("Model successfully loaded!")
    
    # Test dummy tensor
    dummy = torch.randn(1, 3, 224, 224)
    out = model(dummy)
    probs = torch.softmax(out, dim=1)
    print("Output shape:", out.shape)
    print("Top 3 classes idx:", torch.topk(probs, 3).indices[0].tolist())
    print("Top 3 probabilities:", torch.topk(probs, 3).values[0].tolist())

if __name__ == "__main__":
    test_load()
