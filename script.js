const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

// Restore the visitor's theme preference.
const savedTheme = localStorage.getItem("jeanne-portfolio-theme");
if (savedTheme === "dark" || savedTheme === "light") {
  root.dataset.theme = savedTheme === "dark" ? "dark" : "";
}
function updateThemeButton() {
  const isDark = root.dataset.theme === "dark";
  themeToggle.textContent = isDark ? "☼" : "◐";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}
updateThemeButton();
themeToggle.addEventListener("click", () => {
  const isDark = root.dataset.theme === "dark";
  if (isDark) {
    delete root.dataset.theme;
    localStorage.setItem("jeanne-portfolio-theme", "light");
  } else {
    root.dataset.theme = "dark";
    localStorage.setItem("jeanne-portfolio-theme", "dark");
  }
  updateThemeButton();
});

// Mobile navigation.
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "×" : "☰";
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

// Highlight the navigation item for the section currently in view.
const navLinks = [...mainNav.querySelectorAll("a")];
const sections = navLinks.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-25% 0px -60% 0px" });
  sections.forEach(section => observer.observe(section));
}

// Search and category filtering for project cards.
const projectSearch = document.getElementById("projectSearch");
const categoryFilter = document.getElementById("categoryFilter");
const projectCards = [...document.querySelectorAll(".project-card")];
const projectCount = document.getElementById("projectCount");
const noResults = document.getElementById("noResults");
function filterProjects() {
  const term = projectSearch.value.trim().toLowerCase();
  const category = categoryFilter.value;
  let visible = 0;
  projectCards.forEach(card => {
    const matchesText = `${card.dataset.search} ${card.textContent}`.toLowerCase().includes(term);
    const matchesCategory = category === "all" || card.dataset.category === category;
    const show = matchesText && matchesCategory;
    card.hidden = !show;
    if (show) visible++;
  });
  projectCount.textContent = String(visible).padStart(2, "0");
  noResults.hidden = visible > 0;
}
projectSearch.addEventListener("input", filterProjects);
categoryFilter.addEventListener("change", filterProjects);

// Project detail dialog.
const dialog = document.getElementById("projectDialog");
document.querySelectorAll(".project-details").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("dialogTitle").textContent = button.dataset.title;
    document.getElementById("dialogDescription").textContent = button.dataset.description;
    document.getElementById("dialogTech").textContent = button.dataset.tech;
    if (typeof dialog.showModal === "function") dialog.showModal();
  });
});
document.getElementById("dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

// The contact form uses mailto so it can work without a backend. It does not send
// directly from the website; configure a form service/backend for that behavior.
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");
contactForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("senderName").value.trim();
  const email = document.getElementById("senderEmail").value.trim();
  const subject = document.getElementById("senderSubject").value.trim();
  const message = document.getElementById("senderMessage").value.trim();
  if (!name || !email || !subject || !message) {
    formFeedback.textContent = "Please complete all required fields before preparing your email.";
    return;
  }
  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const mailto = `mailto:jeannemarieformales6@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  formFeedback.textContent = "Opening your email app. Review the message and press Send there.";
  window.location.href = mailto;
});
document.getElementById("year").textContent = new Date().getFullYear();

// CV buttons intentionally stay inactive until a real PDF has been added.
