/* ============================================================
   EDITORIAL EDITION — cursor.js
   INK TRACE: ink dot, vermilion ring, cobalt afterimages.
   Desktop pointer only. Disabled for touch and reduced motion.
   ============================================================ */
(function () {
  "use strict";

  const cursor = document.getElementById("cursor");
  const ring = cursor ? cursor.querySelector(".cursor__ring") : null;
  const dot = cursor ? cursor.querySelector(".cursor__dot") : null;
  const trails = cursor
    ? Array.prototype.slice.call(cursor.querySelectorAll(".cursor__trail"))
    : [];
  const rippleLayer = document.getElementById("cursor-ripples");

  if (!cursor || !ring || !dot) return;

  const finePointer = window.matchMedia("(pointer: fine)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hasHover = window.matchMedia("(hover: hover)");

  let enabled = false;
  let pressed = false;
  let rafId = null;
  let shown = false;

  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const dotPos = { x: pointer.x, y: pointer.y };
  const ringPos = { x: pointer.x, y: pointer.y };
  const trailPos = trails.map(function () {
    return { x: pointer.x, y: pointer.y };
  });

  function lerp(from, to, amount) {
    return from + (to - from) * amount;
  }

  function render() {
    dotPos.x = lerp(dotPos.x, pointer.x, 0.62);
    dotPos.y = lerp(dotPos.y, pointer.y, 0.62);
    ringPos.x = lerp(ringPos.x, pointer.x, 0.17);
    ringPos.y = lerp(ringPos.y, pointer.y, 0.17);

    dot.style.transform =
      "translate3d(" + dotPos.x.toFixed(2) + "px," + dotPos.y.toFixed(2) + "px,0)";
    ring.style.transform =
      "translate3d(" + ringPos.x.toFixed(2) + "px," + ringPos.y.toFixed(2) + "px,0)" +
      " scale(" + (pressed ? 0.86 : 1) + ")";

    // Cobalt afterimages follow the ring in a loose chain.
    let targetX = ringPos.x;
    let targetY = ringPos.y;
    trails.forEach(function (trail, index) {
      const pos = trailPos[index];
      pos.x = lerp(pos.x, targetX, 0.3 - index * 0.05);
      pos.y = lerp(pos.y, targetY, 0.3 - index * 0.05);
      trail.style.transform =
        "translate3d(" + pos.x.toFixed(2) + "px," + pos.y.toFixed(2) + "px,0)";
      targetX = pos.x;
      targetY = pos.y;
    });

    rafId = window.requestAnimationFrame(render);
  }

  function show() {
    shown = true;
    cursor.classList.remove("is-hidden");
  }

  function hide() {
    shown = false;
    cursor.classList.add("is-hidden");
  }

  function enable() {
    if (enabled) return;
    enabled = true;
    document.documentElement.classList.add("has-custom-cursor");
    pointer.x = window.innerWidth / 2;
    pointer.y = window.innerHeight / 2;
    dotPos.x = ringPos.x = pointer.x;
    dotPos.y = ringPos.y = pointer.y;
    trailPos.forEach(function (pos) {
      pos.x = pointer.x;
      pos.y = pointer.y;
    });
    show();
    if (!rafId) rafId = window.requestAnimationFrame(render);
  }

  function disable() {
    enabled = false;
    document.documentElement.classList.remove("has-custom-cursor");
    cursor.classList.remove("is-hover", "is-view", "is-down");
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function sync() {
    if (finePointer.matches && hasHover.matches && !reduceMotion.matches) {
      enable();
    } else {
      disable();
    }
  }

  /* ---------- pointer tracking ---------- */
  window.addEventListener(
    "pointermove",
    function (event) {
      if (!enabled || event.pointerType === "touch") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!shown) show();

      const target = event.target.closest(
        "a, button, [data-cursor], input, textarea, select, [role='button']"
      );
      const isView =
        target &&
        (target.getAttribute("data-cursor") === "view" ||
          target.classList.contains("project"));

      cursor.classList.toggle("is-view", Boolean(isView));
      cursor.classList.toggle("is-hover", Boolean(target) && !isView);
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerdown",
    function (event) {
      if (!enabled || event.pointerType === "touch" || event.button !== 0) return;
      pressed = true;
      cursor.classList.add("is-down");

      if (!rippleLayer || event.target.closest(".terminal")) return;
      const ripple = document.createElement("span");
      ripple.className = "cursor-ripple";
      ripple.style.left = event.clientX + "px";
      ripple.style.top = event.clientY + "px";
      rippleLayer.appendChild(ripple);
      ripple.addEventListener("animationend", function () {
        ripple.remove();
      });
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerup",
    function () {
      pressed = false;
      cursor.classList.remove("is-down");
    },
    { passive: true }
  );

  document.addEventListener("mouseleave", function () {
    if (enabled) hide();
  });

  document.addEventListener("mouseenter", function () {
    if (enabled) show();
  });

  window.addEventListener("blur", function () {
    if (enabled) hide();
  });

  window.addEventListener("scroll", function () {
    if (!enabled) return;
    cursor.classList.remove("is-hover", "is-view");
  }, { passive: true });

  // Keep the custom cursor from appearing above a native one on touch devices.
  window.addEventListener("touchstart", disable, { passive: true });

  if (typeof finePointer.addEventListener === "function") {
    finePointer.addEventListener("change", sync);
    reduceMotion.addEventListener("change", sync);
    hasHover.addEventListener("change", sync);
  }

  sync();
})();
