document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.header');
  const progress = document.querySelector('.scroll-progress');
  const cursorGlow = document.querySelector('.cursor-glow');

  requestAnimationFrame(() => document.body.classList.add('is-ready'));

  const updateScrollState = () => {
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const ratio = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
    header?.classList.toggle('scrolled', window.scrollY > 24);
    if (progress) progress.style.width = `${ratio * 100}%`;
  };

  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState, { passive: true });

  const revealTargets = document.querySelectorAll(
    '.section-heading, .card, .steps article, .categories span, .faq-list details, .stats-grid > div, .cta-panel',
  );

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  } else {
    revealTargets.forEach((element, index) => {
      element.classList.add('reveal');
      element.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    revealTargets.forEach((element) => revealObserver.observe(element));
  }

  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (element) => {
    const target = Number(element.dataset.count || 0);
    const duration = 700;
    const startedAt = performance.now();
    const tick = (now) => {
      const progressValue = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      element.textContent = String(Math.round(target * eased));
      if (progressValue < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.8 },
    );
    counters.forEach((counter) => {
      counter.textContent = '0';
      counterObserver.observe(counter);
    });
  }

  const interactiveSurfaces = document.querySelectorAll('.card, .steps article, .categories span');
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (!reducedMotion && hasFinePointer) {
    interactiveSurfaces.forEach((surface) => {
      surface.addEventListener('pointermove', (event) => {
        const rect = surface.getBoundingClientRect();
        surface.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
        surface.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
        surface.classList.add('pointer-active');
      });
      surface.addEventListener('pointerleave', () => surface.classList.remove('pointer-active'));
    });

    let cursorFrame = 0;
    window.addEventListener('pointermove', (event) => {
      if (!cursorGlow) return;
      cancelAnimationFrame(cursorFrame);
      cursorFrame = requestAnimationFrame(() => {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
        cursorGlow.classList.add('visible');
      });
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => cursorGlow?.classList.remove('visible'));
  }

  const questions = [...document.querySelectorAll('.faq-list details')];
  questions.forEach((question) => {
    question.addEventListener('toggle', () => {
      if (!question.open) return;
      questions.forEach((other) => {
        if (other !== question) other.removeAttribute('open');
      });
    });
  });
});
