document.addEventListener("DOMContentLoaded", async function () {
  showPageBtn();
  // 图片数据数组，包含图片路径、标题和类别
  const imageData = await loadPicture();
  //每页显示的件数
  const itemsPerPage = 14;
  //当前页图片
  let currentImages = imageData ? imageData.slice() : imageData;
  // 总页
  let totalPages = Math.ceil(currentImages.length / itemsPerPage);
  // 移动端当前页面
  let mobileCurrentPage = 1;
  // 根据当前页数显示图片
  function displayImages(currentPage) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageImages = currentImages.slice(startIndex, endIndex);

    const gallery = document.querySelector(".image-gallery");
    while (gallery.firstChild) {
      gallery.removeChild(gallery.firstChild);
    }
    pageImages.forEach((el) => {
      //创建图片项容器
      const imageItem = document.createElement("div");
      imageItem.classList.add("image-item");
      // 创建 loading 元素
      const loadingElement = document.createElement("div");
      loadingElement.classList.add("image-loading");
      loadingElement.textContent = "Loading...";
      loadingElement.style.display = "block";
      //创建link
      const alink = document.createElement("a");
      alink.href = el.url;
      alink.target = "_blank";
      alink.rel = "noopener noreferrer";

      // 创建图片元素
      const img = new Image();
      img.alt = el.title;
      img.title = el.title;
      img.height = 400;
      // 显示图片
      img.src = el.url;
      loadImage(el.url, function () {
        // 隐藏 loading 元素
        loadingElement.style.display = "none";
      });
      //将图片添加到link
      alink.appendChild(img);
      //到图片项容器到图片项容器
      imageItem.appendChild(alink);
      // 将 loading 和图片元素添加到图片项容器
      imageItem.appendChild(loadingElement);
      //将图片项容器添加到图片显示区域
      gallery.appendChild(imageItem);
    });
    // 页面设置
    const currentPageElement = document.getElementById("currentPage");
    currentPageElement.textContent = currentPage;
    const totalpageElement = document.getElementById("totalpage");
    totalpageElement.textContent = totalPages;
  }

  //夜间模式的按钮
  document.getElementById("toggleMode").addEventListener("change", function () {
    toggleNightMode();
  });

  // 搜索功能
  const searchButton = document.getElementById("searchButton");
  const searchInput = document.getElementById("searchInput");
  // 添加enter检索事件
  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      performSearch();
    }
  });
  //检索按钮按下事件
  searchButton.addEventListener("click", performSearch);

  // 检索函数
  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    if (!searchTerm.trim()) {
      currentImages = imageData.slice();
    } else {
      currentImages = imageData.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.id.toLowerCase().includes(searchTerm)
      );
    }
    totalPages = Math.ceil(currentImages.length / itemsPerPage);
    mobileCurrentPage = 1;
    displayImages(1);
  }

  // 点击第一页按钮
  const firstPageButton = document.getElementById("firstPage");
  firstPageButton.addEventListener("click", function () {
    displayImages(1);
  });

  // 点击上一页按钮
  const prevPageButton = document.getElementById("prevPage");
  prevPageButton.addEventListener("click", function () {
    // 获取当前页数
    const currentPage = parseInt(
      document.getElementById("currentPage").textContent
    );
    if (currentPage > 1) {
      displayImages(currentPage - 1);
    }
  });

  // 点击下一页按钮
  const nextPageButton = document.getElementById("nextPage");
  nextPageButton.addEventListener("click", function () {
    // 获取当前页数和总页数
    const currentPage = parseInt(
      document.getElementById("currentPage").textContent
    );
    const totalPages = Math.ceil(currentImages.length / itemsPerPage);
    if (currentPage < totalPages) {
      displayImages(currentPage + 1);
    }
  });

  // 点击最后一页按钮
  const lastPageButton = document.getElementById("lastPage");
  lastPageButton.addEventListener("click", function () {
    displayImages(totalPages);
  });

  //直接修改页数
  const currentPageElement = document.getElementById("currentPage");
  currentPageElement.addEventListener("input", function (event) {
    let currentPage;
    try {
      currentPage = parseInt(event.target.textContent);
    } catch (e) {
      currentPage = 1;
    }
    if (isNaN(currentPage)) {
      currentPage = 1;
    } else if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    displayImages(currentPage);
  });
  // 加载更多按钮点击事件
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  loadMoreBtn.addEventListener("click", function () {
    const startIndex = (mobileCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageImages = currentImages.slice(startIndex, endIndex);

    const gallery = document.querySelector(".image-gallery");
    pageImages.forEach((el) => {
      //创建图片项容器
      const imageItem = document.createElement("div");
      imageItem.classList.add("image-item");
      // 创建 loading 元素
      const loadingElement = document.createElement("div");
      loadingElement.classList.add("image-loading");
      loadingElement.textContent = "Loading...";
      loadingElement.style.display = "block";
      //创建link
      const alink = document.createElement("a");
      alink.href = el.url;
      alink.target = "_blank";
      alink.rel = "noopener noreferrer";

      // 创建图片元素
      const img = new Image();
      img.alt = el.title;
      img.title = el.title;
      img.height = 400;
      // 显示图片
      img.src = el.url;
      loadImage(el.url, function () {
        // 隐藏 loading 元素
        loadingElement.style.display = "none";
      });
      //将图片添加到link
      alink.appendChild(img);
      //到图片项容器到图片项容器
      imageItem.appendChild(alink);
      // 将 loading 和图片元素添加到图片项容器
      imageItem.appendChild(loadingElement);
      //将图片项容器添加到图片显示区域
      gallery.appendChild(imageItem);
    });

    // 判断是否还有更多图片可以加载，如果没有，隐藏加载更多按钮
    if (mobileCurrentPage * itemsPerPage >= pageImages.length) {
      loadMoreBtn.style.display = "none";
    }
  });

  await loadLanguage();
  // 初始化显示图片
  displayImages(1);
});

