let isPlaying = false;
let currentPage = 0;
let vinylDisc, playBtn, trackName, progress, currentTimeEl, durationEl;

/* ===== 音樂系統 ===== */
const tracks = [
  { name: "late night", src: "late night.mp3" },
  { name: "made it through", src: "made it through.mp3" },
  { name: "M.I.A", src: "M.I.A.mp3" }
];

let currentTrack = 0;

const audio = new Audio();
audio.loop = false; // 我們自己控制循環

/* 播放控制 */
window.togglePlay = function() {
 if (!playBtn || !vinylDisc) {
  console.log("DOM not ready");
  return;
}

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
}

/* 切歌 */
window.nextTrack = function () {
  loadTrack((currentTrack + 1) % tracks.length);

  if (isPlaying) {
    audio.play().catch(() => {});
  }

  vinylDisc?.classList.add("spin");
  playBtn.innerText = "⏸";
}

window.prevTrack = function() {
  loadTrack((currentTrack - 1 + tracks.length) % tracks.length);

  if (isPlaying) {
    audio.play().catch(() => {});
    vinylDisc?.classList.add("spin");
    playBtn.innerText = "⏸";
  } else {
    vinylDisc?.classList.remove("spin");
    playBtn.innerText = "▶";
  }
}









window.addEventListener("load", async () => {

  vinylDisc = document.querySelector(".vinyl-disc");
  playBtn = document.getElementById("playBtn");
  trackName = document.getElementById("track-name");
  progress = document.getElementById("progress");
  currentTimeEl = document.getElementById("current");
  durationEl = document.getElementById("duration");

  loadTrack(0);
  progress.addEventListener("input", () => {
  if (!audio.duration) return;

  const newTime = (progress.value / 100) * audio.duration;
  audio.currentTime = newTime;
});

  await preloadImages();

  const loading = document.getElementById("loading-screen");

  setTimeout(() => {
     loading.style.transition = "0.8s ease";
    loading.style.opacity = "0";
   
    setTimeout(() => loading.remove(), 800);
  }, 300);
  // ⭐ 音樂時間更新
audio.addEventListener("timeupdate", () => {
  if (!progress) return;

  progress.value = (audio.currentTime / audio.duration) * 100 || 0;

  currentTimeEl.innerText = formatTime(audio.currentTime);
  durationEl.innerText = formatTime(audio.duration);
});

// ⭐ 載入完成
audio.addEventListener("loadedmetadata", () => {
  durationEl.innerText = formatTime(audio.duration);
});

// ⭐ 自動下一首（無限循環）
audio.addEventListener("ended", () => {
  nextTrack();
});
});

function preloadImages() {
  const imgs = document.images;
   let loaded = 0;

  return new Promise((resolve) => {
    if (imgs.length === 0) resolve();

    for (let img of imgs) {
      if (img.complete) {
        loaded++;
        if (loaded === imgs.length) resolve();
      } else {
        img.onload = img.onerror = () => {
          loaded++;
          if (loaded === imgs.length) resolve();
        };
      }
    }
  });
}

/* 載入歌曲 */
function loadTrack(index) {
  currentTrack = index;
  audio.src = tracks[currentTrack].src;

  if (trackName) {
    trackName.innerText = tracks[currentTrack].name;
  }

  audio.load();
}
/* 自動播放（第一次 START） */
function startMusic() {
  if (!vinylDisc || !playBtn) return;

  audio.play().then(() => {
    isPlaying = true;
    vinylDisc.classList.add("spin");
    playBtn.innerText = "⏸";
  }).catch(() => {});
}

/* 時間格式 */
function formatTime(time) {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}
function fadeOut(audio, duration = 300) {
  return new Promise(resolve => {
    let vol = audio.volume;
    const step = vol / (duration / 30);

    const fade = setInterval(() => {
      vol -= step;
      if (vol <= 0) {
        vol = 0;
        audio.volume = 0;
        clearInterval(fade);
        resolve();
      } else {
        audio.volume = vol;
      }
    }, 30);
  });
}

function fadeIn(audio, duration = 300) {
  return new Promise(resolve => {
    let vol = 0;
    audio.volume = 0;

    const step = 1 / (duration / 30);

    const fade = setInterval(() => {
      vol += step;
      if (vol >= 1) {
        vol = 1;
        audio.volume = 1;
        clearInterval(fade);
        resolve();
      } else {
        audio.volume = vol;
      }
    }, 30);
  });
}
let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;

  audio.play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;
      audioUnlocked = true;

      // ⭐ 同一次點擊直接播放
      startMusic();
    })
    .catch(() => {});
}

document.addEventListener("click", unlockAudio, { once: true });
document.addEventListener("touchstart", unlockAudio, { once: true });

const sections = document.querySelectorAll(".fade-section");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
}, {
  threshold: 0.25
});

sections.forEach(sec => observer.observe(sec));
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero-ui");
  const scrollY = window.scrollY;

  hero.style.transform = `translateY(${scrollY * 0.25}px) scale(${1 - scrollY * 0.0005})`;
  hero.style.opacity = 1 - scrollY / 600;
});
document.querySelectorAll('.top-nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));

    target.scrollIntoView({
      behavior: 'smooth'
    });
  });
});
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".top-nav");
  nav.style.opacity = 1 - window.scrollY / 600;
});
const originBlocks = document.querySelectorAll(".origin-block");

const originObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.3
});

originBlocks.forEach(block => originObserver.observe(block));
const marquee = document.querySelector(".marquee-track");

const marqueeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      marquee.style.animationPlayState = "running";
    } else {
      marquee.style.animationPlayState = "paused";
    }
  });
});

marqueeObserver.observe(document.querySelector(".marquee-section"));
