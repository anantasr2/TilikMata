# TilikMata — LightRetina-XAI

> **Explainable AI for Early Diabetic Retinopathy Screening**

TilikMata adalah aplikasi berbasis **Artificial Intelligence** untuk membantu proses **skrining dini Retinopati Diabetik (DR)** melalui analisis citra fundus retina.

TilikMata mengintegrasikan model **RepViT**, **Image Quality Assessment**, dan **Grad-CAM Explainable AI** ke dalam aplikasi web sehingga hasil skrining tidak hanya memberikan klasifikasi, tetapi juga visualisasi area retina yang menjadi perhatian model.

> ⚠️ **TilikMata merupakan sistem skrining dan clinical decision support, bukan alat diagnosis medis. Hasil tetap memerlukan verifikasi oleh dokter atau tenaga kesehatan yang berwenang.**

---

## ✨ Features

* 🖼️ **Fundus Image Upload**
  Mengunggah citra fundus retina untuk proses skrining.

* 🔍 **Image Quality Assessment**
  Mengevaluasi kualitas citra berdasarkan aspek seperti ketajaman, pencahayaan, kontras, dan cakupan area fundus.

* 🧠 **Diabetic Retinopathy Classification**
  Mengklasifikasikan tingkat keparahan Retinopati Diabetik ke dalam 7 kelas:

  * Normal
  * Mild NPDR
  * Moderate NPDR
  * Severe NPDR
  * Very Severe NPDR
  * PDR
  * Advanced PDR

* 📊 **Confidence Score**
  Menampilkan tingkat keyakinan model terhadap hasil klasifikasi.

* 🔥 **Grad-CAM Explainability**
  Menampilkan visualisasi area retina yang berkontribusi terhadap prediksi model melalui:

  * Original Image
  * Heatmap
  * Overlay

* 📚 **Clinical Reference**
  Menyediakan referensi informasi terkait tingkat keparahan Retinopati Diabetik.

* 🩺 **Clinical Decision Support**
  Menyajikan severity, risk level, dan rekomendasi tindak lanjut sebagai informasi pendukung.

---

## 🔬 AI Pipeline

```text
Fundus Image
     │
     ▼
Image Quality Assessment
     │
     ▼
RepViT Classification
     │
     ├──────────────► Severity Classification
     │
     ├──────────────► Confidence Score
     │
     ▼
Grad-CAM Explainability
     │
     ▼
Clinical Decision Support
```

---

## 📈 Model Performance

TilikMata mengevaluasi beberapa kandidat arsitektur deep learning dan memilih **RepViT** sebagai model yang digunakan berdasarkan performa evaluasi penelitian.

| Metric       |            Result |
| ------------ | ----------------: |
| Accuracy     |        **83.33%** |
| Macro Recall |        **86.26%** |
| Dataset      | **14,532 images** |
| Classes      |             **7** |
| Model        |        **RepViT** |

Model menunjukkan performa yang baik secara keseluruhan, namun klasifikasi pada kelas **Mild–Moderate DR** masih menjadi tantangan karena kemiripan karakteristik visual antar kelas.

---

## ⚡ Model Optimization

Untuk mendukung deployment pada lingkungan web, model dioptimalkan menggunakan **Post-Training Quantization (PTQ)**.

| Configuration |  Model Size | Inference Time |
| ------------- | ----------: | -------------: |
| Original      |    18.45 MB |       48.80 ms |
| FP16          | **1.03 MB** |   **27.10 ms** |
| INT8          |     5.32 MB |       37.82 ms |

### FP16 Result

* **94.4%** model size reduction
* **44.5%** inference acceleration
* Model akhir dikonversi ke **ONNX** untuk deployment.

---

## 🧠 Explainable AI

TilikMata menggunakan **Grad-CAM (Gradient-weighted Class Activation Mapping)** untuk membantu memberikan interpretasi visual terhadap prediksi model.

Pengguna dapat melihat:

```text
Original Image
      │
      ├──► Heatmap
      │
      └──► Overlay
```

Visualisasi ini membantu menunjukkan area citra yang berkontribusi terhadap keputusan model.

---

## 🗂️ Dataset

Model dikembangkan menggunakan dataset citra fundus retina dengan total:

**14,532 images**

