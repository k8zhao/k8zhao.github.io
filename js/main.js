/* ==========================================================================
   main.js
   Owns: scroll-triggered entrance reveals via a single IntersectionObserver.
   CSS owns the actual animation — this file only toggles the `.visible` class.
   Must NOT contain styling values; all visuals live in the CSS layer.
   ========================================================================== */

(function () {
  "use strict";

  var revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  // Respect users who prefer reduced motion: reveal everything immediately.
  var prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
    return;
  }

  // A single shared observer toggles `.visible` as elements enter the viewport.
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.1,
    },
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();
