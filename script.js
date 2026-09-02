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
    '.section-heading, .card, .steps article, .categories span, .faq-list details, .stats-grid > div, .live-radar-head, .deal-marquee, .cta-panel',
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

  const liveDeals = [
    { icon: '📱', product: 'iPhone 16 128GB', oldPrice: '39 199 ₴', newPrice: '36 899 ₴', change: '−6%' },
    { icon: '🎮', product: 'PlayStation 5 Slim', oldPrice: '25 999 ₴', newPrice: '23 499 ₴', change: '−10%' },
    { icon: '💻', product: 'MacBook Air M3', oldPrice: '47 299 ₴', newPrice: '44 799 ₴', change: '−5%' },
    { icon: '📺', product: 'Samsung OLED 55', oldPrice: '57 999 ₴', newPrice: '52 499 ₴', change: '−9%' },
    { icon: '⌚', product: 'Apple Watch Series 10', oldPrice: '18 899 ₴', newPrice: '17 699 ₴', change: '−6%' },
  ];

  const pushNotice = document.querySelector('.push');
  const dealIcon = document.querySelector('#deal-icon');
  const dealProduct = document.querySelector('#deal-product');
  const dealOldPrice = document.querySelector('#deal-old-price');
  const dealNewPrice = document.querySelector('#deal-new-price');
  const dealChange = document.querySelector('#deal-change');
  let activeDeal = 0;

  const renderLiveDeal = () => {
    const deal = liveDeals[activeDeal];
    if (dealIcon) dealIcon.textContent = deal.icon;
    if (dealProduct) dealProduct.textContent = deal.product;
    if (dealOldPrice) dealOldPrice.textContent = deal.oldPrice;
    if (dealNewPrice) dealNewPrice.textContent = deal.newPrice;
    if (dealChange) dealChange.textContent = deal.change;
  };

  if (!reducedMotion && pushNotice && dealProduct) {
    window.setInterval(() => {
      pushNotice.classList.add('swapping');
      window.setTimeout(() => {
        activeDeal = (activeDeal + 1) % liveDeals.length;
        renderLiveDeal();
        pushNotice.classList.remove('swapping');
      }, 240);
    }, 4000);
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
