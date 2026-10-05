import sys
sys.path.append(r"C:\Users\ashwi\AppData\Roaming\Python\Python312\site-packages")
import torch

def main():
    path = "best_vit_crop_disease.pth"
    checkpoint = torch.load(path, map_location="cpu", weights_only=False)
    print("Keys in checkpoint:", list(checkpoint.keys()))
    print("Model name:", checkpoint.get("model_name"))
    print("Num classes:", checkpoint.get("num_classes"))
    print("Best val acc:", checkpoint.get("best_val_acc"))
    print("Img size:", checkpoint.get("img_size"))
    class_names = checkpoint.get("class_names")
    print("Class names count:", len(class_names) if class_names else None)
    print("Class names:", class_names)
    
    state_dict = checkpoint.get("model_state_dict", checkpoint)
    print("State dict keys count:", len(state_dict))
    print("\nSample state dict keys & shapes:")
    for i, (k, v) in enumerate(state_dict.items()):
        if i < 10 or "head" in k or "fc" in k or "classifier" in k:
            print(f"  {k}: {v.shape}")

if __name__ == "__main__":
    main()
