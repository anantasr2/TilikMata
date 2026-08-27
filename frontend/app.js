/**
 * TilikMata AI - Clinical Decision Support Engine & Web Routing Logic
 * Router: Home, Screening, Knowledge
 * Includes 7 DR Stages Progression Flow, 4 FAQ Accordion Items, AI Screening Workspace, and PDF Reports.
 */

// Dataset for the 7 DR Stages of Progression (Knowledge Page Interactive Flow)
const STAGES_DATA = [
  {
    title: "Retina Normal",
    desc: "Retina sehat dengan distribusi pembuluh darah normal, margin cakram optik yang jelas, refleks fovea yang tajam, dan ketiadaan pendarahan atau kebocoran vaskular.",
    img: "assets/normal.jpg",
    chars: ["Dinding pembuluh utuh", "Makula jelas tanpa edema", "Margin cakram optik tegas"],
  },
  {
    title: "Ringan",
    desc: "Tahap klinis paling awal yang ditandai oleh mikroaneurisma—tonjolan kecil pada dinding kapiler retina, terutama di area makula temporal.",
    img: "assets/Mild.jpg",
    chars: ["Mikroaneurisma", "Pendarahan titik ringan", "Pelemahan dinding pembuluh"],
  },
  {
    title: "Sedang",
    desc: "Terjadi progresi ketika kapiler retina yang memberi nutrisi tersumbat. Banyak pendarahan titik dan eksudat keras lipid terbentuk di dekat makula.",
    img: "assets/Moderate.jpg",
    chars: ["Bintik kapas", "Terbentuk eksudat keras", "Mulai pembentukan venous beading"],
  },
  {
    title: "Berat",
    desc: "Terjadi non-perfusi kapiler retina yang luas, memicu sinyal iskemik. Memenuhi kriteria 4-2-1 dengan >20 pendarahan intraretinal di keempat kuadran.",
    img: "assets/Severe.jpg",
    chars: ["Pendarahan luas 4-kuadran", "Venous beading yang nyata", "Abnormalitas mikrovascular intraretinal (IRMA)"],
  },
  {
    title: "Sangat Berat",
    desc: "Keadaan pra-proliferatif dengan risiko tinggi yang memenuhi 2 atau lebih kriteria aturan 4-2-1 tanpa neovaskularisasi jelas. Lebih dari 50% dapat berkembang menjadi PDR dalam 1 tahun.",
    img: "assets/Very Severe NPDR.jpg",
    chars: ["Pendarahan parah multi-kuadran", "Beberapa area IRMA", "Non-perfusi kapiler berat"],
  },
  {
    title: "Proliferatif",
    desc: "Tahap lanjut di mana iskemia berat memicu neovaskularisasi—pertumbuhan pembuluh baru rapuh di cakram optik atau retina yang mudah berdarah.",
    img: "assets/Proliferate.jpg",
    chars: ["Neovaskularisasi (NVD/NVE)", "Risiko pendarahan vitreus", "Penumpukan darah preretinal"],
  },
  {
    title: "Proliferatif Lanjutan",
    desc: "Tahap yang mengancam penglihatan ditandai oleh pertumbuhan membran fibrovascular padat, traksi vitreus, ablasio retina traksional, dan glaukoma neovaskular.",
    img: "assets/Advanced.jpg",
    chars: ["Membran fibrovascular traksional", "Risiko detasemen retina", "Opasitas vitreus padat"],
  }
];

let currentScreeningSample = STAGES_DATA[1];
let currentUploadedImageDataUrl = 'assets/fundus_hero.jpg';

document.addEventListener('DOMContentLoaded', () => {
  initViewRouter();
  initHeroInteractiveCard();
  initScreeningWorkspace();
  initScrollAnimations();
  initKnowledgeStages();
  initFAQAccordion();
});

/* ==========================================================================
   SPA View Router (Home, Screening, Knowledge)
   ========================================================================== */
function initViewRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();

  const mobileLinks = document.querySelectorAll('#mobile-drawer a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mobile-drawer').classList.add('hidden');
    });
  });

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      document.getElementById('mobile-drawer').classList.toggle('hidden');
    });
  }
}

function handleRoute() {
  const hash = window.location.hash || '#home';
  const route = hash.replace('#', '') || 'home';

  const pageViews = document.querySelectorAll('.page-view');
  pageViews.forEach(view => view.classList.remove('active'));

  const targetView = document.getElementById(`page-${route}`);
  if (targetView) {
    targetView.classList.add('active');
  } else {
    document.getElementById('page-home').classList.add('active');
  }

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${route}`) {
      link.classList.add('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(checkScrollAnimations, 100);
}

/* ==========================================================================
   Scroll Intersection Animations (.fade-in-up)
   ========================================================================== */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  window.scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  checkScrollAnimations();
}

function checkScrollAnimations() {
  document.querySelectorAll('.fade-in-up').forEach(el => {
    if (window.scrollObserver) {
      window.scrollObserver.observe(el);
    } else {
      el.classList.add('visible');
    }
  });
}

/* ==========================================================================
   Hero Section Interactive Card (Home Page)
   ========================================================================== */
function initHeroInteractiveCard() {
  const heroCanvas = document.getElementById('hero-heatmap-canvas');
  const toggleBtn = document.getElementById('hero-toggle-heatmap-btn');

  if (heroCanvas && toggleBtn) {
    renderHeatmapOnCanvas(heroCanvas, [
      { x: 0.35, y: 0.42, radius: 35, intensity: 0.85 },
      { x: 0.58, y: 0.51, radius: 30, intensity: 0.75 }
    ]);

    let heatmapActive = false;
    toggleBtn.addEventListener('click', () => {
      heatmapActive = !heatmapActive;
      if (heatmapActive) {
        heroCanvas.classList.add('active');
        toggleBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">visibility_off</span> Sembunyikan Heatmap XAI';
        toggleBtn.classList.add('bg-secondary', 'text-white');
      } else {
        heroCanvas.classList.remove('active');
        toggleBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">psychology</span> Tampilkan Heatmap XAI';
        toggleBtn.classList.remove('bg-secondary', 'text-white');
      }
    });
  }
}

/* ==========================================================================
   Interactive DR 7-Stages Progression Flow (Knowledge Page)
   ========================================================================== */
function initKnowledgeStages() {
  const stageBtns = document.querySelectorAll('.stage-btn');
  const stageImage = document.getElementById('stage-image');
  const stageContent = document.getElementById('stage-content');
  const stageTitle = document.getElementById('stage-title');
  const stageDesc = document.getElementById('stage-desc');
  const stageChars = document.getElementById('stage-chars');

  if (!stageBtns.length || !stageImage) return;

  stageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      stageBtns.forEach(b => {
        b.classList.remove('border-white', 'text-white', 'active');
        b.classList.add('border-white/20', 'text-white/50');
      });
      
      const target = e.currentTarget;
      target.classList.remove('border-white/20', 'text-white/50');
      target.classList.add('border-white', 'text-white', 'active');

      const stageIdx = parseInt(target.getAttribute('data-stage'));
      const data = STAGES_DATA[stageIdx];

      if (!data) return;

      // Smooth transition out
      if (stageContent) stageContent.style.opacity = '0';
      stageImage.style.transform = 'scale(0.98)';
      stageImage.style.opacity = '0.7';

      setTimeout(() => {
        // Update content
        stageImage.src = data.img;
        if (stageTitle) stageTitle.textContent = data.title;
        if (stageDesc) stageDesc.textContent = data.desc;
        
        if (stageChars) {
          stageChars.innerHTML = data.chars.map(c => 
            `<span class="px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs md:text-sm font-label-md">${c}</span>`
          ).join('');
        }

        // Smooth transition in
        stageImage.style.transform = 'scale(1)';
        stageImage.style.opacity = '1';
        if (stageContent) stageContent.style.opacity = '1';
      }, 400);
    });
  });
}

/* ==========================================================================
   FAQ Accordion (4 Items) - Knowledge Page
   ========================================================================== */
function initFAQAccordion() {
  const accordions = document.querySelectorAll('.accordion-btn');
  accordions.forEach(acc => {
    acc.addEventListener('click', () => {
      const expanded = acc.getAttribute('aria-expanded') === 'true';
      acc.setAttribute('aria-expanded', !expanded);
      const content = acc.nextElementSibling;
      if (content) {
        content.setAttribute('aria-hidden', expanded);
      }
      
      const icon = acc.querySelector('.accordion-icon');
      if (icon) {
        if (!expanded) {
          icon.textContent = 'remove';
          icon.style.transform = 'rotate(180deg)';
        } else {
          icon.textContent = 'add';
          icon.style.transform = 'rotate(0deg)';
        }
      }
    });
  });
}

/* ==========================================================================
   Dedicated AI Screening Workspace (Screening Page)
   ========================================================================== */
function initScreeningWorkspace() {
  const sampleBtns = document.querySelectorAll('.screening-sample-btn');
  const dropzone = document.getElementById('screening-dropzone');
  const fileInput = document.getElementById('screening-file-input');
  const analyzeBtn = document.getElementById('run-analysis-btn');

  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sampleBtns.forEach(b => b.classList.remove('border-primary', 'bg-primary/10', 'font-bold'));
      btn.classList.add('border-primary', 'bg-primary/10', 'font-bold');

      const sampleIdx = parseInt(btn.dataset.sampleIdx || 0);
      if (STAGES_DATA[sampleIdx]) {
        currentScreeningSample = STAGES_DATA[sampleIdx];
        updateScreeningPreview('assets/fundus_hero.jpg', currentScreeningSample);
      }
    });
  });

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleUserUploadedImage(e.dataTransfer.files[0]);
      }
    });
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleUserUploadedImage(e.target.files[0]);
      }
    });
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', runScreeningAnalysis);
  }

  const opacitySlider = document.getElementById('screening-heatmap-opacity');
  if (opacitySlider) {
    opacitySlider.addEventListener('input', (e) => {
      const workspaceCanvas = document.getElementById('screening-heatmap-canvas');
      const valText = document.getElementById('screening-opacity-val');
      if (workspaceCanvas) workspaceCanvas.style.opacity = e.target.value / 100;
      if (valText) valText.innerText = `${e.target.value}%`;
    });
  }
}


let currentUploadedFile = null;
let currentAIResult = null;

function handleUserUploadedImage(file) {
  currentUploadedFile = file;

  const reader = new FileReader();

  reader.onload = (e) => {
    currentUploadedImageDataUrl = e.target.result;

    currentScreeningSample = {
      title: `Uploaded Image (${file.name})`,
      desc: "Gambar fundus berhasil diunggah.",
      img: currentUploadedImageDataUrl,
      chars: []
    };

    updateScreeningPreview(
      currentUploadedImageDataUrl,
      currentScreeningSample
    );
  };

  reader.readAsDataURL(file);
}

function updateScreeningPreview(imgSrc, sampleData) {
  const previewImg = document.getElementById('screening-fundus-img');
  const workspaceCanvas = document.getElementById('screening-heatmap-canvas');

  if (previewImg) previewImg.src = imgSrc;
  if (workspaceCanvas) {
    renderHeatmapOnCanvas(workspaceCanvas, [
      { x: 0.42, y: 0.48, radius: 35, intensity: 0.85 },
      { x: 0.60, y: 0.55, radius: 30, intensity: 0.75 }
    ]);
  }
}

async function runScreeningAnalysis() {
  const scannerBeam = document.getElementById('screening-scanner-beam');
  const statusBadge = document.getElementById('screening-status-badge');
  const progressBar = document.getElementById('screening-progress-bar');
  const progressText = document.getElementById('screening-progress-text');

  if (!currentUploadedFile) {
    alert('Silakan upload gambar fundus terlebih dahulu.');
    return;
  }

  try {
    scannerBeam?.classList.add('scanning');

    if (statusBadge) {
      statusBadge.innerText = 'AI Inference Running...';
    }

    if (progressBar) {
      progressBar.style.width = '25%';
    }

    if (progressText) {
      progressText.innerText = 'Mengirim gambar ke AI...';
    }

    const formData = new FormData();
    formData.append('file', currentUploadedFile);

    const response = await fetch('/api/predict', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Prediction gagal.');
    }

    if (progressBar) {
      progressBar.style.width = '100%';
    }

    if (progressText) {
      progressText.innerText =
        `Analisis selesai • ${result.inference_time}`;
    }

    renderAIResults(result);

  } catch (error) {
    console.error(error);

    alert(
      'Koneksi atau proses AI gagal:\n' +
      error.message
    );

  } finally {
    scannerBeam?.classList.remove('scanning');
  }
}

function renderAnalysisResults(sample) {
  const gradeElem = document.getElementById('res-dr-grade');
  const visualElem = document.getElementById('res-visual-features');
  const recElem = document.getElementById('res-recommendation');

  if (gradeElem) gradeElem.innerText = sample.title;
  if (visualElem) visualElem.innerText = sample.desc;
  if (recElem) recElem.innerText = "Jadwalkan pemeriksaan tindak lanjut dengan spesialis mata berdasarkan temuan klinis.";
}

/* ==========================================================================
   Grad-CAM Heatmap Canvas Renderer
   ========================================================================== */
function renderHeatmapOnCanvas(canvas, heatspots) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = (canvas.width = canvas.offsetWidth || 500);
  const height = (canvas.height = canvas.offsetHeight || 500);

  ctx.clearRect(0, 0, width, height);
  if (!heatspots || heatspots.length === 0) return;

  heatspots.forEach(spot => {
    const cx = spot.x * width;
    const cy = spot.y * height;
    const radius = spot.radius * (width / 400);

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, `rgba(239, 68, 68, ${spot.intensity})`);
    gradient.addColorStop(0.4, `rgba(245, 158, 11, ${spot.intensity * 0.7})`);
    gradient.addColorStop(0.8, `rgba(16, 185, 129, ${spot.intensity * 0.3})`);
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 2);
    ctx.stroke();
  });
}

/* ==========================================================================
   Downloadable Diagnostic Summary PDF Report Generator
   ========================================================================== */
/* ==========================================================================
   Download Diagnostic Report - FULL AI RESULT
   Semua data diambil dari currentAIResult hasil API /api/predict
   ========================================================================== */
function downloadDiagnosticReport() {

  // Pastikan sudah ada hasil AI
  if (!currentAIResult) {
    alert('Silakan lakukan analisis AI terlebih dahulu sebelum mengunduh laporan.');
    return;
  }

  const result = currentAIResult;

  // ---------------------------------------------------------
  // Helper
  // ---------------------------------------------------------
  const escapeHtml = (value) => {
    if (value === null || value === undefined) return '-';

    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const formatProbability = (value) => {
    if (value === null || value === undefined) return '-';
    return `${(Number(value) * 100).toFixed(1)}%`;
  };

  // ---------------------------------------------------------
  // Data utama AI
  // ---------------------------------------------------------
  const predictedClass =
    result.predicted_class_name || '-';

  const shortName =
    result.short_name || '-';

  const severity =
    result.severity || '-';

  const riskLevel =
    result.risk_level || '-';

  const confidence =
    result.confidence || '-';

  const inferenceTime =
    result.inference_time || '-';

  const clinicalDesc =
    result.clinical_desc || '-';

  const recommendation =
    result.recommendation || '-';

  const screeningSchedule =
    result.screening_schedule || '-';

  const followUp =
    result.follow_up || '-';

  const tags =
    Array.isArray(result.tags)
      ? result.tags
      : [];

  // ---------------------------------------------------------
  // Image Quality Assessment
  // ---------------------------------------------------------
  const quality = result.quality || {};

  const qualityScore =
    quality.score !== undefined
      ? `${quality.score}%`
      : '-';

  const focusScore =
    quality.focus?.score !== undefined
      ? `${quality.focus.score}%`
      : '-';

  const brightnessScore =
    quality.brightness?.score !== undefined
      ? `${quality.brightness.score}%`
      : '-';

  const contrastScore =
    quality.contrast?.score !== undefined
      ? `${quality.contrast.score}%`
      : '-';

  const fovScore =
    quality.fov?.score !== undefined
      ? `${quality.fov.score}%`
      : '-';

  const qualityStatus =
    quality.pass
      ? 'LULUS'
      : 'TIDAK LULUS';

  // ---------------------------------------------------------
  // Probabilities
  // ---------------------------------------------------------
  const probabilities =
    Array.isArray(result.probabilities)
      ? result.probabilities
      : [];

  const probabilityNames = [
    'Proliferatif Lanjutan',
    'Ringan',
    'Sedang',
    'Retina Normal',
    'Proliferatif',
    'Berat',
    'Sangat Berat'
  ];

  let probabilityRows = '';

  probabilityNames.forEach((name, index) => {

    const probability =
      probabilities[index] !== undefined
        ? formatProbability(probabilities[index])
        : '-';

    const isPrediction =
      index === result.predicted_class_idx;

    probabilityRows += `
      <tr ${isPrediction ? 'class="predicted-row"' : ''}>
        <td>${escapeHtml(name)}</td>
        <td>
          <strong>${probability}</strong>
          ${isPrediction ? '<span class="prediction-badge">PREDIKSI</span>' : ''}
        </td>
      </tr>
    `;
  });

  // ---------------------------------------------------------
  // Tags / clinical findings
  // ---------------------------------------------------------
  const tagsHtml =
    tags.length > 0
      ? tags.map(tag => `
          <span class="tag">
            ${escapeHtml(tag)}
          </span>
        `).join('')
      : '<span>-</span>';

  // ---------------------------------------------------------
  // Images
  // ---------------------------------------------------------
  const originalImage =
    result.images?.original || '';

  const heatmapImage =
    result.images?.heatmap || '';

  const overlayImage =
    result.images?.overlay || '';

  // ---------------------------------------------------------
  // Open print window
  // ---------------------------------------------------------
  const printWindow = window.open('', '_blank');

  if (!printWindow) {
    alert(
      'Popup diblokir browser. Silakan izinkan popup untuk TilikMata.'
    );
    return;
  }

  const reportHtml = `
<!DOCTYPE html>
<html lang="id">

<head>

  <meta charset="UTF-8">

  <title>
    TilikMata AI - Laporan Skrining
  </title>

  <style>

    * {
      box-sizing: border-box;
    }

    body {
      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Helvetica,
        Arial,
        sans-serif;

      padding: 35px;
      color: #002018;
      line-height: 1.5;
      background: white;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      border-bottom: 3px solid #003527;

      padding-bottom: 20px;
      margin-bottom: 25px;
    }

    .logo {
      font-size: 28px;
      font-weight: 800;
      color: #003527;
    }

    .subtitle {
      font-size: 13px;
      color: #707974;
      margin-top: 4px;
    }

    .badge {
      display: inline-block;

      background: #dcfce7;
      color: #166534;

      padding: 6px 12px;

      font-size: 12px;
      font-weight: 700;

      border-radius: 20px;
    }

    .date {
      font-size: 12px;
      color: #707974;
      margin-top: 8px;
      text-align: right;
    }

    .section {
      margin-bottom: 22px;

      background: #f0fdf4;

      padding: 20px;

      border-radius: 12px;

      border: 1px solid #c2ebdc;
    }

    .section h2 {
      margin-top: 0;
      margin-bottom: 15px;

      color: #003527;

      font-size: 19px;
    }

    .section h3 {
      margin-top: 0;

      color: #003527;

      font-size: 16px;
    }

    .grid {
      display: grid;

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

      gap: 14px;
    }

    .grid-4 {
      display: grid;

      grid-template-columns:
        repeat(4, minmax(0, 1fr));

      gap: 12px;
    }

    .metric-card {
      background: white;

      padding: 14px;

      border-radius: 9px;

      border: 1px solid #d1d5db;
    }

    .metric-title {
      font-size: 11px;

      color: #707974;

      text-transform: uppercase;

      font-weight: 700;

      letter-spacing: 0.4px;
    }

    .metric-value {
      font-size: 20px;

      color: #003527;

      font-weight: 800;

      margin-top: 5px;
    }

    .metric-value.small {
      font-size: 16px;
    }

    .severity {
      display: inline-block;

      padding: 7px 12px;

      border-radius: 20px;

      background: ${escapeHtml(result.risk_bg || '#f0fdf4')};

      border: 1px solid ${escapeHtml(result.risk_bdr || '#bbf7d0')};

      color: ${escapeHtml(result.risk_color || '#166534')};

      font-weight: 800;
    }

    .clinical-text {
      font-size: 14px;
      margin: 0;
    }

    .recommendation {
      background: white;

      border-left: 5px solid #15803d;

      padding: 14px;

      border-radius: 8px;

      font-size: 14px;
    }

    .tags {
      display: flex;

      flex-wrap: wrap;

      gap: 8px;

      margin-top: 10px;
    }

    .tag {
      display: inline-block;

      padding: 6px 10px;

      background: white;

      border: 1px solid #c2ebdc;

      border-radius: 20px;

      font-size: 12px;
    }

    .image-grid {
      display: grid;

      grid-template-columns:
        repeat(3, minmax(0, 1fr));

      gap: 15px;

      margin-top: 15px;
    }

    .image-card {
      background: white;

      border-radius: 10px;

      border: 1px solid #d1d5db;

      padding: 8px;

      text-align: center;
    }

    .image-card img {
      width: 100%;

      aspect-ratio: 1 / 1;

      object-fit: cover;

      border-radius: 7px;

      display: block;
    }

    .image-label {
      font-size: 12px;

      font-weight: 700;

      margin-top: 8px;

      color: #003527;
    }

    table {
      width: 100%;

      border-collapse: collapse;

      background: white;

      border-radius: 8px;

      overflow: hidden;
    }

    th {
      background: #003527;

      color: white;

      text-align: left;

      padding: 10px;

      font-size: 12px;
    }

    td {
      padding: 9px 10px;

      border-bottom: 1px solid #e5e7eb;

      font-size: 13px;
    }

    .predicted-row {
      background: #dcfce7;

      font-weight: 700;
    }

    .prediction-badge {
      display: inline-block;

      margin-left: 7px;

      padding: 3px 7px;

      border-radius: 10px;

      background: #15803d;

      color: white;

      font-size: 9px;

      font-weight: 700;
    }

    .status-pass {
      color: #15803d;

      font-weight: 800;
    }

    .status-fail {
      color: #dc2626;

      font-weight: 800;
    }

    .disclaimer {
      font-size: 10px;

      color: #707974;

      margin-top: 30px;

      border-top: 1px dashed #bfc9c3;

      padding-top: 15px;
    }

    .footer {
      margin-top: 20px;

      text-align: center;

      font-size: 10px;

      color: #9ca3af;
    }

    @media print {

      body {
        padding: 20px;
      }

      .section {
        break-inside: avoid;
      }

      .image-grid {
        break-inside: avoid;
      }

    }

  </style>

</head>

<body>

  <!-- =====================================================
       HEADER
       ===================================================== -->

  <div class="header">

    <div>

      <div class="logo">
        TilikMata AI
      </div>

      <div class="subtitle">
        Sistem Pendukung Keputusan Klinis
        Retinopati Diabetik
      </div>

    </div>

    <div>

      <span class="badge">
        LAPORAN SKRINING
      </span>

      <div class="date">
        Tanggal:
        ${new Date().toLocaleDateString('id-ID')}
      </div>

    </div>

  </div>


  <!-- =====================================================
       AI SUMMARY
       ===================================================== -->

  <div class="section">

    <h2>
      Ringkasan Hasil AI
    </h2>

    <div class="grid">

      <div class="metric-card">

        <div class="metric-title">
          Klasifikasi
        </div>

        <div class="metric-value">
          ${escapeHtml(predictedClass)}
        </div>

      </div>


      <div class="metric-card">

        <div class="metric-title">
          Nama Singkat
        </div>

        <div class="metric-value">
          ${escapeHtml(shortName)}
        </div>

      </div>


      <div class="metric-card">

        <div class="metric-title">
          Severity
        </div>

        <div class="metric-value">

          <span class="severity">
            ${escapeHtml(severity)}
          </span>

        </div>

      </div>


      <div class="metric-card">

        <div class="metric-title">
          Risk Level
        </div>

        <div class="metric-value">
          ${escapeHtml(riskLevel)}
        </div>

      </div>


      <div class="metric-card">

        <div class="metric-title">
          Confidence
        </div>

        <div class="metric-value">
          ${escapeHtml(confidence)}
        </div>

      </div>


      <div class="metric-card">

        <div class="metric-title">
          Inference Time
        </div>

        <div class="metric-value">
          ${escapeHtml(inferenceTime)}
        </div>

      </div>

    </div>

  </div>


  <!-- =====================================================
       IMAGE QUALITY ASSESSMENT
       ===================================================== -->

  <div class="section">

    <h2>
      Image Quality Assessment
    </h2>

    <div class="grid-4">

      <div class="metric-card">

        <div class="metric-title">
          Overall Quality
        </div>

        <div class="metric-value">
          ${escapeHtml(qualityScore)}
        </div>

      </div>


      <div class="metric-card">

        <div class="metric-title">
          Focus
        </div>

        <div class="metric-value small">
          ${escapeHtml(focusScore)}
        </div>

      </div>


      <div class="metric-card">

        <div class="metric-title">
          Brightness
        </div>

        <div class="metric-value small">
          ${escapeHtml(brightnessScore)}
        </div>

      </div>


      <div class="metric-card">

        <div class="metric-title">
          Contrast
        </div>

        <div class="metric-value small">
          ${escapeHtml(contrastScore)}
        </div>

      </div>

    </div>


    <div style="margin-top: 14px;">

      <strong>
        Field of View:
      </strong>

      ${escapeHtml(fovScore)}

      &nbsp; | &nbsp;

      <strong>
        Status:
      </strong>

      <span class="${quality.pass ? 'status-pass' : 'status-fail'}">

        ${qualityStatus}

      </span>

    </div>

  </div>


  <!-- =====================================================
       FUNDUS + GRAD CAM
       ===================================================== -->

  <div class="section">

    <h2>
      AI Attention Analysis
    </h2>

    <div class="image-grid">

      ${
        originalImage
          ? `
            <div class="image-card">

              <img
                src="${originalImage}"
                alt="Fundus Original"
              >

              <div class="image-label">
                Fundus Image
              </div>

            </div>
          `
          : ''
      }


      ${
        heatmapImage
          ? `
            <div class="image-card">

              <img
                src="${heatmapImage}"
                alt="Grad-CAM Heatmap"
              >

              <div class="image-label">
                Grad-CAM Heatmap
              </div>

            </div>
          `
          : ''
      }


      ${
        overlayImage
          ? `
            <div class="image-card">

              <img
                src="${overlayImage}"
                alt="Grad-CAM Overlay"
              >

              <div class="image-label">
                Grad-CAM Overlay
              </div>

            </div>
          `
          : ''
      }

    </div>

  </div>


  <!-- =====================================================
       CLINICAL FINDINGS
       ===================================================== -->

  <div class="section">

    <h2>
      Temuan Klinis
    </h2>

    <p class="clinical-text">

      ${escapeHtml(clinicalDesc)}

    </p>


    <h3 style="margin-top: 18px;">
      Indikator Klinis
    </h3>

    <div class="tags">

      ${tagsHtml}

    </div>

  </div>


  <!-- =====================================================
       PROBABILITY DISTRIBUTION
       ===================================================== -->

  <div class="section">

    <h2>
      Distribusi Probabilitas 7 Kelas
    </h2>

    <table>

      <thead>

        <tr>

          <th>
            Kelas Retinopati Diabetik
          </th>

          <th>
            Probabilitas
          </th>

        </tr>

      </thead>

      <tbody>

        ${probabilityRows}

      </tbody>

    </table>

  </div>


  <!-- =====================================================
       RECOMMENDATION
       ===================================================== -->

  <div class="section">

    <h2>
      Clinical Decision Support
    </h2>

    <div class="recommendation">

      <strong>
        Rekomendasi:
      </strong>

      ${escapeHtml(recommendation)}

    </div>


    <div style="margin-top: 15px;">

      <strong>
        Jadwal Skrining / Rujukan:
      </strong>

      ${escapeHtml(screeningSchedule)}

    </div>


    <div style="margin-top: 10px;">

      <strong>
        Follow-up:
      </strong>

      ${escapeHtml(followUp)}

    </div>

  </div>


  <!-- =====================================================
       DISCLAIMER
       ===================================================== -->

  <div class="disclaimer">

    <strong>
      Penafian Medis:
    </strong>

    Laporan ini dihasilkan oleh TilikMata AI sebagai
    alat pendukung keputusan untuk skrining retinopati
    diabetik. Hasil AI bukan diagnosis definitif dan
    tidak menggantikan pemeriksaan serta keputusan
    klinis oleh dokter spesialis mata atau tenaga
    kesehatan yang berwenang.

  </div>


  <div class="footer">

    TilikMata AI • AI-Assisted Diabetic Retinopathy Screening

  </div>


  <script>

    // Beri waktu gambar Base64 dimuat sebelum print
    window.onload = function() {

      setTimeout(function() {
        window.print();
      }, 700);

    };

  </script>

</body>

</html>
  `;

  printWindow.document.write(reportHtml);
  printWindow.document.close();
}

// PERBAIKANNNNN
function renderAIResults(result) {
  currentAIResult = result;

  const gradeElem =
    document.getElementById('res-dr-grade');

  const visualElem =
    document.getElementById('res-visual-features');

  const recElem =
    document.getElementById('res-recommendation');

  if (gradeElem) {
    gradeElem.innerText = result.predicted_class_name;
  }

  if (visualElem) {
    visualElem.innerText = result.clinical_desc;
  }

  if (recElem) {
    recElem.innerText = result.recommendation;
  }

  // Update fundus image
  const previewImg =
    document.getElementById('screening-fundus-img');

  if (previewImg && result.images?.original) {
    previewImg.src = result.images.original;
  }

  // Update heatmap
  const heatmapCanvas =
    document.getElementById('screening-heatmap-canvas');

  if (heatmapCanvas && result.images?.overlay) {
    heatmapCanvas.style.backgroundImage =
      `url("${result.images.overlay}")`;

    heatmapCanvas.style.backgroundSize = 'cover';
    heatmapCanvas.style.backgroundPosition = 'center';
  }

  // Quality
  const qualityScore = result.quality?.score;

  const qualityElem =
    document.getElementById('res-quality-score');

  if (qualityElem && qualityScore !== undefined) {
    qualityElem.innerText = `${qualityScore}%`;
  }

  console.log('AI RESULT:', result);
}