/* ============================================================
   EDITORIAL EDITION — terminal.js
   A frontend-only simulated shell. No system commands are run,
   no data leaves the page. Commands answer from static copy.
   ============================================================ */
(function () {
  "use strict";

  const terminal = document.getElementById("terminal");
  const panel = terminal ? terminal.querySelector(".terminal__panel") : null;
  const log = document.getElementById("terminal-log");
  const form = document.getElementById("terminal-form");
  const input = document.getElementById("terminal-input");
  const closeButtons = terminal
    ? Array.prototype.slice.call(terminal.querySelectorAll("[data-terminal-close]"))
    : [];
  const openers = Array.prototype.slice.call(
    document.querySelectorAll("#terminal-trigger, [data-terminal-open], #ascii-easter-egg")
  );

  if (!terminal || !panel || !log || !form || !input) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let isOpen = false;
  let lastFocus = null;
  let closeTimer = null;
  let eggShown = false;
  const history = [];
  let historyIndex = 0;

  /* ---------- output helpers ---------- */
  function line(text, className) {
    const el = document.createElement("div");
    el.className = "terminal__line " + (className || "term-out");
    el.textContent = text;
    log.appendChild(el);
    return el;
  }

  function gap() {
    const el = document.createElement("div");
    el.className = "term-gap";
    log.appendChild(el);
  }

  function echoCommand(text) {
    const el = document.createElement("div");
    el.className = "terminal__line term-cmd";
    const prompt = document.createElement("span");
    prompt.className = "term-prompt";
    prompt.textContent = "vansh@portfolio:~$ ";
    el.appendChild(prompt);
    el.appendChild(document.createTextNode(text));
    log.appendChild(el);
  }

  function scrollLog() {
    log.scrollTop = log.scrollHeight;
  }

  /* ---------- command data ---------- */
  const commands = {
    help: function () {
      line("Available commands", "term-accent");
      gap();
      line("  help       list this index");
      line("  whoami     identity and current focus");
      line("  about      academic and professional background");
      line("  skills     technical stack");
      line("  projects   selected work");
      line("  contact    email, LinkedIn, GitHub");
      line("  resume     résumé download location");
      line("  clear      clear the screen");
      line("  exit       close the terminal");
      gap();
      line("Tip: press Escape or Ctrl + ` to close.", "term-muted");
    },

    whoami: function () {
      line("Vansh Sheth", "term-accent");
      line("Cybersecurity student / aspiring SOC analyst");
      line("Gujarat, India — IST (UTC+05:30)");
      gap();
      line("Focus: security operations, vulnerability assessment, network security.");
    },

    about: function () {
      line("A little about me", "term-accent");
      gap();
      line("B.Tech, Computer Science & Cybersecurity — Parul University (2024 – present).");
      line("Diploma, Computer Science & Engineering — ITM (SLS) Baroda University (2021 – 2024).");
      gap();
      line("Interned in cybersecurity at Redynox Solutions and full-stack development");
      line("at V-ex Tech Solutions. I care about how systems work, where they fail,");
      line("and how to make them more secure.");
    },

    skills: function () {
      line("Technical stack", "term-accent");
      gap();
      line("Cybersecurity   Vulnerability assessment · basic penetration testing · OWASP Top 10");
      line("                incident documentation · secure coding · network security fundamentals");
      line("Tools           Wireshark (basic) · Burp Suite (basic) · Linux CLI · Git · GitHub");
      line("Networking      TCP/IP · HTTP/HTTPS · DNS · firewall concepts");
      line("Development     HTML5 · CSS3 · JavaScript · React.js · Node.js · Express.js");
      line("Databases       MongoDB · MySQL");
    },

    projects: function () {
      line("Selected work", "term-accent");
      gap();
      line("01  B-MADS — Browser-Based Malware Analysis & Detection System (2026)");
      line("    Python · JavaScript · Flask · YARA");
      line("02  Garage Stock Management System (2026)");
      line("03  Savior — AI-Powered Study Assistant (2025)");
      line("04  Smart Cab Point — real-time cab booking platform (2024)");
      gap();
      line("Repositories: github.com/once0626", "term-key");
    },

    contact: function () {
      line("Let's connect", "term-accent");
      gap();
      line("Email     vanshksheth@gmail.com");
      line("LinkedIn  linkedin.com/in/vansh-sheth-879179265");
      line("GitHub    github.com/once0626");
      gap();
      line("Open to internships and entry-level SOC / security roles.", "term-muted");
    },

    resume: function () {
      line("Résumé", "term-accent");
      line("Target file: assets/VANSH_CV.pdf");
      gap();
      line("Use the DOWNLOAD RÉSUMÉ button in the hero, the RÉSUMÉ link in the");
      line("navigation, or the résumé row in the contact section.", "term-muted");
    },

    clear: function () {
      log.textContent = "";
      line("Screen cleared. Type help to begin again.", "term-muted");
    },

    exit: function () {
      line("Closing session. The paper remains.", "term-muted");
      window.setTimeout(close, reduceMotion.matches ? 0 : 220);
    },

    ls: function () {
      line("about/   stack/   method/   work/   record/   certs/   contact/");
    },

    sudo: function () {
      line("Permission denied. Nice try.", "term-error");
      line("This terminal reads static portfolio copy — nothing else.", "term-muted");
    }
  };

  function runCommand(raw) {
    const text = raw.trim();
    const key = text.toLowerCase();

    echoCommand(text);

    if (!key) {
      line("");
      scrollLog();
      return;
    }

    if (commands[key]) {
      commands[key]();
    } else if (key === "date") {
      line(new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST");
    } else if (key === "echo") {
      line("");
    } else {
      line('command not found: "' + text + '" — type "help" for the index.', "term-error");
    }

    gap();
    scrollLog();
  }

  /* ---------- open / close ---------- */
  function buildWelcome() {
    if (log.childElementCount > 0) return;
    line("INK TRACE / SECURE SHELL — simulation only", "term-accent");
    line("No system access. No network calls. Just a small hidden room.", "term-muted");
    gap();
    line('Type "help" and press Enter.');
    gap();
  }

  function open(withEgg) {
    if (isOpen) return;
    isOpen = true;
    lastFocus = document.activeElement;
    window.clearTimeout(closeTimer);
    terminal.hidden = false;
    document.body.classList.add("terminal-open");
    buildWelcome();

    if (withEgg && !eggShown) {
      eggShown = true;
      gap();
      line("SIGNAL FOUND — you clicked the spider.", "term-accent");
      line("Easter egg 01 / 01 unlocked. Curiosity is a security control.", "term-key");
      gap();
      line('Try "whoami", "skills", or "projects".');
      gap();
    }

    window.requestAnimationFrame(function () {
      terminal.classList.add("is-open");
      input.focus();
      scrollLog();
    });
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    terminal.classList.remove("is-open");
    document.body.classList.remove("terminal-open");

    function finish() {
      terminal.hidden = true;
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
      lastFocus = null;
    }

    if (reduceMotion.matches) {
      finish();
    } else {
      closeTimer = window.setTimeout(finish, 300);
    }
  }

  /* ---------- events ---------- */
  openers.forEach(function (opener) {
    opener.addEventListener("click", function () {
      open(opener.id === "ascii-easter-egg");
    });
  });

  closeButtons.forEach(function (button) {
    button.addEventListener("click", close);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const value = input.value;
    input.value = "";
    if (value.trim()) {
      history.push(value.trim());
      if (history.length > 30) history.shift();
    }
    historyIndex = history.length;
    runCommand(value);
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex] || "";
      input.setSelectionRange(input.value.length, input.value.length);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!history.length) return;
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] || "";
    }
  });

  document.addEventListener("keydown", function (event) {
    const shortcut =
      event.key === "`" && (event.ctrlKey || event.metaKey) && !event.altKey;

    if (shortcut) {
      event.preventDefault();
      if (isOpen) close();
      else open(false);
      return;
    }

    if (!isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    // Focus trap
    if (event.key === "Tab") {
      const focusables = Array.prototype.slice
        .call(
          panel.querySelectorAll(
            'button, input, a[href], [tabindex]:not([tabindex="-1"])'
          )
        )
        .filter(function (el) {
          return !el.disabled && el.offsetParent !== null;
        });

      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Keep focus in the panel if a click lands on empty panel chrome.
  panel.addEventListener("mousedown", function (event) {
    if (event.target === panel) {
      event.preventDefault();
      input.focus();
    }
  });

  terminal.addEventListener("click", function (event) {
    if (event.target === terminal) {
      input.focus();
    }
  });

  // Expose a small read-only hook for the illustrations.
  window.portfolioTerminal = { open: open };
})();
