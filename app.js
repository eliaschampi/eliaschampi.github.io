import { translations } from "./translations.js?v=3";

const preferenceKey = "elias-language";
const supportedLanguage = (value) => value === "es" || value === "en";
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
let language = "es";
const text = (key) => translations[key][language];

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", text("openMenu"));
  navigation.classList.remove("is-open");
}

function applyLanguage(nextLanguage) {
  language = nextLanguage;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.innerHTML = text(element.dataset.i18n);
  });
  for (const attribute of ["aria-label", "content", "alt"]) {
    document.querySelectorAll(`[data-i18n-${attribute}]`).forEach((element) => {
      element.setAttribute(
        attribute,
        text(element.getAttribute(`data-i18n-${attribute}`)),
      );
    });
  }
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.language === language),
    );
  });
  document.querySelector("[data-menu-label]").textContent = text("menuLabel");
  document.querySelectorAll('a[href^="cv.html"]').forEach((link) => {
    link.href = `cv.html?lang=${language}`;
  });
  try {
    localStorage.setItem(preferenceKey, language);
  } catch {
    /* Optional preference. */
  }
  closeMenu();
}

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", text(open ? "closeMenu" : "openMenu"));
  navigation.classList.toggle("is-open", open);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuToggle.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuToggle.focus();
  }
});
document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.language);
    const url = new URL(location.href);
    url.searchParams.set("lang", language);
    history.replaceState(null, "", url);
  });
});

const requested = new URLSearchParams(location.search).get("lang");
let saved;
try {
  saved = localStorage.getItem(preferenceKey);
} catch {
  /* Optional preference. */
}
applyLanguage(
  supportedLanguage(requested)
    ? requested
    : supportedLanguage(saved)
      ? saved
      : "es",
);
document.querySelector("#year").textContent = new Date().getFullYear();
