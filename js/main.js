/* ============================================================
   EDITORIAL EDITION — main.js
   Navigation, scrollspy, reveals, magnetic buttons, clock, copy.
   ============================================================ */
(function () {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");

  /* ---------- year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- mobile navigation ---------- */
  const nav = document.getElementById("site-nav");
  const navToggle = document.getElementById("nav-toggle");
  const header = document.getElementById("site-header");
  const main = document.getElementById("main");
  const footer = document.querySelector(".site-footer");

  function setPageInert(inert) {
    if (main) main.inert = inert;
    if (footer) footer.inert = inert;
  }

  function setNav(open) {
    if (!nav || !navToggle) return;
    const isMobile = window.innerWidth <= 1024;
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", open);
    setPageInert(open && isMobile);

    if (open && isMobile) {
      const firstLink = nav.querySelector("a");
      if (firstLink) firstLink.focus();
    } else if (!open && nav.contains(document.activeElement)) {
      navToggle.focus();
    }
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });
  }

  if (nav) {
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });
  }

  document.addEventListener("click", function (event) {
    if (!nav || !nav.classList.contains("is-open")) return;
    if (nav.contains(event.target)) return;
    if (navToggle && navToggle.contains(event.target)) return;
    setNav(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav && nav.classList.contains("is-open")) {
      setNav(false);
      if (navToggle) navToggle.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1024) setNav(false);
  });

  /* ---------- scroll progress ---------- */
  const progress = document.querySelector("#scroll-progress span");
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (progress) progress.style.width = (value * 100).toFixed(2) + "%";
      updateActiveSection();
      ticking = false;
    });
  }

  /* ---------- scrollspy ---------- */
  const sections = Array.prototype.slice.call(
    document.querySelectorAll("[data-section]")
  );
  const navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav__link[data-nav]")
  );
  let activeId = "";

  function updateActiveSection() {
    if (!sections.length) return;
    const line = window.scrollY + (header ? header.offsetHeight : 72) + 140;
    let current = null;

    sections.forEach(function (section) {
      if (section.offsetTop <= line) {
        current = section.getAttribute("data-section");
      }
    });

    if (current === activeId) return;
    activeId = current || "";
    navLinks.forEach(function (link) {
      const isActive = Boolean(current) && link.getAttribute("data-nav") === current;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- reveal ---------- */
  const revealItems = document.querySelectorAll(".reveal");

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealItems.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (finePointer.matches && !reduceMotion.matches) {
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      const max = 5;

      el.addEventListener("pointermove", function (event) {
        const rect = el.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        el.style.transform =
          "translate(" + (x * max).toFixed(2) + "px, " + (y * max).toFixed(2) + "px)";
      });

      el.addEventListener("pointerleave", function () {
        el.style.transform = "";
      });

      el.addEventListener("blur", function () {
        el.style.transform = "";
      });
    });
  }

  /* ---------- copy email ---------- */
  const copyBtn = document.getElementById("copy-email");
  const copyStatus = document.getElementById("copy-status");

  function legacyCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  if (copyBtn) {
    let resetTimer = null;

    copyBtn.addEventListener("click", function () {
      const email = copyBtn.getAttribute("data-copy") || "";

      function confirmCopy(ok) {
        const label = copyBtn.querySelector(".copy-btn__label");
        if (label) label.textContent = ok ? "Copied" : "Copy failed";
        copyBtn.classList.toggle("is-copied", ok);
        if (copyStatus) {
          copyStatus.textContent = ok
            ? "Email copied — " + email
            : "Could not copy. Please select the address manually.";
        }
        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(function () {
          if (label) label.textContent = "Copy";
          copyBtn.classList.remove("is-copied");
          if (copyStatus) copyStatus.textContent = "";
        }, 2600);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(
          function () { confirmCopy(true); },
          function () { confirmCopy(legacyCopy(email)); }
        );
      } else {
        confirmCopy(legacyCopy(email));
      }
    });
  }

  /* ---------- IST clock ---------- */
  const clock = document.getElementById("ist-clock");
  if (clock) {
    let formatter;
    try {
      formatter = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
      });
    } catch (err) {
      formatter = null;
    }

    function tick() {
      if (formatter) {
        clock.textContent = formatter.format(new Date());
      } else {
        clock.textContent = new Date().toLocaleTimeString();
      }
    }

    tick();
    window.setInterval(tick, 1000);
  }

  /* ---------- reduced-motion listener ---------- */
  if (typeof reduceMotion.addEventListener === "function") {
    reduceMotion.addEventListener("change", function (event) {
      root.classList.toggle("reduced-motion", event.matches);
    });
  }
})();
