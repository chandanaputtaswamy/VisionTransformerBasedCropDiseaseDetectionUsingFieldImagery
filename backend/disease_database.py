# Comprehensive database of crop disease metadata for 107 classes

def parse_class_name(raw_name):
    """
    Parses raw class string like 'Corn_(maize)___Cercospora_Leaf_Spot_Gray_Leaf_Spot' 
    into formatted Crop Name and Disease Name.
    """
    if "___" in raw_name:
        parts = raw_name.split("___")
        crop_part = parts[0].replace("_", " ").replace("(including Sour)", "(Sour)").strip()
        disease_part = parts[1].replace("_", " ").strip()
    else:
        crop_part = "Unknown Crop"
        disease_part = raw_name.replace("_", " ")

    is_healthy = "healthy" in disease_part.lower()
    
    return crop_part, disease_part, is_healthy


DISEASE_KNOWLEDGE_BASE = {
    "Apple___Apple_Scab": {
        "severity": "Moderate",
        "description": "Fungal disease caused by Venturia inaequalis leading to olive-green spots on leaves and scabby lesions on fruits.",
        "symptoms": ["Olive-green or brown leaf spots", "Velvety coating on leaf underside", "Dark brown corky scab spots on apple skin", "Deformed or cracked fruit"],
        "organic_remedies": ["Apply neem oil or sulfur sprays early in the season", "Rake and burn fallen infected leaves", "Prune canopy to promote air circulation"],
        "chemical_treatments": ["Apply Captan or Mancozeb protective fungicides", "Use Myclobutanil or Difenoconazole at bud break"],
        "prevention": ["Plant scab-resistant apple cultivars", "Ensure good sun exposure and fast leaf drying"]
    },
    "Apple___Black_Rot": {
        "severity": "High",
        "description": "Caused by Botryosphaeria obtusa, causing leaf spots (frog-eye), fruit rot, and cankers on branches.",
        "symptoms": ["Frog-eye leaf spots with purple borders", "Black rotting rings on fruit", "Mummified apples clinging to branches", "Cankers on bark"],
        "organic_remedies": ["Prune out all dead wood and mummified fruit", "Apply copper hydroxide spray before flower bloom"],
        "chemical_treatments": ["Apply Thiophanate-methyl or Captan fungicides", "Fungicide sprays from pink bud through cover sprays"],
        "prevention": ["Remove infected wood and burn it", "Keep orchard clean of debris and fallen fruit"]
    },
    "Corn_(maize)___Common_Rust": {
        "severity": "Moderate",
        "description": "Fungal disease caused by Puccinia sorghi, producing brownish-red pustules on leaf surfaces.",
        "symptoms": ["Oval to elongate reddish-brown pustules", "Pustules appear on upper and lower leaf surfaces", "Leaves yellowing and premature drying"],
        "organic_remedies": ["Apply bio-fungicides containing Bacillus subtilis", "Dust with sulfur in early infection stages"],
        "chemical_treatments": ["Apply Azoxystrobin, Pyraclostrobin, or Propiconazole fungicides"],
        "prevention": ["Plant resistant maize hybrids", "Avoid late planting to escape peak spore dispersal"]
    },
    "Potato___Late_Blight": {
        "severity": "Severe",
        "description": "Devastating disease caused by Phytophthora infestans that destroys foliage and tubers quickly in cool, wet weather.",
        "symptoms": ["Water-soaked dark lesions on leaf tips", "White mildew fuzz on leaf underside during high humidity", "Tuber rot with reddish-brown dry rot inside"],
        "organic_remedies": ["Copper-based fungicides applied preventatively", "Remove infected plants immediately to prevent field spread"],
        "chemical_treatments": ["Apply Chlorothalonil, Mancozeb, Ridomil Gold (Mefenoxam), or Cymoxanil"],
        "prevention": ["Use certified disease-free seed tubers", "Ensure adequate soil hilling and good canopy ventilation"]
    },
    "Tomato___Bacterial_Spot": {
        "severity": "High",
        "description": "Bacterial infection caused by Xanthomonas species causing dark spots on leaves, stems, and fruits.",
        "symptoms": ["Small dark water-soaked spots on leaves", "Yellow halo surrounding spots", "Raised scab-like spots on tomato fruits", "Defoliation in severe cases"],
        "organic_remedies": ["Copper octanoate or liquid copper fungicide mixed with Mancozeb", "Prune lower foliage touching the soil"],
        "chemical_treatments": ["Copper hydroxide + Mancozeb spray combination", "Streptomycin sulphate (where registered)"],
        "prevention": ["Avoid overhead irrigation", "Use clean certified seeds and rotate crops for 2-3 years"]
    },
    "Tomato___Early_Blight": {
        "severity": "Moderate",
        "description": "Fungal infection by Alternaria solani causing target-board pattern spots on older leaves.",
        "symptoms": ["Concentric dark rings (target shape) on leaves", "Yellowing around leaf spots", "Sunken dark stem lesions", "Fruit drop near stem attachment"],
        "organic_remedies": ["Compost tea sprays", "Mulch around base to prevent soil splash", "Bio-fungicides like Trichoderma viride"],
        "chemical_treatments": ["Chlorothalonil, Difenoconazole, or Azoxystrobin applications"],
        "prevention": ["Stake tomato plants", "Practice 3-year crop rotation with non-solanaceous crops"]
    }
}


