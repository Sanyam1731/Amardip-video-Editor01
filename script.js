/* ═══════════════════════════════════════════
   ALEX REEL — Video Editor Portfolio
   script.js  |  Theme Toggle + Work Links
   ═══════════════════════════════════════════ */

/* ─── CUSTOM CURSOR ─── */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx - 6 + 'px';
  cursor.style.top  = my - 6 + 'px';
});

(function animateRing() {
  rx += (mx - rx - 19) * 0.18;
  ry += (my - ry - 19) * 0.18;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll(
  'a, button, .portfolio-item, .service-card, .testimonial-card, .tool-card'
).forEach((el) => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('expand'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('expand'));
});


/* ─── DARK / LIGHT THEME TOGGLE ─── */
const html       = document.documentElement;
const themeBtn   = document.getElementById('themeToggle');
const themeIcon  = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

// Persist theme across reloads
const savedTheme = localStorage.getItem('arTheme') || 'dark';
applyTheme(savedTheme);

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('arTheme', next);
});

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  if (theme === 'light') {
    themeIcon.className  = 'fas fa-moon';   // clicking again returns to dark
    themeLabel.textContent = 'Dark';
  } else {
    themeIcon.className  = 'fas fa-sun';
    themeLabel.textContent = 'Light';
  }
}


/* ─── BACKGROUND AUDIO (MUSIC) ─── */
const audioToggle = document.getElementById('audioToggle');
const audioIcon   = document.getElementById('audioIcon');
const audioLabel  = document.getElementById('audioLabel');
const bgAudio     = document.getElementById('bgAudio');

// Default: try to play immediately. If user has manually disabled, respect that.
let audioEnabled = localStorage.getItem('arAudio') !== 'off';

function updateAudioUI(enabled) {
  audioIcon.className = enabled ? 'fas fa-volume-mute' : 'fas fa-volume-up';
  audioLabel.textContent = enabled ? 'Mute' : 'Play';
}

function tryPlayBackgroundAudio() {
  if (!bgAudio || !audioEnabled) return;
  bgAudio.volume = 0.35;
  bgAudio.muted  = false;
  const playPromise = bgAudio.play();
  if (playPromise && playPromise.catch) {
    playPromise.catch(() => {
      // Autoplay blocked; user must interact to enable sound.
    });
  }
}

function setAudioEnabled(enabled) {
  audioEnabled = enabled;
  localStorage.setItem('arAudio', enabled ? 'on' : 'off');
  updateAudioUI(enabled);
  if (enabled) tryPlayBackgroundAudio();
  else if (bgAudio) bgAudio.pause();
}

updateAudioUI(audioEnabled);

// Attempt to play on load (may be blocked by browser autoplay rules)
window.addEventListener('load', () => {
  if (audioEnabled) tryPlayBackgroundAudio();
});

// If autoplay is blocked, this user click will start playback
document.addEventListener('click', () => {
  if (audioEnabled) tryPlayBackgroundAudio();
}, { once: true });

audioToggle.addEventListener('click', () => {
  setAudioEnabled(!audioEnabled);
});


/* ─── NAVBAR SHRINK ON SCROLL ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});


/* ─── HAMBURGER MENU ─── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach((a) =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);


/* ─── SCROLL PROGRESS BAR ─── */
const scrollBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollBar.style.width = pct + '%';
});


/* ─── ANIMATED REEL WAVEFORM BARS ─── */
const reelBarsContainer = document.getElementById('reelBars');
for (let i = 0; i < 40; i++) {
  const bar = document.createElement('div');
  bar.className = 'reel-bar';
  bar.style.animationDuration = (0.6 + Math.random() * 1.2) + 's';
  bar.style.animationDelay    = (Math.random() * 1) + 's';
  reelBarsContainer.appendChild(bar);
}


/* ─── HERO STAT COUNTERS ─── */
const counterEls = document.querySelectorAll('[data-count]');
let counted = false;

function animateCounters() {
  if (counted) return;
  const heroRect = document.getElementById('hero').getBoundingClientRect();
  if (heroRect.bottom > 0) {
    counted = true;
    counterEls.forEach((el) => {
      const target = +el.dataset.count;
      const suffix = target >= 10 ? '+' : '';
      let current = 0;
      const inc   = target / 60;
      const timer = setInterval(() => {
        current += inc;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current) + suffix;
      }, 25);
    });
  }
}
window.addEventListener('scroll', animateCounters);
setTimeout(animateCounters, 500);


/* ─── SCROLL REVEAL ─── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);
revealEls.forEach((el) => revealObserver.observe(el));


/* ─── SKILL BARS ─── */
const skillFills   = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) e.target.style.width = e.target.dataset.width + '%';
  }),
  { threshold: 0.3 }
);
skillFills.forEach((el) => skillObserver.observe(el));


/* ─── PORTFOLIO FILTER TABS ─── */
document.querySelectorAll('.filter-tab').forEach((tab) => {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.filter-tab').forEach((t) => t.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    document.querySelectorAll('.portfolio-item').forEach((item) => {
      const match = filter === 'all' || item.dataset.cat === filter;
      item.style.opacity       = match ? '1' : '0.18';
      item.style.transform     = match ? '' : 'scale(0.97)';
      item.style.pointerEvents = match ? 'all' : 'none';
    });
  });
});


