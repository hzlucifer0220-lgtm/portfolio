let currentPage = 0; // 0 = 封面

function startSite() {
  document.body.classList.add("active");

  startMusic(); // ⭐ 加這行

  goToPage(1);
}

function goToPage(page) {

  const oldPage = document.querySelector(".page.active-page");
  const newPage = document.getElementById("page" + page);

  if (!newPage || page === currentPage) return;

  const goingForward = page > currentPage;

  /* 清除動畫 */
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("enter-up","enter-down","exit-up","exit-down");
  });

  /* 初始位置 */
  if (goingForward) {
    newPage.classList.add("enter-up");
  } else {
    newPage.classList.add("enter-down");
  }

  newPage.classList.add("active-page");

  setTimeout(() => {

    if (oldPage) {
      oldPage.classList.remove("active-page");

      if (goingForward) {
        oldPage.classList.add("exit-up");
      } else {
        oldPage.classList.add("exit-down");
      }
    }

    newPage.classList.remove("enter-up","enter-down");

  }, 20);

  /* tab active */
  document.querySelectorAll(".tab").forEach((tab, i) => {
    tab.classList.toggle("active", i === page - 1);
  });

  currentPage = page;
}

function goHome() {

  document.body.classList.remove("active");

  const oldPageEl = document.querySelector(".page.active-page");

  if (oldPageEl) {
    oldPageEl.classList.remove("active-page");
  }

  document.getElementById("home").classList.add("active-page");

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });

  currentPage = 0;
}
/* ===== 音樂系統 ===== */
const tracks = [
  { name: "late night", src: "late night.mp3" },
  { name: "made it through", src: "made it through.mp3" },
  { name: "M.I.A", src: "M.I.A.mp3" }
];

let currentTrack = 0;
const audio = new Audio();
audio.loop = false; // 我們自己控制循環

const trackName = document.getElementById("track-name");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("playBtn");
const vinyl = document.querySelector(".vinyl");

/* 載入歌曲 */
function loadTrack(index) {
  currentTrack = index;
  audio.src = tracks[currentTrack].src;
  trackName.innerText = tracks[currentTrack].name;
}

/* 自動播放（第一次 START） */
function startMusic() {
  audio.play().catch(() => {});
  vinyl.classList.add("spin");
  playBtn.innerText = "⏸";
}

/* 播放控制 */
function togglePlay() {
  if (audio.paused) {
    audio.play();
    vinyl.classList.add("spin");
    playBtn.innerText = "⏸";
  } else {
    audio.pause();
    vinyl.classList.remove("spin");
    playBtn.innerText = "▶";
  }
}

/* 切歌 */
function nextTrack() {
  loadTrack((currentTrack + 1) % tracks.length);
  audio.play();
}

function prevTrack() {
  loadTrack((currentTrack - 1 + tracks.length) % tracks.length);
  audio.play();
}

/* 自動下一首（無限循環） */
audio.addEventListener("ended", () => {
  nextTrack();
});

/* 進度條 */
audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
});

/* 初始化 */
loadTrack(0);

/* 時間格式 */
function formatTime(time) {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}
