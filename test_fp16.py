import cv2
import numpy as np
import onnxruntime as ort
from PIL import Image
from torchvision import transforms


# =========================================================
# CONFIG
# =========================================================

MODEL_PATH = "Model/model_repVit_fp16.onnx"
IMAGE_PATH = "/Users/mymac/Downloads/TilikMata-Gemastik/public/assets/Advanced.jpg"

IMG_SIZE = 384

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]


# =========================================================
# GREEN CHANNEL CLAHE ENHANCEMENT
# SAMA PERSIS DENGAN app.py
# =========================================================

def enhance_green_channel(img_rgb):
    r, g, b = cv2.split(img_rgb)

    clahe_strong = cv2.createCLAHE(
        clipLimit=3.5,
        tileGridSize=(8, 8)
    )

    clahe_mild = cv2.createCLAHE(
        clipLimit=1.5,
        tileGridSize=(8, 8)
    )

    g_enh = clahe_strong.apply(g)
    r_enh = clahe_mild.apply(r)
    b_enh = clahe_mild.apply(b)

    return cv2.merge((r_enh, g_enh, b_enh))


# =========================================================
# PREPROCESSING
# SAMA DENGAN app.py
# =========================================================

eval_transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=IMAGENET_MEAN,
        std=IMAGENET_STD
    ),
])


# =========================================================
# LOAD IMAGE
# =========================================================

print("=" * 60)
print("LOADING IMAGE")
print("=" * 60)

image = Image.open(IMAGE_PATH).convert("RGB")

print("Original image size:", image.size)


# =========================================================
# PIL -> NUMPY RGB
# =========================================================

img_rgb = np.array(image)

print("RGB shape:", img_rgb.shape)
print("RGB dtype:", img_rgb.dtype)


# =========================================================
# GREEN CHANNEL ENHANCEMENT
# =========================================================

enhanced_rgb = enhance_green_channel(img_rgb)

print("Enhanced shape:", enhanced_rgb.shape)
print("Enhanced dtype:", enhanced_rgb.dtype)


# =========================================================
# SAVE ENHANCED IMAGE
# OPTIONAL - UNTUK CEK VISUAL
# =========================================================

Image.fromarray(enhanced_rgb).save("test_enhanced.jpg")

print("Enhanced image saved: test_enhanced.jpg")


# =========================================================
# PREPROCESS
# =========================================================

pil_enhanced = Image.fromarray(enhanced_rgb)

tensor_img = eval_transform(pil_enhanced)

# Tambahkan batch dimension
tensor_img = tensor_img.unsqueeze(0)

print()
print("=" * 60)
print("PREPROCESSING")
print("=" * 60)

print("Tensor shape:", tensor_img.shape)
print("Tensor dtype:", tensor_img.dtype)

print(
    "Tensor min:",
    tensor_img.min().item()
)

print(
    "Tensor max:",
    tensor_img.max().item()
)


# =========================================================
# CONVERT TO FP16
# =========================================================

input_tensor = tensor_img.numpy().astype(np.float16)

print()
print("ONNX input shape:", input_tensor.shape)
print("ONNX input dtype:", input_tensor.dtype)


# =========================================================
# LOAD FP16 ONNX MODEL
# =========================================================

session = ort.InferenceSession(
    MODEL_PATH,
    providers=["CPUExecutionProvider"]
)

input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name

print()
print("=" * 60)
print("ONNX MODEL")
print("=" * 60)

print("Input name:", input_name)
print("Input shape:", session.get_inputs()[0].shape)
print("Input dtype:", session.get_inputs()[0].type)

print("Output name:", output_name)
print("Output shape:", session.get_outputs()[0].shape)
print("Output dtype:", session.get_outputs()[0].type)


# =========================================================
# INFERENCE
# =========================================================

outputs = session.run(
    [output_name],
    {
        input_name: input_tensor
    }
)

logits = outputs[0]


# =========================================================
# SOFTMAX
# =========================================================

def softmax(x):
    x = x - np.max(x, axis=1, keepdims=True)
    exp_x = np.exp(x)

    return exp_x / np.sum(
        exp_x,
        axis=1,
        keepdims=True
    )


probabilities = softmax(logits)


# =========================================================
# PREDICTION
# =========================================================

predicted_class = int(
    np.argmax(probabilities, axis=1)[0]
)

confidence = float(
    probabilities[0, predicted_class]
)


# =========================================================
# RESULT
# =========================================================

print()
print("=" * 60)
print("INFERENCE RESULT")
print("=" * 60)

print("Raw output:")
print(logits)

print()
print("Output shape:")
print(logits.shape)

print()
print("Output dtype:")
print(logits.dtype)

print()
print("Probabilities:")
print(probabilities)

print()
print("Probability sum:")
print(probabilities.sum())

print()
print("Predicted class:", predicted_class)

print(
    "Confidence:",
    confidence
)

print(
    "Confidence (%):",
    confidence * 100
)

print("=" * 60)