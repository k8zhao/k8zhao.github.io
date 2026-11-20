(function () {
  "use strict";

  document.querySelectorAll(".contextual-preview").forEach(function (preview) {
    var text = preview.querySelector(".contextual-preview__text");
    var prompt = text.textContent;
    var frame = 0;

    function reset() {
      cancelAnimationFrame(frame);
      text.textContent = prompt;
    }

    preview.addEventListener("animationstart", function (event) {
      if (event.animationName !== "copilot-icon-bounce") return;

      reset();
      var duration = parseFloat(
        getComputedStyle(preview).getPropertyValue("--duration-copilot-type"),
      );
      if (!Number.isFinite(duration) || duration < 0) {
        console.error("Invalid --duration-copilot-type for project preview.");
        return;
      }
      if (duration === 0) return;

      var start = performance.now();
      text.textContent = "";

      function type(now) {
        var count = Math.min(
          prompt.length,
          Math.max(0, Math.floor(((now - start) / duration) * prompt.length)),
        );
        text.textContent = prompt.slice(0, count);
        if (count < prompt.length) frame = requestAnimationFrame(type);
      }

      frame = requestAnimationFrame(type);
    });

    preview.addEventListener("animationcancel", function (event) {
      if (event.animationName === "copilot-icon-bounce") reset();
    });
  });

  document.querySelectorAll(".edge-preview").forEach(function (preview) {
    var wheel = preview.querySelector(".edge-preview__wheel");
    var templates = Array.from(wheel.children);
    var count = Number(
      getComputedStyle(preview).getPropertyValue("--edge-carousel-count"),
    );
    if (
      !templates.length ||
      !Number.isInteger(count) ||
      count <= 0 ||
      count % templates.length !== 0
    ) {
      console.error("Invalid carousel card count for Copilot in Edge preview.");
      return;
    }

    var cards = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var orbit = document.createElement("span");
      orbit.className = "edge-preview__orbit";
      orbit.style.setProperty("--i", i);
      var card = templates[i % templates.length].cloneNode(true);
      orbit.appendChild(card);
      cards.appendChild(orbit);
    }
    wheel.replaceChildren(cards);
    Promise.all(
      Array.from(wheel.querySelectorAll("img"), function (image) {
        return image.decode();
      }),
    ).then(
      function () {
        preview.setAttribute("data-carousel-ready", "");
      },
      function (error) {
        console.error("Could not load the Copilot in Edge carousel artwork.", error);
      },
    );
  });
})();
