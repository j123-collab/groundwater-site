(function () {
  'use strict';

  var currentLang = 'en';
  var langButtons = document.querySelectorAll('#langToggle .lang-btn');
  var contactForm = document.getElementById('contactForm');
  var successBox = document.getElementById('formSuccess');

  // ---- Dot navigation — smooth scroll to section ----
  var dots = Array.from(document.querySelectorAll('.nav-dot'));
  var strata = Array.from(document.querySelectorAll('.stratum'));

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var index = parseInt(dot.getAttribute('data-index'), 10);
      if (strata[index]) strata[index].scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Highlight dot matching the most-visible section
  window.addEventListener('scroll', function () {
    var mid = window.scrollY + window.innerHeight * 0.5;
    var closest = 0;
    var closestDist = Infinity;
    strata.forEach(function (el, i) {
      var dist = Math.abs(el.offsetTop + el.offsetHeight * 0.5 - mid);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });
    dots.forEach(function (d, i) { d.classList.toggle('active', i === closest); });
  }, { passive: true });

  // Hero "About" / "Contact" buttons
  document.querySelectorAll('[data-goto]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var index = parseInt(btn.getAttribute('data-goto'), 10);
      if (strata[index]) strata[index].scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ---- Language Toggle ----
  function setLanguage(lang) {
    if (!translations || !translations[lang]) return;
    currentLang = lang;
    var t = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.innerHTML = t[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) el.placeholder = t[key];
    });
    langButtons.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    document.title = lang === 'sv'
      ? 'Maxilium Grundvatten — Strategiska grundvattenreserver'
      : 'Maxilium Groundwater — Strategic Groundwater Reserves';
  }

  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lang = btn.getAttribute('data-lang');
      if (lang) setLanguage(lang);
    });
  });

  // ---- Contact Form ----
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      contactForm.querySelectorAll('.form-error').forEach(function (el) { el.classList.remove('visible'); });
      contactForm.querySelectorAll('.form-input').forEach(function (el) { el.classList.remove('error'); });

      var nameInput = contactForm.querySelector('#formName');
      if (!nameInput.value.trim()) {
        valid = false;
        nameInput.classList.add('error');
        nameInput.parentElement.querySelector('.form-error').classList.add('visible');
      }
      var orgInput = contactForm.querySelector('#formOrg');
      if (!orgInput.value.trim()) {
        valid = false;
        orgInput.classList.add('error');
        orgInput.parentElement.querySelector('.form-error').classList.add('visible');
      }
      var emailInput = contactForm.querySelector('#formEmail');
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
        valid = false;
        emailInput.classList.add('error');
        emailInput.parentElement.querySelector('.form-error').classList.add('visible');
      }
      if (valid) {
        contactForm.querySelectorAll('.form-row, .form-group--full, .form-submit').forEach(function (el) {
          el.style.display = 'none';
        });
        if (successBox) successBox.classList.add('visible');
      }
    });
  }

  setLanguage('en');


  // ---- Country Cycling ----
  var mapCountries = ['se', 'no', 'fi'];
  var activeCountry = 0;
  var mapSvg = document.querySelector('.hero-map-svg');

  function cycleCountry() {
    mapCountries.forEach(function (c) { mapSvg.classList.remove('highlight-' + c); });
    mapSvg.classList.add('highlight-' + mapCountries[activeCountry]);
    activeCountry = (activeCountry + 1) % mapCountries.length;
  }
  if (mapSvg) {
    cycleCountry();
    setInterval(cycleCountry, 4000);
  }

  // ---- Bubble Generation ----
  var bubbleData = [
    { left: '5%',  size: 12, dur: 14, delay: 0   },
    { left: '15%', size: 8,  dur: 18, delay: 2   },
    { left: '25%', size: 6,  dur: 16, delay: 4   },
    { left: '35%', size: 10, dur: 20, delay: 1   },
    { left: '45%', size: 14, dur: 15, delay: 3   },
    { left: '55%', size: 7,  dur: 22, delay: 5   },
    { left: '65%', size: 11, dur: 17, delay: 0.5 },
    { left: '72%', size: 5,  dur: 19, delay: 6   },
    { left: '80%', size: 9,  dur: 21, delay: 2.5 },
    { left: '90%', size: 13, dur: 16, delay: 4.5 },
    { left: '10%', size: 6,  dur: 23, delay: 7   },
    { left: '40%', size: 8,  dur: 19, delay: 8   },
    { left: '60%', size: 10, dur: 14, delay: 1.5 },
    { left: '85%', size: 7,  dur: 24, delay: 3.5 },
    { left: '50%', size: 5,  dur: 20, delay: 9   }
  ];
  var bubblesContainer = document.querySelector('.bubbles');
  if (bubblesContainer) {
    bubbleData.forEach(function (b) {
      var el = document.createElement('div');
      el.className = 'bubble';
      el.style.left = b.left;
      el.style.width = b.size + 'px';
      el.style.height = b.size + 'px';
      el.style.animationDuration = b.dur + 's';
      el.style.animationDelay = b.delay + 's';
      bubblesContainer.appendChild(el);
    });
  }

  // ---- Mouse-Reactive Wave Animation ----
  var wavePaths = Array.from(document.querySelectorAll('.wave-layer'));
  var layers = [
    { baseY: 50, amp: 7,  lift: 6,  speed: 0.25, phase: 0 },
    { baseY: 58, amp: 8,  lift: 9,  speed: 0.35, phase: 0.8 },
    { baseY: 66, amp: 6,  lift: 12, speed: 0.45, phase: 1.6 },
    { baseY: 74, amp: 7,  lift: 16, speed: 0.3,  phase: 2.4 },
    { baseY: 82, amp: 5,  lift: 20, speed: 0.5,  phase: 3.2 },
    { baseY: 90, amp: 4,  lift: 24, speed: 0.38, phase: 4.0 }
  ];

  var mouseX = 0.5;
  var smoothX = 0.5;
  var NUM_POINTS = 24;
  var W = window.innerWidth;
  var waveSvg = waveOverlay ? waveOverlay.querySelector('svg') : null;

  function updateWaveWidth() {
    W = window.innerWidth;
    if (waveSvg) waveSvg.setAttribute('viewBox', '0 0 ' + W + ' 140');
  }
  updateWaveWidth();
  window.addEventListener('resize', updateWaveWidth);

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX / window.innerWidth;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function getPoints(layer, time) {
    var pts = [];
    for (var i = 0; i <= NUM_POINTS; i++) {
      var t = i / NUM_POINTS;
      var x = t * W;
      var chop = 1 - t * 0.35;
      var y = layer.baseY
        + Math.sin(time * layer.speed + t * Math.PI * 6 + layer.phase) * layer.amp
        + Math.sin(time * layer.speed * 0.7 + t * Math.PI * 10 + layer.phase * 1.5) * layer.amp * 0.5 * chop
        + Math.sin(time * layer.speed * 1.3 + t * Math.PI * 14 + layer.phase * 0.8) * layer.amp * 0.35 * chop
        + Math.sin(time * layer.speed * 1.8 + t * Math.PI * 20 + layer.phase * 2) * layer.amp * 0.15 * chop;
      var dist = t - smoothX;
      var influence = Math.exp(-dist * dist * 12);
      y -= influence * layer.lift;
      pts.push([x, y]);
    }
    return pts;
  }

  function buildSmoothPath(pts) {
    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[Math.max(i - 1, 0)];
      var p1 = pts[i];
      var p2 = pts[i + 1];
      var p3 = pts[Math.min(i + 2, pts.length - 1)];
      var cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      var cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      var cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      var cp2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ' C' + cp1x.toFixed(1) + ' ' + cp1y.toFixed(1)
         + ' ' + cp2x.toFixed(1) + ' ' + cp2y.toFixed(1)
         + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    d += ' V140 H0Z';
    return d;
  }

  function animateWaves(time) {
    var t = time * 0.001;
    smoothX = lerp(smoothX, mouseX, 0.06);
    for (var i = 0; i < wavePaths.length; i++) {
      if (wavePaths[i]) {
        var pts = getPoints(layers[i], t);
        wavePaths[i].setAttribute('d', buildSmoothPath(pts));
      }
    }
    requestAnimationFrame(animateWaves);
  }
  requestAnimationFrame(animateWaves);
})();
