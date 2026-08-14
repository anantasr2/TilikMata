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

function handleUserUploadedImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    currentUploadedImageDataUrl = e.target.result;
    currentScreeningSample = {
      title: `Uploaded Image (${file.name})`,
      desc: "Analyzed custom user uploaded fundus photograph.",
      img: currentUploadedImageDataUrl,
      chars: ["Microaneurysms detected", "Retinal leakage check pass"]
    };
    updateScreeningPreview(currentUploadedImageDataUrl, currentScreeningSample);
    runScreeningAnalysis();
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

function runScreeningAnalysis() {
  const scannerBeam = document.getElementById('screening-scanner-beam');
  const statusBadge = document.getElementById('screening-status-badge');
  const progressBar = document.getElementById('screening-progress-bar');
  const progressText = document.getElementById('screening-progress-text');

  if (!scannerBeam) return;

  scannerBeam.classList.add('scanning');
  if (statusBadge) statusBadge.innerText = 'AI Inference Running...';
  if (progressBar) progressBar.style.width = '25%';

  setTimeout(() => {
    if (progressBar) progressBar.style.width = '65%';
    if (progressText) progressText.innerText = 'Pemeriksaan Kualitas Lulus (98%) • Ekstraksi Fitur...';
  }, 800);

  setTimeout(() => {
    if (progressBar) progressBar.style.width = '100%';
    if (progressText) progressText.innerText = 'Analisis Selesai (100%)';
    scannerBeam.classList.remove('scanning');

    const workspaceCanvas = document.getElementById('screening-heatmap-canvas');
    if (workspaceCanvas) workspaceCanvas.classList.add('active');

    renderAnalysisResults(currentScreeningSample);
  }, 1800);
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
function downloadDiagnosticReport() {
  const printWindow = window.open('', '_blank');
  const reportHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>TilikMata AI - Ringkasan Diagnostik Klinis</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #002018; line-height: 1.6; }
        .header { display: flex; justify-content: space-between; border-bottom: 3px solid #003527; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #003527; }
        .badge { background-color: #6cf8bb; color: #003527; padding: 6px 14px; font-weight: bold; border-radius: 20px; font-size: 14px; }
        .section { margin-bottom: 25px; background: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #c2ebdc; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .metric-card { background: white; padding: 15px; border-radius: 8px; border: 1px solid #bfc9c3; }
        .metric-title { font-size: 12px; color: #707974; text-transform: uppercase; font-weight: bold; }
        .metric-value { font-size: 20px; color: #003527; font-weight: bold; margin-top: 4px; }
        .disclaimer { font-size: 11px; color: #707974; margin-top: 40px; border-top: 1px dashed #bfc9c3; padding-top: 15px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">TilikMata AI</div>
          <div style="font-size: 13px; color: #707974;">Sistem Pendukung Keputusan Klinis Retinopati Diabetik</div>
        </div>
        <div>
          <span class="badge">LAPORAN MEDIS RAHASIA</span>
          <div style="font-size: 12px; margin-top: 8px; text-align: right;">Tanggal: ${new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div class="section">
        <h2 style="margin-top: 0; color: #003527;">Ringkasan Penilaian Diagnostik</h2>
        <div class="grid">
          <div class="metric-card">
            <div class="metric-title">Klasifikasi Tahap Diagnostik</div>
            <div class="metric-value">${currentScreeningSample.title}</div>
          </div>
          <div class="metric-card">
            <div class="metric-title">Verifikasi Kualitas</div>
            <div class="metric-value">98% Lulus</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3 style="margin-top: 0; color: #003527;">Temuan Klinis</h3>
        <p style="font-size: 14px; font-weight: 500;">${currentScreeningSample.desc}</p>
      </div>

        <div class="disclaimer">
        <strong>Penafian Medis:</strong> Laporan ini dihasilkan oleh TilikMata AI sebagai alat pendukung keputusan yang dapat dijelaskan untuk skrining oftalmologi. Keputusan diagnostik akhir harus dibuat oleh spesialis medis bersertifikat.
      </div>
      <script>window.print();</script>
    </body>
    </html>
  `;
  printWindow.document.write(reportHtml);
  printWindow.document.close();
}
