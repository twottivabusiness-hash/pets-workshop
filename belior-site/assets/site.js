(function () {
  var header = document.querySelector('.site-header');
  var btn = document.querySelector('.menu-btn');
  var panel = document.querySelector('.menu-panel');

  function onScroll() {
    if (header) header.classList.toggle('solid', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (btn && panel) {
    btn.addEventListener('click', function () {
      var open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'CLOSE' : 'MENU';
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { btn.click(); btn.focus(); }
    });
  }

  // Hero film: muted autoplay, paused for reduced motion, toggle for everyone.
  var film = document.querySelector('.film video');
  var toggle = document.querySelector('.film-toggle');
  if (film) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) film.pause(); else { var p = film.play(); if (p && p.catch) p.catch(function () {}); }
    function label() {
      if (!toggle) return;
      toggle.innerHTML = film.paused ? '<span aria-hidden="true">&#9654;</span>' : '<span aria-hidden="true">II</span>';
      toggle.setAttribute('aria-label', film.paused ? '영상 재생' : '영상 일시정지');
    }
    film.addEventListener('play', label); film.addEventListener('pause', label); label();
    if (toggle) toggle.addEventListener('click', function () {
      if (film.paused) { var q = film.play(); if (q && q.catch) q.catch(function () {}); } else film.pause();
    });
  }

  // Page turn: close on the destination's symbol, then navigate.
  var curtainEl = document.querySelector('.curtain');
  var pages = window.BELIOR_PAGES || {};
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || !curtainEl || reduceMotion) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target) return;
    var href = a.getAttribute('href');
    var m = href.match(/^([a-z0-9-]+)\.html(#[\w.~-]*)?$/i);
    if (!m) return;
    var info = pages[m[1]] || { label: 'BELiOR', mark: 'assets/img/mono-ivory.png', round: false };
    e.preventDefault();
    curtainEl.querySelector('.c-mark').src = info.mark;
    curtainEl.querySelector('.c-label').textContent = info.label;
    curtainEl.classList.toggle('round', !!info.round);
    curtainEl.classList.remove('leaving'); void curtainEl.offsetWidth; curtainEl.classList.add('leaving');
    setTimeout(function () { window.location.href = href; }, 700);
  });
  window.addEventListener('pageshow', function (e) { if (e.persisted && curtainEl) curtainEl.classList.remove('leaving'); });

  // Scenes settle as they come into view.
  var targets = document.querySelectorAll('.scene, .house, .world');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('seen'); io.unobserve(en.target); } });
    }, { threshold: 0.2 });
    targets.forEach(function (t) { io.observe(t); });
  } else targets.forEach(function (t) { t.classList.add('seen'); });

  // World carousel: dots follow the swipe, and take you to a world.
  document.querySelectorAll('.carousel').forEach(function (car) {
    var track = car.querySelector('.track'), dotsEl = car.querySelectorAll('.dot');
    function mark() {
      var i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
      dotsEl.forEach(function (d, k) { d.setAttribute('aria-current', String(k === i)); });
    }
    dotsEl.forEach(function (d, k) {
      d.addEventListener('click', function () { track.scrollTo({ left: k * track.clientWidth, behavior: 'smooth' }); });
    });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(mark); }, { passive: true });
    mark();
  });

  // Inquiry forms: nothing is sent from the page. The form composes a message to copy.
  document.querySelectorAll('form[data-inquiry]').forEach(function (form) {
    var out = document.getElementById(form.getAttribute('data-inquiry'));
    var pre = out && out.querySelector('pre');
    var copyBtn = out && out.querySelector('[data-copy]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var lines = [form.getAttribute('data-title') || 'BELiOR 문의', ''];
      form.querySelectorAll('[name]').forEach(function (el) {
        var lab = form.querySelector('label[for="' + el.id + '"]');
        var v = (el.value || '').trim();
        lines.push((lab ? lab.textContent : el.name) + ': ' + (v || '확인 필요'));
      });
      pre.textContent = lines.join('\n');
      out.hidden = false;
      out.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    if (copyBtn) copyBtn.addEventListener('click', function () {
      var text = pre.textContent;
      function select() {
        var r = document.createRange(); r.selectNodeContents(pre);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        copyBtn.textContent = '선택됨 · 직접 복사하세요';
      }
      try {
        navigator.clipboard.writeText(text).then(function () { copyBtn.textContent = '복사됨'; }, select);
      } catch (err) { select(); }
    });
  });
})();
