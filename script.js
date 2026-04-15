let currentPage = 0; // 0 = 封面

function startSite() {
  document.body.classList.add("active");
  goToPage(1);
}

function goToPage(page) {

  const oldPageEl = document.querySelector(".page.active-page");
  const newPageEl = document.getElementById("page" + page);

  if (!newPageEl || currentPage === page) return;

  // 判斷方向
  const goingForward = page > currentPage;

  // 清掉所有動畫 class
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("enter-up", "enter-down", "exit-up", "exit-down");
  });

  // 設定新頁初始位置
  if (goingForward) {
    newPageEl.classList.add("enter-up");
  } else {
    newPageEl.classList.add("enter-down");
  }

  newPageEl.classList.add("active-page");

  // 讓瀏覽器套用初始位置（很重要）
  setTimeout(() => {

    if (oldPageEl) {
      oldPageEl.classList.remove("active-page");

      if (goingForward) {
        oldPageEl.classList.add("exit-up");
      } else {
        oldPageEl.classList.add("exit-down");
      }
    }

    // 讓新頁回到正常位置
    newPageEl.classList.remove("enter-up", "enter-down");

  }, 20);

  // 更新 tab active
  document.querySelectorAll(".tab").forEach((tab, index) => {
    tab.classList.remove("active");
    if (index === page - 1) {
      tab.classList.add("active");
    }
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
const tracks = [
  {
    name: "Track 1 - Artist",
    src: "music1.mp3"
  },
  {
    name: "Track 2 - Artist",
    src: "music2.mp3"
  }
];

let currentTrack = 0;
let audio = new Audio(tracks[currentTrack].src);

const trackName = document.getElementById("track-name");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("playBtn");
const vinyl = document.querySelector(".vinyl");

trackName.innerText = tracks[currentTrack].name;

/* 播放 / 暫停 */
function togglePlay() {
  if (audio.paused) {
    audio.play();
    playBtn.innerText = "⏸";
    vinyl.classList.add("spin");
  } else {
    audio.pause();
    playBtn.innerText = "▶";
    vinyl.classList.remove("spin");
  }
}

/* 下一首 */
function nextTrack() {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack();
}

/* 上一首 */
function prevTrack() {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack();
}

function loadTrack() {
  audio.src = tracks[currentTrack].src;
  trackName.innerText = tracks[currentTrack].name;
  audio.play();
  playBtn.innerText = "⏸";
  vinyl.classList.add("spin");
}

/* 進度條 */
audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;

  document.getElementById("current").innerText = formatTime(audio.currentTime);
  document.getElementById("duration").innerText = formatTime(audio.duration);
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

/* 時間格式 */
function formatTime(time) {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}