/* ─── PORTFOLIO ITEM CLICK → MODAL ─── */
document.querySelectorAll('.portfolio-item').forEach((item) => {
  const video = item.querySelector('.p-video');
  const playBtn = item.querySelector('.p-play');
  
  if (video && playBtn) {
    // Click on play button to open modal
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title    = item.dataset.title    || 'Untitled';
      const catLabel = item.dataset.catLabel || '';
      const duration = item.dataset.duration || '';
      const link     = item.dataset.link     || '#';
      const desc     = item.dataset.desc     || '';
      openModal(title, catLabel, duration, link, desc);
    });

    // Click on card (not play button) to play/pause video
    item.addEventListener('click', (e) => {
      if (e.target === playBtn || playBtn.contains(e.target)) return;
      e.stopPropagation();
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  } else {
    // If no video, open modal on click (for other portfolio items)
    item.addEventListener('click', () => {
      const title    = item.dataset.title    || 'Untitled';
      const catLabel = item.dataset.catLabel || '';
      const duration = item.dataset.duration || '';
      const link     = item.dataset.link     || '#';
      const desc     = item.dataset.desc     || '';
      openModal(title, catLabel, duration, link, desc);
    });
  }
});


/* ─── AUTO-PLAY VIDEOS ON SCROLL ─── */
const autoPlayObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const video = entry.target;
    if (!video || typeof video.play !== 'function') return;

    // Ignore audio-only cards (this is still a <video> element, but it contains audio).
    const srcType = video.querySelector('source')?.type;
    if (srcType && srcType.startsWith('audio/')) return;

    if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}, { threshold: [0.45] });

document.querySelectorAll('.p-video').forEach((video) => autoPlayObserver.observe(video));


/* ─── VIDEO MODAL ─── */
const modalOverlay = document.getElementById('modalOverlay');

function openModal(title, cat, duration, link, desc) {
  document.getElementById('modalTitle').textContent    = title;
  document.getElementById('modalCat').textContent      = cat;
  document.getElementById('modalDuration').textContent = duration ? 'Duration: ' + duration : '';
  document.getElementById('modalDesc').textContent     = desc;
  
  const modalVideo = document.getElementById('modalVideo');
  if (modalVideo && link && link !== '#') {
    modalVideo.src = link;
    modalVideo.play().catch(() => {});
  }
  
  modalOverlay.classList.add('open');
}

function closeModal(e) {
  if (e.target === modalOverlay) modalOverlay.classList.remove('open');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') modalOverlay.classList.remove('open');
});

// Showreel play button
document.getElementById('reelPlay').addEventListener('click', () => {
  openModal(
    'Alex Reel — Showreel 2024',
    'Official Showreel',
    '3:47',
    'https://www.youtube.com',
    'A curated showreel of the best edits, grades, and motion work from 2024 across brand, social, and film categories.'
  );
});


/* ─── FILE UPLOAD DRAG & DROP ─── */
const uploadZone = document.getElementById('uploadZone');
const fileInput  = document.getElementById('fileInput');
const uploadList = document.getElementById('uploadList');

uploadZone.addEventListener('dragover',  (e) => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  handleFiles(e.dataTransfer.files);
});
fileInput.addEventListener('change', () => handleFiles(fileInput.files));

function handleFiles(files) {
  Array.from(files).forEach((file) => {
    const sizeMB = (file.size / 1024 / 1024).toFixed(1) + ' MB';
    const item   = document.createElement('div');
    item.className = 'upload-file-item';
    item.innerHTML = `
      <i class="fas fa-video"></i>
      <div style="flex:1">
        <div class="upload-file-name">${file.name}</div>
        <div class="upload-progress"><div class="upload-progress-fill"></div></div>
      </div>
      <span class="upload-file-size">${sizeMB}</span>
      <i class="fas fa-check-circle" style="color:var(--accent);margin-left:0.5rem;"></i>
    `;
    uploadList.appendChild(item);
  });
  showToast(`${files.length} file${files.length > 1 ? 's' : ''} added successfully!`);
}


/* ─── TOAST NOTIFICATION ─── */
function showToast(message) {
  const toast    = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  toastMsg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}


/* ─── FORM SUBMITS ─── */
function submitUpload() {
  showToast("Project submitted! I'll be in touch within 24 hrs.");
}

function sendMessage() {
  const name    = document.getElementById('cfName').value.trim();
  const last    = document.getElementById('cfLast').value.trim();
  const email   = document.getElementById('cfEmail').value.trim();
  const service = document.getElementById('cfService').value.trim();
  const msg     = document.getElementById('cfMsg').value.trim();
  if (!name || !email) {
    showToast('Please fill in your name and email.');
    return;
  }

  // Send form details via WhatsApp API (opens in a new tab)
  const whatsappNumber = '919834894962';
  const text = encodeURIComponent(
    `Hello!\n\nName: ${name} ${last}\nEmail: ${email}\nService: ${service || 'Not specified'}\nMessage: ${msg || 'No message provided.'}`
  );
  const url = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${text}`;
  window.open(url, '_blank');

  showToast(`Thanks ${name}! Your message is ready to send on WhatsApp.`);
  ['cfName','cfLast','cfEmail','cfMsg'].forEach((id) => {
    document.getElementById(id).value = '';
  });
}


/* ─── SMOOTH ANCHOR SCROLLING ─── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});