// 创建一个用于加载图片的函数
function loadImage(src, callback) {
  const img = new Image();
  img.onload = function () {
    callback(img);
  };
  img.src = src;
}

// 切换夜间模式的函数
function toggleNightMode() {
  document.body.classList.toggle("night-mode");
}

/**
 * 加载所有图片
 * @returns 图片
 */
async function loadPicture() {
  try {
    const response = await fetch(`raw/datas.json`);
    const datas = await response.json();
    if (!datas) {
      datas = [];
    }
    return datas;
  } catch (e) {
    console.log(e);
  }
}

/**
 * 加载语言
 */
async function loadLanguage() {
  // 获取用户的语言首选项
  let userLanguage = navigator.language || navigator.userLanguage;
  if (
    userLanguage !== "en" &&
    userLanguage !== "zh-CN" &&
    userLanguage !== "ja"
  ) {
    userLanguage = "en";
  }
  let html = document.getElementsByTagName("html");
  html[0].lang = userLanguage;
  // 加载对应的 JSON 文件
  try {
    const response = await fetch(`lang/${userLanguage}.json`);
    const data = await response.json();
    // 将文本内容应用到页面上
    document.getElementById("homeLink").textContent = data.home;
    document.getElementById("aboutLink").textContent = data.about;
    document.getElementById("darkMode").textContent = data.dark_mode_label;
    document.getElementById("searchButton").textContent = data.search;
    document.getElementById("firstPage").textContent = data.first_page;
    document.getElementById("prevPage").textContent = data.prev_page;
    document.getElementById("nextPage").textContent = data.next_page;
    document.getElementById("lastPage").textContent = data.last_page;
  } catch (e) {
    console.log(e);
  }
}


/**
 * 显示翻页按钮
 */
function showPageBtn() {
  if (isMobile()) {
    const pagination = document.querySelector(".pagination-container");
    pagination.style.display = "none";
    const mobilePagination = document.querySelector(
      ".mobile-pagination-container"
    );
    mobilePagination.style.display = "block";
  } else {
    const pagination = document.querySelector(".pagination-container");
    pagination.style.display = "flex";
    const mobilePagination = document.querySelector(
      ".mobile-pagination-container"
    );
    mobilePagination.style.display = "none";
  }
}

/**
 * 判断是否是移动端
 * @returns 移动端flg
 */
function isMobile() {
  var userAgent = navigator.userAgent;
  var mobileDeviceRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

  if (
    mobileDeviceRegex.test(userAgent) ||
    window.matchMedia("only screen and (max-width: 768px)").matches
  ) {
    return true;
  }
  return false;
}
