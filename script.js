let currentPage = 0; // 0 = 封面

function startSite() {
  document.body.classList.add("active");
  goToPage(1); // 進入第一頁
}

function goToPage(page) {

  // 隱藏所有頁面
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active-page");
  });

  // 顯示目標頁
  document.getElementById("page" + page).classList.add("active-page");

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

  // 顯示封面
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active-page");
  });

  document.getElementById("home").classList.add("active-page");

  // 清除 tab active
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });

  currentPage = 0;
}
