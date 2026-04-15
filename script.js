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