def get_disease_details(raw_class_name):
    """
    Returns complete detailed dictionary for any given raw class name.
    """
    crop_name, disease_name, is_healthy = parse_class_name(raw_class_name)
    
    if is_healthy:
        return {
            "class_name": raw_class_name,
            "crop": crop_name,
            "disease": "Healthy Plant",
            "is_healthy": True,
            "severity": "None",
            "status_color": "emerald",
            "description": f"The plant foliage for {crop_name} appears healthy with no visible signs of pathogen infection, pest damage, or nutrient stress.",
            "symptoms": ["Vibrant green foliage", "No discoloration, spots, or rust", "Healthy stem and leaf structure"],
            "organic_remedies": ["Maintain regular watering and balanced organic fertilization", "Monitor regularly for early pest activity"],
            "chemical_treatments": ["No chemical treatment required"],
            "prevention": ["Practice optimal spacing, soil health management, and crop rotation"]
        }

    # Search in specific knowledge base
    if raw_class_name in DISEASE_KNOWLEDGE_BASE:
        kb = DISEASE_KNOWLEDGE_BASE[raw_class_name]
        return {
            "class_name": raw_class_name,
            "crop": crop_name,
            "disease": disease_name,
            "is_healthy": False,
            "severity": kb["severity"],
            "status_color": "amber" if kb["severity"] in ["Low", "Moderate"] else "rose",
            "description": kb["description"],
            "symptoms": kb["symptoms"],
            "organic_remedies": kb["organic_remedies"],
            "chemical_treatments": kb["chemical_treatments"],
            "prevention": kb["prevention"]
        }

    # Dynamic fallback generator for any of the 107 classes not specifically hardcoded
    disease_type = "Fungal / Bacterial / Insect Infestation"
    if "virus" in disease_name.lower() or "mosaic" in disease_name.lower():
        disease_type = "Viral Disease"
        severity = "High"
        organic = ["Remove and destroy infected plants", "Control vector insects (aphids, whiteflies) with neem oil soap spray"]
        chemical = ["Target vector insects using systemic insecticides (Imidacloprid or Acetamiprid)", "No direct chemical cure for plant viruses"]
    elif "rot" in disease_name.lower() or "blight" in disease_name.lower() or "spot" in disease_name.lower() or "rust" in disease_name.lower() or "mildew" in disease_name.lower() or "scab" in disease_name.lower() or "anthracnose" in disease_name.lower():
        disease_type = "Fungal / Bacterial Disease"
        severity = "Moderate" if "spot" in disease_name.lower() else "High"
        organic = ["Apply copper hydroxide or sulfur-based bio-fungicide", "Prune affected leaves and increase spacing for ventilation", "Soil mulching to prevent splash infection"]
        chemical = ["Apply broad-spectrum systemic fungicide like Difenoconazole, Mancozeb, or Azoxystrobin", "Follow recommended spray schedule at early outbreak signs"]
    else:
        disease_type = "Pest / Insect Infestation"
        severity = "Moderate"
        organic = ["Apply Neem oil spray (1500 ppm) or insecticidal soap solution", "Introduce beneficial natural predators like ladybugs or lacewings", "Use yellow sticky traps"]
        chemical = ["Apply selective insecticides such as Emamectin benzoate, Chlorantraniliprole, or Spinosad"]

    return {
        "class_name": raw_class_name,
        "crop": crop_name,
        "disease": disease_name,
        "is_healthy": False,
        "severity": severity,
        "status_color": "amber" if severity == "Moderate" else "rose",
        "description": f"Targeted diagnosis identified {disease_name} affecting {crop_name}. Category: {disease_type}.",
        "symptoms": [
            f"Distinct foliage discoloration and spots characteristic of {disease_name}",
            f"Targeted leaf damage on {crop_name} tissue",
            "Reduced photosynthesis efficiency and potential leaf drop"
        ],
        "organic_remedies": organic,
        "chemical_treatments": chemical,
        "prevention": [
            "Use certified disease-resistant seeds/varieties",
            "Avoid foliage wetness during late evening irrigation",
            "Implement crop rotation every season"
        ]
    }
