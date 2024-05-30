document.addEventListener("DOMContentLoaded", async function () {
  showPageBtn();
  // Array of image data, including image paths, titles, and categories
  const imageData = await loadPicture();
  // Number of items displayed per page
  const itemsPerPage = 10;
  // Current page images
  let currentImages = imageData ? imageData.slice() : imageData;
  // Total pages
  let totalPages = Math.ceil(currentImages?.length / itemsPerPage);

  // Current page on mobile
  let mobileCurrentPage = 1;

  /**
   * Display images based on the current page (PC version)
   * @param {*} currentPage Current page number
   */
  function displayImages(currentPage) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageImages = currentImages.slice(startIndex, endIndex);

    const gallery = document.querySelector(".image-gallery");
    while (gallery.firstChild) {
      gallery.removeChild(gallery.firstChild);
    }
    pageImages.forEach((el) => {
      // Create image item container
      const imageItem = document.createElement("div");
      imageItem.classList.add("image-item");
      // Create loading element
      const loadingElement = document.createElement("div");
      loadingElement.classList.add("image-loading");
      loadingElement.textContent = "Loading...";
      loadingElement.style.display = "block";
      // Create link
      const alink = document.createElement("a");
      alink.href = el.detail_url;
      alink.target = "_blank";
      alink.rel = "noopener noreferrer nofollow";

      // Create image element
      const img = new Image();
      img.onload = function () {
        // Hide loading element
        loadingElement.style.display = "none";
      };
      img.onerror = function () {
        img.src = "./asset/images/default.png";
      };
      img.alt = el.title;
      img.title = el.title;
      img.src = el.url;
      // Add image to link
      alink.appendChild(img);
      // Add image item container to image item container
      imageItem.appendChild(alink);
      // Add loading and image elements to image item container
      imageItem.appendChild(loadingElement);
      // Add image item container to image display area
      gallery.appendChild(imageItem);
    });
    // Page settings
    const currentPageElement = document.getElementById("currentPage");
    currentPageElement.textContent = currentPage;
    const totalpageElement = document.getElementById("totalpage");
    totalpageElement.textContent = totalPages;
  }

  /**
   * Update the page parameter in the URL
   */
  function updateURL(page) {
    const newUrl = window.location.origin + "?page=" + page;
    window.history.pushState({ path: newUrl }, "", newUrl);
  }

  /**
   * Update the URL when flipping pages
   * @param currentPage Current page number
   */
  function displayImagesAndUpdateURL(currentPage) {
    displayImages(currentPage);
    updateURL(currentPage);
  }

  /**
   * Get the current page number (PC version)
   */
  function getCurrentPage() {
    // Get the page parameter from the URL, default to 1 if not found
    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = parseInt(urlParams.get("page")) || 1;
    if (isNaN(currentPage)) {
      currentPage = 1;
    } else if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    return currentPage;
  }

  // Toggle between dark mode and light mode
  const darkmode = document.querySelector(".darkmode-btn");
  darkmode.addEventListener("click", function () {
    document.body.classList.toggle("night-mode");
    if (document.body.classList.contains("night-mode")) {
      darkmode.children[0].classList.remove("fa-moon");
      darkmode.children[0].classList.add("fa-sun");
    } else {
      darkmode.children[0].classList.remove("fa-sun");
      darkmode.children[0].classList.add("fa-moon");
    }
  });

  // Search function
  const searchButton = document.getElementById("searchButton");
  const searchInput = document.getElementById("searchInput");
  // Add enter key event for search
  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      performSearch();
    }
  });

  // Search button click event
  searchButton.addEventListener("click", performSearch);

  /**
   * Search function
   */
  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    if (!searchTerm.trim()) {
      currentImages = imageData.slice();
    } else {
      currentImages = imageData.filter(
        (item) =>
          item.id?.toLowerCase()?.includes(searchTerm) ||
          item.title?.toLowerCase()?.includes(searchTerm) ||
          item.webui_parameters?.toLowerCase()?.includes(searchTerm)
      );
    }
    totalPages = Math.ceil(currentImages.length / itemsPerPage);
    mobileCurrentPage = 1;
    displayImagesAndUpdateURL(1);
  }

  // Click first page button
  const firstPageButton = document.getElementById("firstPage");
  firstPageButton.addEventListener("click", function () {
    displayImagesAndUpdateURL(1);
  });

  // Click previous page button
  const prevPageButton = document.getElementById("prevPage");
  prevPageButton.addEventListener("click", function () {
    // Get the current page number
    const currentPage = parseInt(
      document.getElementById("currentPage").textContent
    );
    if (currentPage > 1) {
      displayImagesAndUpdateURL(currentPage - 1);
    }
  });

  // Click next page button
  const nextPageButton = document.getElementById("nextPage");
  nextPageButton.addEventListener("click", function () {
    // Get the current page number and total pages
    const currentPage = parseInt(
      document.getElementById("currentPage").textContent
    );
    const totalPages = Math.ceil(currentImages.length / itemsPerPage);
    if (currentPage < totalPages) {
      displayImagesAndUpdateURL(currentPage + 1);
    }
  });

  // Click last page button
  const lastPageButton = document.getElementById("lastPage");
  lastPageButton.addEventListener("click", function () {
    displayImagesAndUpdateURL(totalPages);
  });

  // Directly modify the page number
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
    displayImagesAndUpdateURL(currentPage);
  });

  // Listen for keyboard events
  document.addEventListener("keydown", function (event) {
    const currentPage = parseInt(
      document.getElementById("currentPage").textContent
    );
    const totalPages = Math.ceil(currentImages.length / itemsPerPage);
    if (event.key === "ArrowLeft" && currentPage > 1) {
      displayImagesAndUpdateURL(currentPage - 1);
    } else if (event.key === "ArrowRight" && currentPage < totalPages) {
      displayImagesAndUpdateURL(currentPage + 1);
    }
  });

  // Load more button click event
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  loadMoreBtn.addEventListener("click", function () {
    mobileCurrentPage++;
    const startIndex = (mobileCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageImages = currentImages.slice(startIndex, endIndex);

    const gallery = document.querySelector(".image-gallery");
    pageImages.forEach((el) => {
      // Create image item container
      const imageItem = document.createElement("div");
      imageItem.classList.add("image-item");
      // Create loading element
      const loadingElement = document.createElement("div");
      loadingElement.classList.add("image-loading");
      loadingElement.textContent = "Loading...";
      loadingElement.style.display = "block";
      // Create link
      const alink = document.createElement("a");
      alink.href = el.detail_url;
      alink.target = "_blank";
      alink.rel = "noopener noreferrer nofollow";

      // Create image element
      const img = new Image();
      img.onload = function () {
        // Hide loading element
        loadingElement.style.display = "none";
      };
      img.onerror = function () {
        img.src = "./asset/images/default.png";
      };
      img.alt = el.title;
      img.title = el.title;
      img.src = el.url;
      // Add image to link
      alink.appendChild(img);
      // Add image item container to image item container
      imageItem.appendChild(alink);
      // Add loading and image elements to image item container
      imageItem.appendChild(loadingElement);
      // Add image item container to image display area
      gallery.appendChild(imageItem);
    });

    // Check if there are more images to load, hide the load more button if none
    if (itemsPerPage > pageImages.length) {
      loadMoreBtn.style.display = "none";
    }
  });

  // Random button click event
  const randomButton = document.getElementById("randomButton");
  randomButton.addEventListener("click", function () {
    window.location.href =
      "https://h-image.github.io/random.html"; // Return to main page
  });

  // Scroll to top button
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  // Show or hide the scroll to top button when scrolling
  window.addEventListener("scroll", function () {
    if (window.scrollY > 200) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });

  // Scroll to the top of the page when the button is clicked
  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });
  });

  // Load language
  await loadLanguage();
  // Initialize image display
  displayImagesAndUpdateURL(getCurrentPage());
});

/**
 * Load all images
 * @returns images
 */
async function loadPicture() {
  try {
    const response = await fetch(`raw/datas.json`);
    const datas = await response.json();
    if (!datas) {
      datas = [];
    }
    // Hide loading
    document.querySelector(".loader-wrapper").style.display = "none";
    return datas;
  } catch (e) {
    console.log(e);
  }
}

/**
 * Load language
 */
async function loadLanguage() {
  // Get the user's preferred language
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
  // Load the corresponding JSON file
  try {
    const response = await fetch(`asset/lang/${userLanguage}.json`);
    const data = await response.json();
    // Apply the text content to the page
    document.getElementById("searchButton").textContent = data.search;
    document.getElementById("firstPage").textContent = data.first_page;
    document.getElementById("prevPage").textContent = data.prev_page;
    document.getElementById("nextPage").textContent = data.next_page;
    document.getElementById("lastPage").textContent = data.last_page;
    document.getElementById("randomButton").textContent = data.random;
  } catch (e) {
    console.log(e);
  }
}

/**
 * Show pagination buttons
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
 * Determine if it is a mobile device
 * @returns mobile device flag
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
