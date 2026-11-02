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
      document.documentElement.classList.toggle("menu-open", open);
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

/* mobile CTA dock: shown once the hero is behind you, hidden again near the closing CTA and footer */
(function () {
  var dock = document.getElementById("dock");
  if (!dock || !("IntersectionObserver" in window)) return;
  var hero = document.querySelector(".hero"), seen = { hero: true, close: false, foot: false };
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { seen[e.target.getAttribute("data-dock")] = e.isIntersecting; });
    dock.classList.toggle("show", !seen.hero && !seen.close && !seen.foot);
  });
  [[hero, "hero"], [document.querySelector(".close"), "close"], [document.querySelector("footer"), "foot"]].forEach(function (p) {
    if (p[0]) { p[0].setAttribute("data-dock", p[1]); io.observe(p[0]); }
  });
})();

/* what matters: one pill is open at a time, the others fold to a slim strip */
(function () {
  var root = document.getElementById("wm");
  if (!root) return;
  var cards = [].slice.call(root.querySelectorAll(".wm-card"));
  function current() { for (var i = 0; i < cards.length; i++) if (cards[i].classList.contains("open")) return i; return 0; }
  function open(i, focus) {
    cards.forEach(function (c, k) {
      var on = k === i, tab = c.querySelector(".wm-tab");
      c.classList.toggle("open", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
      c.querySelector(".wm-panel").hidden = !on;
    });
    if (focus) cards[i].querySelector(".wm-tab").focus();
  }
  cards.forEach(function (c, i) { c.addEventListener("click", function () { if (!c.classList.contains("open")) open(i); }); });
  root.addEventListener("keydown", function (e) {
    var n = cards.length, i = current(), map = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 };
    if (!(e.key in map)) return;
    e.preventDefault(); open(Math.max(0, Math.min(n - 1, map[e.key])), true);
  });
  open(0);
})();
