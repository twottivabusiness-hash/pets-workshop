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
    function label() { if (toggle) toggle.textContent = film.paused ? 'PLAY FILM' : 'PAUSE FILM'; }
    film.addEventListener('play', label); film.addEventListener('pause', label); label();
    if (toggle) toggle.addEventListener('click', function () {
      if (film.paused) { var q = film.play(); if (q && q.catch) q.catch(function () {}); } else film.pause();
    });
  }

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
