const gallery = document.querySelector("[data-gallery]");
const showGalleryButton = document.querySelector("[data-show-gallery]");
const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCounter = document.querySelector("[data-lightbox-counter]");
const closeLightboxButton = document.querySelector("[data-lightbox-close]");
const prevButton = document.querySelector("[data-lightbox-prev]");
const nextButton = document.querySelector("[data-lightbox-next]");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const cookieBanner = document.querySelector("[data-cookie-banner]");
const cookieAcceptButton = document.querySelector("[data-cookie-accept]");
const cookieRejectButton = document.querySelector("[data-cookie-reject]");
const cookieConsentName = "spawacz_rafal_cookie_consent_v2";

let currentIndex = 0;

function readCookieConsent() {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieConsentName}=`));

  if (cookieValue) {
    return cookieValue.split("=")[1];
  }

  try {
    return localStorage.getItem(cookieConsentName);
  } catch (error) {
    return null;
  }
}

function saveCookieConsent(value) {
  const maxAge = 60 * 60 * 24 * 180;
  document.cookie = `${cookieConsentName}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`;

  try {
    localStorage.setItem(cookieConsentName, value);
  } catch (error) {
    // Consent is still stored in a cookie when localStorage is unavailable.
  }

  if (cookieBanner) {
    cookieBanner.hidden = true;
  }
}

if (cookieBanner && !readCookieConsent()) {
  cookieBanner.hidden = false;
}

cookieAcceptButton?.addEventListener("click", () => saveCookieConsent("accepted"));
cookieRejectButton?.addEventListener("click", () => saveCookieConsent("rejected"));

function imageData() {
  return galleryItems.map((item) => {
    const image = item.querySelector("img");
    return {
      src: image.getAttribute("src"),
      alt: image.getAttribute("alt")
    };
  });
}

const images = imageData();

function updateLightbox(index) {
  currentIndex = (index + images.length) % images.length;
  lightboxImage.src = images[currentIndex].src;
  lightboxImage.alt = images[currentIndex].alt;
  lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
}

function openLightbox(index) {
  updateLightbox(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  closeLightboxButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});

showGalleryButton.addEventListener("click", () => {
  gallery.classList.add("is-expanded");
  showGalleryButton.remove();
});

prevButton.addEventListener("click", () => updateLightbox(currentIndex - 1));
nextButton.addEventListener("click", () => updateLightbox(currentIndex + 1));
closeLightboxButton.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    updateLightbox(currentIndex - 1);
  }

  if (event.key === "ArrowRight") {
    updateLightbox(currentIndex + 1);
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Zamknij menu" : "Otwórz menu");
});

siteNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Otwórz menu");
  }
});
