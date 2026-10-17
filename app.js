import { translations } from "./translations.js?v=2";

const preferenceKey = "elias-language";
const supportedLanguage = (value) => value === "es" || value === "en";
let language = "es";
const text = (key) => translations[key][language];

function applyLanguage(nextLanguage) {
  language = nextLanguage;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.innerHTML = text(element.dataset.i18n);
  });
  for (const attribute of ["aria-label", "content"]) {
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
    /* Optional persistence. */
  }
  closeMenu();
  updateFilterStatus();
}

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", text("openMenu"));
  navigation.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? text("openMenu") : text("closeMenu"),
  );
  navigation.classList.toggle("is-open", !isOpen);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
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
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});

const colors = { lime: "#d2ed86", lilac: "#c4b0e6", peach: "#e8b091" };
document.querySelectorAll(".swatch").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".swatch").forEach((swatch) => {
      swatch.setAttribute("aria-pressed", String(swatch === button));
    });
    document
      .querySelector(".hero-art")
      .style.setProperty("--accent", colors[button.dataset.color]);
  });
});

const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");
filters.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    filters.forEach((filter) =>
      filter.setAttribute("aria-pressed", String(filter === button)),
    );
    projects.forEach((project) => {
      const matches =
        selected === "all" ||
        project.dataset.category.split(" ").includes(selected);
      project.hidden = !matches;
    });
    updateFilterStatus();
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();

function updateFilterStatus() {
  const visible = document.querySelectorAll(".project:not([hidden])").length;
  document.querySelector("#filter-status").textContent =
    `${visible} ${text("projectCount")}`;
}

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.language);
    const url = new URL(location.href);
    url.searchParams.set("lang", language);
    history.replaceState(null, "", url);
  });
});

const requestedLanguage = new URLSearchParams(location.search).get("lang");
let savedLanguage;
try {
  savedLanguage = localStorage.getItem(preferenceKey);
} catch {
  /* Optional persistence. */
}
applyLanguage(
  supportedLanguage(requestedLanguage)
    ? requestedLanguage
    : supportedLanguage(savedLanguage)
      ? savedLanguage
      : "es",
);
