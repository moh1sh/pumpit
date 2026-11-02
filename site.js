/* Shared behaviour: mobile menu, scroll reveals, tagline word reveal. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* mobile menu */
  var toggle = document.getElementById("navToggle"), menu = document.getElementById("menu");
  if (toggle && menu) {
    function setMenu(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.classList.toggle("open", open);
      menu.setAttribute("aria-hidden", open ? "false" : "true");
      if (open) { menu.removeAttribute("inert"); } else { menu.setAttribute("inert", ""); }
      document.body.style.overflow = open ? "hidden" : "";
    }
    setMenu(false);
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); toggle.focus(); } });
    window.matchMedia("(min-width: 768px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });
  }

  /* scroll reveals: once per element */
  var rv = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: .15 });
    [].forEach.call(rv, function (el) { io.observe(el); });
  } else { [].forEach.call(rv, function (el) { el.classList.add("in"); }); }

  /* tagline: words go from muted to full colour one at a time as the section scrolls through */
  var tag = document.querySelector("[data-tagline]");
  if (tag) {
    var words = tag.textContent.trim().split(/\s+/);
    tag.setAttribute("aria-label", words.join(" "));
    tag.textContent = "";
    var spans = words.map(function (w, i) {
      var s = document.createElement("span"); s.className = "w"; s.setAttribute("aria-hidden", "true");
      s.textContent = w; tag.appendChild(s); if (i < words.length - 1) tag.appendChild(document.createTextNode(" "));
      return s;
    });
    if (reduce) { spans.forEach(function (s) { s.classList.add("on"); }); }
    else {
      var queued = false;
      function update() {
        queued = false;
        var r = tag.getBoundingClientRect(), vh = window.innerHeight;
        var p = (vh * 0.8 - r.top) / (vh * 0.35 + r.height);
        var n = Math.max(0, Math.min(spans.length, Math.round(p * spans.length)));
        spans.forEach(function (s, i) { s.classList.toggle("on", i < n); });
      }
      function onScroll() { if (!queued) { queued = true; requestAnimationFrame(update); } }
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      update();
    }
  }
})();
