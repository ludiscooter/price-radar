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
    '.section-heading, .card, .steps article, .categories span, .categories a, .faq-list details, .stats-grid > div, .live-radar-head, .deal-marquee, .cta-panel',
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

  const offerSlides = [
    {
      icon: '📱', product: 'iPhone 16 128GB', bestPrice: '36 899 ₴', count: '12 пропозицій',
      shops: [
        ['Smart Store', '★ 4.9', '36 899 ₴'],
        ['Tech Market', '★ 4.8', '37 240 ₴'],
        ['Digital Shop', '★ 4.7', '37 699 ₴'],
      ],
    },
    {
      icon: '🎮', product: 'PlayStation 5 Slim', bestPrice: '23 499 ₴', count: '9 пропозицій',
      shops: [
        ['Game Point', '★ 4.9', '23 499 ₴'],
        ['Console Hub', '★ 4.8', '23 890 ₴'],
        ['Play Market', '★ 4.7', '24 150 ₴'],
      ],
    },
    {
      icon: '💻', product: 'MacBook Air M3', bestPrice: '44 799 ₴', count: '15 пропозицій',
      shops: [
        ['Apple Room', '★ 4.9', '44 799 ₴'],
        ['Notebook Shop', '★ 4.8', '45 190 ₴'],
        ['Tech Space', '★ 4.7', '45 640 ₴'],
      ],
    },
  ];

  const offerCarousel = document.querySelector('.offer-carousel');
  const offerList = document.querySelector('#offer-list');
  const offerDots = [...document.querySelectorAll('.offer-dots button')];
  const offerFields = {
    icon: document.querySelector('#offer-product-icon'),
    product: document.querySelector('#offer-product-name'),
    position: document.querySelector('#offer-position'),
    bestPrice: document.querySelector('#offer-best-price'),
    count: document.querySelector('#offer-count'),
  };
  const shopFields = [1, 2, 3].map((number) => ({
    name: document.querySelector(`#shop-name-${number}`),
    rating: document.querySelector(`#shop-rating-${number}`),
    price: document.querySelector(`#shop-price-${number}`),
  }));
  let activeOffer = 0;
  let offerTimer = 0;
  let offerLocked = false;
  let pendingOffer = null;
  let swipeStartX = 0;

  const paintOffer = () => {
    const slide = offerSlides[activeOffer];
    if (offerFields.icon) offerFields.icon.textContent = slide.icon;
    if (offerFields.product) offerFields.product.textContent = slide.product;
    if (offerFields.position) offerFields.position.textContent = `${activeOffer + 1} / ${offerSlides.length}`;
    if (offerFields.bestPrice) offerFields.bestPrice.textContent = slide.bestPrice;
    if (offerFields.count) offerFields.count.textContent = slide.count;
    shopFields.forEach((fields, index) => {
      const shop = slide.shops[index];
      if (fields.name) fields.name.textContent = shop[0];
      if (fields.rating) fields.rating.textContent = shop[1];
      if (fields.price) fields.price.textContent = shop[2];
    });
    offerDots.forEach((dot, index) => {
      const selected = index === activeOffer;
      dot.classList.toggle('active', selected);
      dot.setAttribute('aria-selected', String(selected));
    });
  };

  const showOffer = (nextIndex, direction = 1) => {
    if (!offerCarousel || nextIndex === activeOffer) return;
    if (offerLocked) {
      pendingOffer = { nextIndex, direction };
      return;
    }
    offerLocked = true;
    offerCarousel.style.setProperty('--offer-direction', `${direction > 0 ? -24 : 24}px`);
    offerCarousel.classList.add('changing');
    window.setTimeout(() => {
      activeOffer = (nextIndex + offerSlides.length) % offerSlides.length;
      paintOffer();
      offerCarousel.style.setProperty('--offer-direction', `${direction > 0 ? 24 : -24}px`);
      offerList?.getBoundingClientRect();
      offerCarousel.classList.remove('changing');
      window.setTimeout(() => {
        offerLocked = false;
        if (!pendingOffer) return;
        const requestedOffer = pendingOffer;
        pendingOffer = null;
        showOffer(requestedOffer.nextIndex, requestedOffer.direction);
      }, reducedMotion ? 0 : 300);
    }, reducedMotion ? 0 : 280);
  };

  const stopOfferAutoplay = () => window.clearInterval(offerTimer);
  const startOfferAutoplay = () => {
    stopOfferAutoplay();
    if (!reducedMotion && offerCarousel) {
      offerTimer = window.setInterval(() => showOffer(activeOffer + 1, 1), 4800);
    }
  };

  document.querySelector('#offer-prev')?.addEventListener('click', () => {
    stopOfferAutoplay();
    showOffer(activeOffer - 1, -1);
    startOfferAutoplay();
  });
  document.querySelector('#offer-next')?.addEventListener('click', () => {
    stopOfferAutoplay();
    showOffer(activeOffer + 1, 1);
    startOfferAutoplay();
  });
  offerDots.forEach((dot, index) => dot.addEventListener('click', () => {
    stopOfferAutoplay();
    showOffer(index, index > activeOffer ? 1 : -1);
    startOfferAutoplay();
  }));
  offerCarousel?.addEventListener('pointerenter', stopOfferAutoplay);
  offerCarousel?.addEventListener('pointerleave', startOfferAutoplay);
  offerCarousel?.addEventListener('focusin', stopOfferAutoplay);
  offerCarousel?.addEventListener('focusout', startOfferAutoplay);
  offerCarousel?.addEventListener('pointerdown', (event) => { swipeStartX = event.clientX; });
  offerCarousel?.addEventListener('pointerup', (event) => {
    const distance = event.clientX - swipeStartX;
    if (Math.abs(distance) < 45) return;
    stopOfferAutoplay();
    showOffer(activeOffer + (distance < 0 ? 1 : -1), distance < 0 ? 1 : -1);
    startOfferAutoplay();
  });
  startOfferAutoplay();

  const interactiveSurfaces = document.querySelectorAll('.card, .steps article, .categories span, .categories a');
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
