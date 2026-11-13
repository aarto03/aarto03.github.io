/* =========================================================
   1. TAB NAVIGATION
   Shows one section at a time. Each nav link's href (#projects,
   #contact, etc.) must match a <section id="..."> in index.html.
   ========================================================= */
const views = document.querySelectorAll(".view");
const navLinks = document.querySelectorAll(".nav a");

function showView(id) {
  // Use the given id, else the URL hash, else default to "home"
  id = id || window.location.hash.replace("#", "") || "home";
  if (!document.getElementById(id)) id = "home";

  views.forEach(view => view.classList.toggle("active", view.id === id));
  navLinks.forEach(link => link.classList.toggle("active", link.dataset.view === id));

  window.scrollTo({ top: 0 });
}

// Handle back/forward buttons and typed URLs
window.addEventListener("hashchange", () => showView());

// Handle clicks on any in-page link (nav tabs, logo, hero buttons)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    const id = link.getAttribute("href").slice(1);
    if (!id) return; // placeholder links like href="#" do nothing
    try { history.replaceState(null, "", "#" + id); } catch (e) {}
    showView(id);
  });
});

showView();

/* =========================================================
   2. CAROUSELS (Projects & Certifications)
   Automatically works for any number of slides. Add or remove
   <article class="slide"> blocks in index.html and the arrows,
   dots and counter update on their own.
   ========================================================= */
document.querySelectorAll("[data-carousel]").forEach(carousel => {
  const slides = carousel.querySelectorAll(".slide");
  const dotsBox = carousel.querySelector(".dots");
  const counter = carousel.querySelector(".counter");
  const prevBtn = carousel.querySelector(".prev");
  const nextBtn = carousel.querySelector(".next");
  let current = 0;

  // Build one dot per slide
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("aria-label", "Go to item " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsBox.appendChild(dot);
  });
  const dots = dotsBox.querySelectorAll(".dot");

  function goTo(index) {
    // Wrap around at both ends
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    counter.textContent = (current + 1) + " / " + slides.length;
  }

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  // Left/right arrow keys work on whichever carousel is visible
  document.addEventListener("keydown", event => {
    if (!carousel.closest(".view").classList.contains("active")) return;
    if (event.key === "ArrowLeft") goTo(current - 1);
    if (event.key === "ArrowRight") goTo(current + 1);
  });

  // Swipe left/right on touch screens (phones and tablets)
  let startX = null, startY = null;
  carousel.addEventListener("touchstart", event => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  }, { passive: true });
  carousel.addEventListener("touchend", event => {
    if (startX === null) return;
    const dx = event.changedTouches[0].clientX - startX;
    const dy = event.changedTouches[0].clientY - startY;
    startX = startY = null;
    // Only count mostly-horizontal swipes so normal scrolling still works
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) goTo(current + (dx < 0 ? 1 : -1));
  });

  goTo(0);
});

/* =========================================================
   3. CATEGORY FILTERS (Skills & Tools on the Experience tab)
   Each filter button's data-filter value is matched against the
   data-category of the items in the same group. "all" shows
   everything. See the comment in index.html for how to add more.
   ========================================================= */
document.querySelectorAll("[data-filter-group]").forEach(group => {
  const buttons = group.querySelectorAll(".filter-btn");
  const items = group.querySelectorAll("[data-category]");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      buttons.forEach(b => b.classList.toggle("active", b === button));
      items.forEach(item => {
        item.hidden = !(filter === "all" || item.dataset.category === filter);
      });
    });
  });
});

/* =========================================================
   4. FOOTER YEAR (updates itself)
   ========================================================= */
document.getElementById("year").textContent = new Date().getFullYear();