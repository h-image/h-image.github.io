document.addEventListener("DOMContentLoaded", async function () {
  // Load image data
  const imageData = await loadPicture();

  // Randomly select 10 images
  function getRandomImages() {
    const randomImages = [];
    for (let i = 0; i < 24; i++) {
      const randomIndex = Math.floor(Math.random() * imageData.length);
      randomImages.push(imageData[randomIndex]);
    }
    return randomImages;
  }

  // Display random images
  function showRandomImages() {
    const randomImages = getRandomImages();
    const gallery = document.querySelector(".image-gallery");
    while (gallery.firstChild) {
      gallery.removeChild(gallery.firstChild);
    }
    randomImages.forEach((el) => {
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
        img.src = "./asset/images/default.png"; // Default image on error
      };
      img.alt = el.title;
      img.title = el.title;
      img.src = el.url;

      // Add image to link
      alink.appendChild(img);
      // Add link and loading element to image item container
      imageItem.appendChild(alink);
      imageItem.appendChild(loadingElement);

      // Add image item container to gallery
      gallery.appendChild(imageItem);
    });
  }

  // Refresh button click event
  document
    .getElementById("refreshButton")
    .addEventListener("click", function () {
      showRandomImages();
    });

  // Back button click event
  document.getElementById("backButton").addEventListener("click", function () {
    window.location.href = "https://h-image.github.io"; // Return to main page
  });

  // Toggle dark mode and light mode
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

  // Display random images on initial load
  showRandomImages();
});

/**
 * Load all images
 * @returns {Array} Images
 */
async function loadPicture() {
  try {
    const response = await fetch(`https://h-image.github.io/raw/datas.json`);
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
  // Get user's preferred language
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

  // Load corresponding JSON file
  try {
    const response = await fetch(`asset/lang/${userLanguage}.json`);
    const data = await response.json();
    // Apply the text content to the page
    document.getElementById("refreshButton").textContent = data.refresh;
    document.getElementById("backButton").textContent = data.back;
  } catch (e) {
    console.log(e);
  }
}
