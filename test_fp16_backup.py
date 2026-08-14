import onnxruntime as ort
import numpy as np
from PIL import Image

MODEL_PATH = "Model/model_repVit_fp16.onnx"
IMAGE_PATH = "/Users/mymac/Downloads/TilikMata-Gemastik/public/assets/Advanced.jpg"

IMG_SIZE = 384

IMAGENET_MEAN = np.array(
    [0.485, 0.456, 0.406],
    dtype=np.float32
)

IMAGENET_STD = np.array(
    [0.229, 0.224, 0.225],
    dtype=np.float32
)

# =========================
# LOAD MODEL
# =========================

session = ort.InferenceSession(
    MODEL_PATH,
    providers=["CPUExecutionProvider"]
)

# =========================
# LOAD IMAGE
# =========================

image = Image.open(IMAGE_PATH).convert("RGB")
image = image.resize((IMG_SIZE, IMG_SIZE))

image = np.array(image).astype(np.float32) / 255.0

# ImageNet normalization
image = (image - IMAGENET_MEAN) / IMAGENET_STD

# HWC -> CHW
image = np.transpose(image, (2, 0, 1))

# Add batch dimension
image = np.expand_dims(image, axis=0)

# FP16
image = image.astype(np.float16)

print("Input shape:", image.shape)
print("Input dtype:", image.dtype)

# =========================
# INFERENCE
# =========================

output = session.run(
    ["output"],
    {"input": image}
)[0]

print("\nRaw output:")
print(output)

print("\nOutput shape:")
print(output.shape)

print("\nOutput dtype:")
print(output.dtype)

# =========================
# SOFTMAX
# =========================

exp_output = np.exp(
    output - np.max(output, axis=1, keepdims=True)
)

probabilities = (
    exp_output /
    np.sum(exp_output, axis=1, keepdims=True)
)

print("\nProbabilities:")
print(probabilities)

# =========================
# PREDICTION
# =========================

predicted_class = int(
    np.argmax(probabilities, axis=1)[0]
)

confidence = float(
    probabilities[0][predicted_class]
)

print("\nPredicted class:", predicted_class)
print("Confidence:", confidence)
print("Confidence (%):", confidence * 100)