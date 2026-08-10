// MR Technology — Presentation Card Animations
document.addEventListener('DOMContentLoaded', () => {

  // Intersection Observer for reveal animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(el => {
      if (el.isIntersecting) {
        el.target.classList.add('visible');
        observer.unobserve(el.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.card, .stat-card, .service-item, .partner-card, .contact-section')
    .forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
      observer.observe(el);
    });

  document.addEventListener('scroll', () => {}, { passive: true });

  // Animate skill bars on scroll
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
          bar.style.animationDelay = `${i * 0.12}s`;
          bar.style.animationPlayState = 'running';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skills-grid').forEach(g => {
    g.querySelectorAll('.skill-fill').forEach(b => {
      b.style.animationPlayState = 'paused';
    });
    skillObserver.observe(g);
  });

  // Visible class helper
  const style = document.createElement('style');
  style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  // Stagger stats
  document.querySelectorAll('.stat-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
  });

  // Counter animation for stats
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent;
      const num = parseFloat(text.replace(/[^0-9.]/g, ''));
      if (isNaN(num)) return;
      const prefix = text.match(/^[^0-9]*/)?.[0] || '';
      const suffix = text.match(/[^0-9.]+$/)?.[0] || '';
      let start = 0; const duration = 1200;
      const step = (ts) => {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - prog, 3);
        el.textContent = prefix + Math.floor(ease * num) + suffix;
        if (prog < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

  // ============================================
  // CINEMATIC NAVIGATION
  // ============================================

  // Brand color per section (full-screen flash color)
  const SECTION_COLORS = {
    '#it-section':    'rgba(0, 174, 239, 0.55)',
    '#ae-section':    'rgba(0, 230, 118, 0.55)',
    '#sat-section':   'rgba(176, 144, 255, 0.55)',
    '#ciber-section': 'rgba(227, 24, 55, 0.55)',
    '#ia-section':    'rgba(255, 0, 127, 0.55)',
    '#af-section':    'rgba(0, 139, 139, 0.55)',
    '#mr-presentation': 'rgba(0, 139, 139, 0.55)',
  };

  // ── Overlay: covers the entire screen ────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'nav-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0;
    opacity: 0; pointer-events: none; z-index: 99999;
    transition: opacity 0.3s ease;
    display: flex; align-items: center; justify-content: center;
  `;
  document.body.appendChild(overlay);

  // ── Historic logo: floating watermark for #ecosystems ────────────────────
  const overlayLogo = document.createElement('img');
  overlayLogo.src = 'Logo Historico.jpeg';
  overlayLogo.alt = '';
  overlayLogo.style.cssText = `
    max-width: 50%; max-height: 50%;
    object-fit: contain;
    opacity: 0.18;
    display: none;
    animation: logoWaterFloat 4s ease-in-out infinite;
    pointer-events: none;
  `;
  overlay.appendChild(overlayLogo);

  // Floating keyframes injected once
  const floatStyle = document.createElement('style');
  floatStyle.textContent = `
    @keyframes logoWaterFloat {
      0%   { transform: translateY(0px);   }
      50%  { transform: translateY(-14px); }
      100% { transform: translateY(0px);   }
    }
  `;
  document.head.appendChild(floatStyle);

  // ── Click handler ─────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      // ── SECTION NODES: full-screen color flash → black → reveal ─────────
      const flashColor = targetId === '#ecosystems' ? 'rgba(0, 174, 239, 0.55)' : (SECTION_COLORS[targetId] || 'rgba(0, 174, 239, 0.55)');
      overlayLogo.style.display = 'none';

      // STEP 1: instant color flash (very fast, 150ms)
      overlay.style.transition = 'opacity 0.08s ease';
      overlay.style.background = flashColor;
      overlay.style.pointerEvents = 'all';
      overlay.style.opacity = '1';

      // STEP 2: quickly transition to pure black
      setTimeout(() => {
        overlay.style.transition = 'background 0.2s ease, opacity 0.1s ease';
        overlay.style.background = '#000';
      }, 100);

      // STEP 3: jump while screen is black
      setTimeout(() => {
        const offsetPos = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo(0, offsetPos);

        // STEP 4: fade back in
        setTimeout(() => {
          overlay.style.transition = 'opacity 0.5s ease';
          overlay.style.opacity = '0';

          setTimeout(() => {
            overlay.style.pointerEvents = 'none';
            overlay.style.background = '#000';
            // Section glow pulse
            targetElement.classList.add('section-highlight-pulse');
            setTimeout(() => targetElement.classList.remove('section-highlight-pulse'), 1800);
          }, 500);
        }, 80);
      }, 320);
    });
  });

});

// ============================================
// FUTURISTIC TOAST FUNCTION
// ============================================
window.showMrToast = function() {
  const toast = document.getElementById('mr-toast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
};

// ============================================
// LOGO HISTÓRICO — HOVER: LEYENDA ↔ POR SIEMPRE
// ============================================
(function() {
  const historicWrap = document.querySelector('.footer-historico-top');
  const leyendaEl    = document.getElementById('footer-leyenda-text');
  if (!historicWrap || !leyendaEl) return;

  function transitionText(newText, color, shadow, spacing) {
    leyendaEl.style.transition = 'opacity 0.3s ease, letter-spacing 0.5s ease, color 0.3s ease, text-shadow 0.3s ease';
    leyendaEl.style.opacity = '0';
    setTimeout(() => {
      leyendaEl.textContent = newText;
      leyendaEl.style.color = color;
      leyendaEl.style.textShadow = shadow;
      leyendaEl.style.letterSpacing = spacing;
      leyendaEl.style.opacity = '1';
    }, 300);
  }

  historicWrap.addEventListener('mouseenter', () => {
    transitionText(
      'POR SIEMPRE',
      '#00FFFF',
      '0 0 18px rgba(0,255,255,0.95), 0 0 45px rgba(0,200,255,0.6)',
      '0.35em'
    );
  });

  historicWrap.addEventListener('mouseleave', () => {
    transitionText(
      'LEYENDA',
      '#FFFFFF',
      'none',
      '0.15em'
    );
  });
})();