yang terbagi ke dalam **7 tingkat klasifikasi Retinopati Diabetik**.

Dataset digunakan untuk proses pengembangan dan evaluasi model dalam penelitian TilikMata.

---

## 🛠️ Tech Stack

### AI / Machine Learning

* Python
* PyTorch
* RepViT
* ONNX
* ONNX Runtime
* Grad-CAM

### Image Processing

* OpenCV
* NumPy
* PIL

### Web Application

* Flask
* HTML
* CSS
* JavaScript

### Deployment & Development

* Vercel
* Git
* GitHub

---

## 📁 Project Structure

Struktur project dapat disesuaikan dengan repository yang digunakan.

```text
TilikMata/
│
├── frontend/
│   ├── ...
│   └── ...
│
├── backend/
│   ├── ...
│   └── ...
│
├── model/
│   ├── ...
│   └── ...
│
├── README.md
└── ...
```

---

## 🚀 Running the Project

### 1. Clone Repository

```bash
git clone <repository-url>
cd TilikMata
```

### 2. Backend Setup

Masuk ke folder backend:

```bash
cd backend
```

Buat virtual environment:

```bash
python -m venv .venv
```

Aktifkan environment:

**macOS / Linux**

```bash
source .venv/bin/activate
```

**Windows**

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Jalankan backend:

```bash
python app.py
```

### 3. Frontend Setup

Masuk ke folder frontend dan install dependencies sesuai konfigurasi project:

```bash
cd frontend
npm install
npm run dev
```

> Sesuaikan perintah di atas dengan struktur dan konfigurasi repository yang digunakan.

---

## 🖥️ Application Preview

<!-- Tambahkan screenshot aplikasi di sini -->

```text
[ TilikMata Web Application ]
```

Contoh screenshot yang dapat ditampilkan:

* Homepage
* Upload Fundus Image
* Image Quality Assessment
* Screening Result
* Grad-CAM Visualization
* Clinical Decision Support

---

## 🔄 Screening Flow

Secara umum, pengguna dapat melakukan skrining melalui alur:

**Upload → Quality Assessment → AI Processing → Classification → Explainability → Decision Support**

Hasil yang diberikan sistem meliputi:

1. Kualitas citra
2. Klasifikasi tingkat keparahan
3. Confidence score
4. Visualisasi Grad-CAM
5. Informasi risk level
6. Rekomendasi tindak lanjut

---

## 📄 Research

TilikMata dikembangkan berdasarkan penelitian:

> **TILIKMATA: Skrining Dini Retinopati Diabetik Berbasis Kecerdasan Artifisial untuk Fasilitas Kesehatan Primer**

Fokus penelitian mencakup:

* Deep Learning untuk skrining Retinopati Diabetik
* RepViT
* Explainable AI menggunakan Grad-CAM
* Image Quality Assessment
* Model compression menggunakan PTQ
* Deployment model menggunakan ONNX
* Clinical Decision Support

---

## ⚠️ Limitations

Beberapa keterbatasan yang masih menjadi perhatian dalam pengembangan TilikMata:

* Klasifikasi **Mild–Moderate DR** masih memiliki tantangan karena kemiripan visual.
* Model masih memerlukan **external validation**.
* Diperlukan **field testing** bersama tenaga kesehatan.
* Evaluasi user acceptance diperlukan sebelum implementasi klinis dalam skala besar.

---

## 🔮 Future Development

Pengembangan selanjutnya mencakup:

* Quantization-Aware Training untuk INT8
* Fine-grained feature learning
* External validation
* Field testing dengan tenaga kesehatan
* User acceptance evaluation

---

## ⚠️ Medical Disclaimer

TilikMata dikembangkan sebagai **sistem skrining dini dan clinical decision support**, bukan sebagai pengganti diagnosis dokter.

Hasil prediksi AI tidak boleh digunakan sebagai satu-satunya dasar untuk menentukan diagnosis atau tindakan medis. Setiap hasil perlu dikonfirmasi dan diinterpretasikan oleh dokter atau tenaga kesehatan yang berwenang.

---

## 👨‍💻 Author

**Ananta Surya Pratama**

Informatics Engineering Student
Universitas Dian Nuswantoro (UDINUS)

---

<p align="center">
  <b>TilikMata — Making Retinal Screening More Explainable</b>
</p>
