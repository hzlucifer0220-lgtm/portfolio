let isPlaying = false;
let currentTrack = 0;
let loadingProgress = 0;

// ===== DOM =====
let vinylDisc, playBtn, trackName;
let progressSlider, currentTimeEl, durationEl;

// ===== 音樂資料 =====
const tracks = [
  { name: "late night", src: "late night.mp3" },
  { name: "made it through", src: "made it through.mp3" },
  { name: "M.I.A", src: "M.I.A.mp3" }
];

// ===== Audio =====
const audio = new Audio();
audio.loop = false;

/* =========================
   初始化入口
========================= */
window.addEventListener("load", () => {
  initDOM();
  initMusic();
  initLoading();
  initScrollEffects();
  initObservers();
});

/* =========================
   DOM 初始化
========================= */
function initDOM() {
  vinylDisc = document.querySelector(".vinyl-disc");
  playBtn = document.getElementById("playBtn");
  trackName = document.getElementById("track-name");

  progressSlider = document.getElementById("progress");
  currentTimeEl = document.getElementById("current");
  durationEl = document.getElementById("duration");

  if (progressSlider) {
    progressSlider.addEventListener("input", () => {
      if (!audio.duration) return;
      audio.currentTime = (progressSlider.value / 100) * audio.duration;
    });
  }
}

/* =========================
   音樂系統
========================= */
function initMusic() {
  loadTrack(0);

  audio.addEventListener("timeupdate", () => {
    if (!progressSlider || !audio.duration) return;

    progressSlider.value = (audio.currentTime / audio.duration) * 100;

    if (currentTimeEl) {
      currentTimeEl.innerText = formatTime(audio.currentTime);
    }

    if (durationEl) {
      durationEl.innerText = formatTime(audio.duration);
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    if (durationEl) {
      durationEl.innerText = formatTime(audio.duration);
    }
  });

  audio.addEventListener("ended", () => {
    nextTrack();
  });
}

/* ===== 播放控制 ===== */
window.togglePlay = function () {
  if (!vinylDisc || !playBtn) return;

  if (isPlaying || !audio.paused) {
    audio.pause();
    isPlaying = false;
    vinylDisc.classList.remove("spin");
    playBtn.innerText = "▶";
  } else {
    audio.play().then(() => {
      isPlaying = true;
      vinylDisc.classList.add("spin");
      playBtn.innerText = "⏸";
    }).catch(() => {});
  }
};

/* ===== 切歌 ===== */
window.nextTrack = function () {
  loadTrack((currentTrack + 1) % tracks.length);

  if (isPlaying) {
    audio.play().catch(() => {});
    vinylDisc?.classList.add("spin");
    playBtn.innerText = "⏸";
  }
};

window.prevTrack = function () {
  loadTrack((currentTrack - 1 + tracks.length) % tracks.length);

  if (isPlaying) {
    audio.play().catch(() => {});
    vinylDisc?.classList.add("spin");
    playBtn.innerText = "⏸";
  } else {
    vinylDisc?.classList.remove("spin");
    playBtn.innerText = "▶";
  }
};

/* ===== 載入歌曲 ===== */
function loadTrack(index) {
  currentTrack = index;
  audio.src = tracks[currentTrack].src;

  if (trackName) {
    trackName.innerText = tracks[currentTrack].name;
  }

  audio.load();
}

/* =========================
   loading screen
========================= */
function initLoading() {
  const loading = document.getElementById("loading-screen");
  const bar = document.querySelector(".loading-progress");

  if (!loading || !bar) return;

  let loadingProgress = 0;

  const duration = 5000;
  const intervalTime = 50;
  const step = 100 / (duration / intervalTime);

  const timer = setInterval(() => {
    loadingProgress += step;

    if (loadingProgress >= 100) {
      loadingProgress = 100;
      clearInterval(timer);

      loading.style.transition = "0.8s ease";
      loading.style.opacity = "0";

      setTimeout(() => {
        loading.remove();
      }, 800);
    }

    // ⭐ 防炸點（關鍵）
    if (bar) {
      bar.style.width = loadingProgress + "%";
    }

  }, intervalTime);
}

/* =========================
   scroll effects
========================= */
function initScrollEffects() {
  window.addEventListener("scroll", () => {
    const hero = document.querySelector(".hero-ui");
    if (hero) {
      const scrollY = window.scrollY;

      hero.style.transform =
        `translateY(${scrollY * 0.25}px) scale(${1 - scrollY * 0.0005})`;

      hero.style.opacity = 1 - scrollY / 600;
    }

    const nav = document.querySelector(".top-nav");
    if (nav) {
      nav.style.opacity = 1 - window.scrollY / 600;
    }
  });

  document.querySelectorAll(".top-nav a").forEach(anchor => {
    anchor.addEventListener("click", e => {
      e.preventDefault();

      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/* =========================
   intersection observers
========================= */
function initObservers() {
  const fadeSections = document.querySelectorAll(".fade-section");

  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("show");
        void entry.target.offsetWidth;
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.2 });

  fadeSections.forEach(el => fadeObserver.observe(el));

  const originBlocks = document.querySelectorAll(".origin-block");

  const originObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("show");
        void entry.target.offsetWidth;
        entry.target.classList.add("show");
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: "0px 0px -20% 0px"
  });

  originBlocks.forEach(el => originObserver.observe(el));
}


/* =========================
   utils
========================= */
function formatTime(time) {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}
