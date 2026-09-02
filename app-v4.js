document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.header');
  const progress = document.querySelector('.scroll-progress');
  const cursorGlow = document.querySelector('.cursor-glow');
  const floatingTg = document.querySelector('#floating-tg');

  requestAnimationFrame(() => document.body.classList.add('is-ready'));

  // Header and scroll progress updates
  const updateScrollState = () => {
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const ratio = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
    header?.classList.toggle('scrolled', window.scrollY > 24);
    if (progress) progress.style.width = `${ratio * 100}%`;
    if (floatingTg) {
      floatingTg.classList.toggle('is-visible', window.scrollY > 300);
    }
  };

  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState, { passive: true });

  // Scroll reveal animations
  const revealTargets = document.querySelectorAll(
    '.section-heading, .card, .steps article, .categories span, .cat-pill, .cat-deal-card, .faq-list details, .stats-grid > div, .live-radar-head, .deal-marquee, .cta-panel, .radar-result, .calc-card',
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

  // Animated counters
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

  // Hero Live Deals push notification rotator
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

  // =========================================================================
  // 1. Radar Demo Simulator Logic
  // =========================================================================
  const radarProducts = {
    airpods: {
      title: 'Apple AirPods Pro 2 (USB-C)',
      icon: '🎧',
      category: 'Аудіо & Навушники',
      dropBadge: '−14% знижка',
      price: '9 499 ₴',
      oldPrice: '10 999 ₴',
      saving: 'Економія 1 500 ₴',
      minPrice: '9 499 ₴',
      maxPrice: '11 200 ₴',
      storesCount: '18 магазинів',
      history: [11200, 11200, 10999, 10799, 10899, 10499, 9899, 9499],
      stores: [
        { name: 'eStore', rating: '★ 4.9', price: '9 499 ₴', isBest: true },
        { name: 'Rozetka', rating: '★ 4.8', price: '9 799 ₴', isBest: false },
        { name: 'Comfy', rating: '★ 4.8', price: '9 999 ₴', isBest: false },
        { name: 'Stylus', rating: '★ 4.7', price: '10 150 ₴', isBest: false },
      ],
    },
    ps5: {
      title: 'Sony PlayStation 5 Slim',
      icon: '🎮',
      category: 'Ігри й консолі',
      dropBadge: '−10% знижка',
      price: '23 499 ₴',
      oldPrice: '25 999 ₴',
      saving: 'Економія 2 500 ₴',
      minPrice: '23 499 ₴',
      maxPrice: '26 499 ₴',
      storesCount: '14 магазинів',
      history: [26499, 25999, 25999, 24999, 24600, 24200, 23800, 23499],
      stores: [
        { name: 'GamePoint', rating: '★ 4.9', price: '23 499 ₴', isBest: true },
        { name: 'Telemart', rating: '★ 4.8', price: '23 799 ₴', isBest: false },
        { name: 'Moyo', rating: '★ 4.8', price: '24 299 ₴', isBest: false },
        { name: 'Rozetka', rating: '★ 4.7', price: '24 999 ₴', isBest: false },
      ],
    },
    rtx4070: {
      title: 'ASUS GeForce RTX 4070 Super 12GB Dual',
      icon: '⚡',
      category: 'Комплектуючі & Відеокарти',
      dropBadge: '−12% знижка',
      price: '28 899 ₴',
      oldPrice: '32 799 ₴',
      saving: 'Економія 3 900 ₴',
      minPrice: '28 899 ₴',
      maxPrice: '33 499 ₴',
      storesCount: '16 магазинів',
      history: [33499, 32799, 32000, 31500, 30999, 30200, 29400, 28899],
      stores: [
        { name: 'Telemart', rating: '★ 4.9', price: '28 899 ₴', isBest: true },
        { name: 'Brain', rating: '★ 4.8', price: '29 450 ₴', isBest: false },
        { name: 'ITbox', rating: '★ 4.7', price: '29 999 ₴', isBest: false },
        { name: 'Rozetka', rating: '★ 4.8', price: '30 499 ₴', isBest: false },
      ],
    },
    macbook: {
      title: 'Apple MacBook Air 13" M3 (8/256GB)',
      icon: '💻',
      category: 'Ноутбуки & ПК',
      dropBadge: '−5% знижка',
      price: '44 799 ₴',
      oldPrice: '47 299 ₴',
      saving: 'Економія 2 500 ₴',
      minPrice: '44 799 ₴',
      maxPrice: '48 999 ₴',
      storesCount: '21 магазин',
      history: [48999, 48499, 47999, 47299, 46800, 45900, 45200, 44799],
      stores: [
        { name: 'Apple Room', rating: '★ 4.9', price: '44 799 ₴', isBest: true },
        { name: 'iStore', rating: '★ 4.8', price: '45 199 ₴', isBest: false },
        { name: 'Comfy', rating: '★ 4.8', price: '46 499 ₴', isBest: false },
        { name: 'Stylus', rating: '★ 4.7', price: '46 999 ₴', isBest: false },
      ],
    },
    dyson: {
      title: 'Dyson Airwrap Multi-Styler Complete Long',
      icon: '💨',
      category: 'Краса та побутова техніка',
      dropBadge: '−15% знижка',
      price: '21 499 ₴',
      oldPrice: '25 299 ₴',
      saving: 'Економія 3 800 ₴',
      minPrice: '21 499 ₴',
      maxPrice: '26 000 ₴',
      storesCount: '11 магазинів',
      history: [26000, 25299, 24800, 23999, 23500, 22999, 22199, 21499],
      stores: [
        { name: 'Dyson Store', rating: '★ 4.9', price: '21 499 ₴', isBest: true },
        { name: 'Foxtrot', rating: '★ 4.8', price: '22 199 ₴', isBest: false },
        { name: 'Rozetka', rating: '★ 4.8', price: '22 999 ₴', isBest: false },
        { name: 'Comfy', rating: '★ 4.7', price: '23 499 ₴', isBest: false },
      ],
    },
  };

  const radarSearchInput = document.querySelector('#radar-search-input');
  const radarSearchClear = document.querySelector('#radar-search-clear');
  const radarChips = document.querySelectorAll('#search-chips .chip');
  const radarScanning = document.querySelector('#radar-scanning');
  const radarResult = document.querySelector('#radar-result');
  const scanStatus = document.querySelector('#radar-scan-status');

  const resIcon = document.querySelector('#res-icon');
  const resCategory = document.querySelector('#res-category');
  const resDropBadge = document.querySelector('#res-drop-badge');
  const resTitle = document.querySelector('#res-title');
  const resPrice = document.querySelector('#res-price');
  const resOldPrice = document.querySelector('#res-old-price');
  const resSaving = document.querySelector('#res-saving');
  const chartMinPrice = document.querySelector('#chart-min-price');
  const chartMaxPrice = document.querySelector('#chart-max-price');
  const chartContainer = document.querySelector('#chart-container');
  const resStoresCount = document.querySelector('#res-stores-count');
  const resStoresList = document.querySelector('#res-stores-list');

  // SVG Chart generator
  const renderSVGChart = (history) => {
    if (!chartContainer) return;
    const width = 460;
    const height = 150;
    const padding = 20;
    const minVal = Math.min(...history);
    const maxVal = Math.max(...history);
    const range = Math.max(maxVal - minVal, 1);

    const points = history.map((val, i) => {
      const x = padding + (i / (history.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - minVal) / range) * (height - padding * 2.2);
      return { x, y, val };
    });

    const d = points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = points[i - 1];
      const cx1 = prev.x + (pt.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (pt.x - prev.x) / 2;
      const cy2 = pt.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
    }, '');

    const areaD = `${d} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    const circlesSvg = points
      .map(
        (pt, idx) => `
        <circle cx="${pt.x}" cy="${pt.y}" r="${idx === points.length - 1 ? '6' : '4'}" 
                fill="${idx === points.length - 1 ? '#4df18d' : '#030914'}" 
                stroke="${idx === points.length - 1 ? '#fff' : '#2ce8ff'}" 
                stroke-width="2.5">
          <title>${pt.val.toLocaleString('uk-UA')} ₴</title>
        </circle>`,
      )
      .join('');

    chartContainer.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%;height:100%;overflow:visible;">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2ce8ff" stop-opacity="0.32" />
            <stop offset="100%" stop-color="#2ce8ff" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        <path d="${areaD}" fill="url(#chartGrad)" />
        <path d="${d}" fill="none" stroke="#2ce8ff" stroke-width="3" stroke-linecap="round" />
        ${circlesSvg}
      </svg>
    `;
  };

  const populateRadarResult = (item) => {
    if (resIcon) resIcon.textContent = item.icon;
    if (resCategory) resCategory.textContent = item.category;
    if (resDropBadge) resDropBadge.textContent = item.dropBadge;
    if (resTitle) resTitle.textContent = item.title;
    if (resPrice) resPrice.textContent = item.price;
    if (resOldPrice) resOldPrice.textContent = item.oldPrice;
    if (resSaving) resSaving.textContent = item.saving;
    if (chartMinPrice) chartMinPrice.textContent = item.minPrice;
    if (chartMaxPrice) chartMaxPrice.textContent = item.maxPrice;
    if (resStoresCount) resStoresCount.textContent = item.storesCount;

    if (resStoresList) {
      resStoresList.innerHTML = item.stores
        .map(
          (store) => `
        <div class="store-item">
          <div class="store-left">
            <span class="store-icon">🛒</span>
            <span class="store-name">${store.name}</span>
            <span class="store-rating">${store.rating}</span>
            ${store.isBest ? '<span class="store-badge-best">Найкраща ціна</span>' : ''}
          </div>
          <div class="store-right">
            <span class="store-price">${store.price}</span>
            <a href="https://t.me/hotline_price_monitor_bot" target="_blank" rel="noreferrer" class="store-btn">Перейти</a>
          </div>
        </div>
      `,
        )
        .join('');
    }

    renderSVGChart(item.history);
  };

  // Initial populate for airpods
  populateRadarResult(radarProducts.airpods);

  let scanTimer = null;
  const triggerRadarScan = (productKey, customTitle = '') => {
    if (scanTimer) clearTimeout(scanTimer);

    if (radarResult) radarResult.style.display = 'none';
    if (radarScanning) radarScanning.style.display = 'flex';

    const messages = [
      '🔍 Скануємо бази Rozetka, Telemart, Hotline...',
      '📊 Звіряємо ціни у 18 магазинах та акції...',
      '✅ Знайдено найкращу пропозицію!',
    ];

    let msgIndex = 0;
    if (scanStatus) scanStatus.textContent = messages[0];

    const cycleMsg = setInterval(() => {
      msgIndex++;
      if (msgIndex < messages.length && scanStatus) {
        scanStatus.textContent = messages[msgIndex];
      }
    }, 220);

    scanTimer = setTimeout(() => {
      clearInterval(cycleMsg);
      if (radarScanning) radarScanning.style.display = 'none';
      if (radarResult) {
        radarResult.style.display = 'block';
        radarResult.style.opacity = '0';
        radarResult.style.transform = 'translateY(12px)';
        requestAnimationFrame(() => {
          radarResult.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          radarResult.style.opacity = '1';
          radarResult.style.transform = 'none';
        });
      }

      let data = radarProducts[productKey];
      if (!data) {
        // Fallback generator for custom search queries
        data = {
          title: customTitle || 'Обраний товар',
          icon: '📦',
          category: 'Техніка та електроніка',
          dropBadge: '−8% знижка',
          price: '18 499 ₴',
          oldPrice: '19 999 ₴',
          saving: 'Економія 1 500 ₴',
          minPrice: '18 499 ₴',
          maxPrice: '20 500 ₴',
          storesCount: '15 магазинів',
          history: [20500, 20200, 19999, 19800, 19400, 19100, 18799, 18499],
          stores: [
            { name: 'Smart Mag', rating: '★ 4.9', price: '18 499 ₴', isBest: true },
            { name: 'Rozetka', rating: '★ 4.8', price: '18 999 ₴', isBest: false },
            { name: 'Comfy', rating: '★ 4.8', price: '19 299 ₴', isBest: false },
            { name: 'Moyo', rating: '★ 4.7', price: '19 999 ₴', isBest: false },
          ],
        };
      }
      populateRadarResult(data);
    }, 700);
  };

  radarChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      radarChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const prodKey = chip.dataset.product;
      if (radarSearchInput) radarSearchInput.value = '';
      if (radarSearchClear) radarSearchClear.style.display = 'none';
      triggerRadarScan(prodKey);
    });
  });

  if (radarSearchInput) {
    radarSearchInput.addEventListener('input', () => {
      const hasVal = radarSearchInput.value.trim().length > 0;
      if (radarSearchClear) radarSearchClear.style.display = hasVal ? 'grid' : 'none';
    });

    radarSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = radarSearchInput.value.trim();
        if (!val) return;
        radarChips.forEach((c) => c.classList.remove('active'));
        // check if matches any preset key
        const lower = val.toLowerCase();
        let matched = 'airpods';
        if (lower.includes('ps5') || lower.includes('playstation')) matched = 'ps5';
        else if (lower.includes('rtx') || lower.includes('4070') || lower.includes('video')) matched = 'rtx4070';
        else if (lower.includes('macbook') || lower.includes('apple air')) matched = 'macbook';
        else if (lower.includes('dyson') || lower.includes('airwrap')) matched = 'dyson';
        else matched = null;

        triggerRadarScan(matched, val);
      }
    });
  }

  if (radarSearchClear) {
    radarSearchClear.addEventListener('click', () => {
      if (radarSearchInput) {
        radarSearchInput.value = '';
        radarSearchInput.focus();
      }
      radarSearchClear.style.display = 'none';
    });
  }

  // =========================================================================
  // 2. Interactive Telegram Mockup Card inside Bento
  // =========================================================================
  const tgButtons = document.querySelectorAll('#tg-inline-kb .tg-btn');
  const tgReplyToast = document.querySelector('#tg-reply-toast');
  const tgReplyIcon = document.querySelector('#tg-reply-icon');
  const tgReplyText = document.querySelector('#tg-reply-text');
  let toastTimer = null;

  tgButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tgButtons.forEach((b) => b.classList.remove('btn-clicked'));
      btn.classList.add('btn-clicked');

      const action = btn.dataset.action;
      let msg = '';
      let icon = '✅';

      if (action === 'track') {
        msg = 'Сповіщення увімкнено: напишемо, щойно ціна опуститься нижче 36 899 ₴!';
        icon = '🔔';
      } else if (action === 'target') {
        msg = 'Ціль встановлено: отримаєте сповіщення при ціні 33 200 ₴ (−10%).';
        icon = '🎯';
      } else if (action === 'stats') {
        msg = 'Статистика: за 30 днів ціна впала з 39 199 ₴ до 36 899 ₴ (найнижча за літо).';
        icon = '📊';
      }

      if (tgReplyToast && tgReplyText && tgReplyIcon) {
        tgReplyIcon.textContent = icon;
        tgReplyText.textContent = msg;
        tgReplyToast.style.display = 'flex';

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          tgReplyToast.style.display = 'none';
          btn.classList.remove('btn-clicked');
        }, 3600);
      }
    });
  });

  // =========================================================================
  // 3. Savings Calculator Logic
  // =========================================================================
  const budgetRange = document.querySelector('#budget-range');
  const budgetDisplay = document.querySelector('#budget-display');
  const savingsAmount = document.querySelector('#savings-amount');
  const savingsCaption = document.querySelector('#savings-caption');
  const perkAvgDiscount = document.querySelector('#perk-avg-discount');
  const freqButtons = document.querySelectorAll('#calc-freq-chips .freq-btn');
  const discButtons = document.querySelectorAll('#calc-discount-chips .disc-btn');

  let currentBudget = 50000;
  let currentFreqFactor = 1;
  let currentDiscountPercent = 0.15;

  const formatUAH = (num) => `${num.toLocaleString('uk-UA')} ₴`;

  const recalculateSavings = () => {
    const rawSavings = Math.round(currentBudget * currentDiscountPercent * currentFreqFactor);
    const purchaseCount = currentFreqFactor === 0.85 ? 2 : currentFreqFactor === 1 ? 4 : 7;
    const avgPerItem = Math.round(rawSavings / purchaseCount);

    if (budgetDisplay) budgetDisplay.textContent = formatUAH(currentBudget);
    if (savingsAmount) savingsAmount.textContent = formatUAH(rawSavings);
    if (perkAvgDiscount) perkAvgDiscount.textContent = `−${formatUAH(avgPerItem)}`;

    if (savingsCaption) {
      if (rawSavings < 5000) {
        savingsCaption.innerHTML =
          'Цих коштів вистачить, наприклад, на <b>якісний чохол преміум-класу та швидку зарядку 65W GaN</b>.';
      } else if (rawSavings < 12000) {
        savingsCaption.innerHTML =
          'Цих коштів достатньо, наприклад, на <b>нові бездротові навушники AirPods</b> або <b>рік підписок на всі медіасервіси</b>.';
      } else {
        savingsCaption.innerHTML =
          'Цих коштів достатньо на <b>новітній смартгодинник</b> або <b>додатковий планшет для навчання чи роботи</b>.';
      }
    }
  };

  if (budgetRange) {
    budgetRange.addEventListener('input', (e) => {
      currentBudget = Number(e.target.value);
      recalculateSavings();
    });
  }

  freqButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      freqButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFreqFactor = Number(btn.dataset.factor || 1);
      recalculateSavings();
    });
  });

  discButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      discButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentDiscountPercent = Number(btn.dataset.percent || 0.15);
      recalculateSavings();
    });
  });

  recalculateSavings();

  // =========================================================================
  // 4. Interactive Categories Showcase
  // =========================================================================
  const categoryDeals = {
    phones: [
      { name: 'iPhone 16 128GB', icon: '📱', price: '36 899 ₴', old: '39 199 ₴', drop: '−6%', store: 'Smart Store' },
      { name: 'Samsung Galaxy S24', icon: '📱', price: '31 499 ₴', old: '34 999 ₴', drop: '−10%', store: 'Rozetka' },
      { name: 'Google Pixel 9 Pro', icon: '📱', price: '41 299 ₴', old: '44 500 ₴', drop: '−7%', store: 'Telemart' },
    ],
    laptops: [
      { name: 'MacBook Air 13" M3', icon: '💻', price: '44 799 ₴', old: '47 299 ₴', drop: '−5%', store: 'Apple Room' },
      { name: 'ASUS ROG Zephyrus G16', icon: '💻', price: '68 499 ₴', old: '74 999 ₴', drop: '−9%', store: 'Brain' },
      { name: 'Lenovo ThinkPad E16', icon: '💻', price: '32 999 ₴', old: '36 500 ₴', drop: '−10%', store: 'Comfy' },
    ],
    games: [
      { name: 'PlayStation 5 Slim', icon: '🎮', price: '23 499 ₴', old: '25 999 ₴', drop: '−10%', store: 'GamePoint' },
      { name: 'Xbox Series X 1TB', icon: '🎮', price: '21 899 ₴', old: '23 999 ₴', drop: '−9%', store: 'Moyo' },
      { name: 'Nintendo Switch OLED', icon: '🎮', price: '13 499 ₴', old: '14 999 ₴', drop: '−10%', store: 'Rozetka' },
    ],
    audio: [
      { name: 'AirPods Pro 2 USB-C', icon: '🎧', price: '9 499 ₴', old: '10 999 ₴', drop: '−14%', store: 'eStore' },
      { name: 'Sony WH-1000XM5', icon: '🎧', price: '12 199 ₴', old: '13 499 ₴', drop: '−10%', store: 'Comfy' },
      { name: 'Marshall Emberton II', icon: '🎧', price: '5 499 ₴', old: '6 299 ₴', drop: '−13%', store: 'Portativ' },
    ],
    home: [
      { name: 'Dyson V15 Detect', icon: '🏠', price: '28 999 ₴', old: '32 499 ₴', drop: '−11%', store: 'Dyson Official' },
      { name: 'Roborock S8 Pro Ultra', icon: '🏠', price: '39 999 ₴', old: '44 999 ₴', drop: '−11%', store: 'Stylus' },
      { name: 'DeLonghi Magnifica S', icon: '🏠', price: '14 299 ₴', old: '16 999 ₴', drop: '−16%', store: 'Rozetka' },
    ],
    tvs: [
      { name: 'Samsung OLED 55"', icon: '📺', price: '52 499 ₴', old: '57 999 ₴', drop: '−9%', store: 'Foxtrot' },
      { name: 'LG OLED evo C3 65"', icon: '📺', price: '67 999 ₴', old: '74 999 ₴', drop: '−9%', store: 'Comfy' },
      { name: 'TCL Mini-LED 55"', icon: '📺', price: '26 499 ₴', old: '29 999 ₴', drop: '−12%', store: 'Moyo' },
    ],
    watches: [
      { name: 'Apple Watch Series 10', icon: '⌚', price: '17 699 ₴', old: '18 899 ₴', drop: '−6%', store: 'iStore' },
      { name: 'Garmin Fenix 7 Pro', icon: '⌚', price: '29 499 ₴', old: '32 800 ₴', drop: '−10%', store: 'Rozetka' },
      { name: 'Galaxy Watch 6', icon: '⌚', price: '9 299 ₴', old: '10 999 ₴', drop: '−15%', store: 'Samsung Mag' },
    ],
    photo: [
      { name: 'Sony Alpha A7 IV', icon: '📷', price: '89 999 ₴', old: '96 500 ₴', drop: '−7%', store: 'Papara' },
      { name: 'DJI Mini 4 Pro', icon: '📷', price: '37 499 ₴', old: '41 200 ₴', drop: '−9%', store: 'FlyDrones' },
      { name: 'GoPro HERO 12 Black', icon: '📷', price: '14 999 ₴', old: '16 999 ₴', drop: '−12%', store: 'Rozetka' },
    ],
  };

  const catPills = document.querySelectorAll('#categories-list .cat-pill');
  const catShowcasePanel = document.querySelector('#cat-showcase-panel');

  const renderCategoryDeals = (catKey) => {
    if (!catShowcasePanel) return;
    const deals = categoryDeals[catKey] || categoryDeals.phones;

    catShowcasePanel.style.opacity = '0';
    catShowcasePanel.style.transform = 'translateY(8px)';

    setTimeout(() => {
      catShowcasePanel.innerHTML = deals
        .map(
          (d) => `
        <article class="cat-deal-card">
          <div class="cat-deal-top">
            <span class="cat-deal-icon">${d.icon}</span>
            <span class="cat-deal-drop">${d.drop}</span>
          </div>
          <div class="cat-deal-info">
            <h4>${d.name}</h4>
            <small>Магазин: ${d.store}</small>
          </div>
          <div class="cat-deal-bottom">
            <div class="cat-deal-price">
              ${d.price} <s>${d.old}</s>
            </div>
            <a href="https://t.me/hotline_price_monitor_bot" target="_blank" rel="noreferrer" class="cat-track-link">
              Стежити →
            </a>
          </div>
        </article>
      `,
        )
        .join('');

      catShowcasePanel.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      catShowcasePanel.style.opacity = '1';
      catShowcasePanel.style.transform = 'none';
    }, 120);
  };

  catPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      catPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      renderCategoryDeals(pill.dataset.cat);
    });
  });

  // Initial render for phones
  renderCategoryDeals('phones');

  // =========================================================================
  // 5. Existing Offer Carousel in Features Bento
  // =========================================================================
  const offerSlides = [
    {
      icon: '📱',
      product: 'iPhone 16 128GB',
      bestPrice: '36 899 ₴',
      count: '12 пропозицій',
      shops: [
        ['Smart Store', '★ 4.9', '36 899 ₴'],
        ['Tech Market', '★ 4.8', '37 240 ₴'],
        ['Digital Shop', '★ 4.7', '37 699 ₴'],
      ],
    },
    {
      icon: '🎮',
      product: 'PlayStation 5 Slim',
      bestPrice: '23 499 ₴',
      count: '9 пропозицій',
      shops: [
        ['Game Point', '★ 4.9', '23 499 ₴'],
        ['Console Hub', '★ 4.8', '23 890 ₴'],
        ['Play Market', '★ 4.7', '24 150 ₴'],
      ],
    },
    {
      icon: '💻',
      product: 'MacBook Air M3',
      bestPrice: '44 799 ₴',
      count: '15 пропозицій',
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
  offerDots.forEach((dot, index) =>
    dot.addEventListener('click', () => {
      stopOfferAutoplay();
      showOffer(index, index > activeOffer ? 1 : -1);
      startOfferAutoplay();
    }),
  );
  offerCarousel?.addEventListener('pointerenter', stopOfferAutoplay);
  offerCarousel?.addEventListener('pointerleave', startOfferAutoplay);
  offerCarousel?.addEventListener('focusin', stopOfferAutoplay);
  offerCarousel?.addEventListener('focusout', startOfferAutoplay);
  offerCarousel?.addEventListener('pointerdown', (event) => {
    swipeStartX = event.clientX;
  });
  offerCarousel?.addEventListener('pointerup', (event) => {
    const distance = event.clientX - swipeStartX;
    if (Math.abs(distance) < 45) return;
    stopOfferAutoplay();
    showOffer(activeOffer + (distance < 0 ? 1 : -1), distance < 0 ? 1 : -1);
    startOfferAutoplay();
  });
  startOfferAutoplay();

  // Pointer hover glow on cards
  const interactiveSurfaces = document.querySelectorAll('.card, .steps article, .categories span, .cat-pill, .cat-deal-card');
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
    window.addEventListener(
      'pointermove',
      (event) => {
        if (!cursorGlow) return;
        cancelAnimationFrame(cursorFrame);
        cursorFrame = requestAnimationFrame(() => {
          cursorGlow.style.left = `${event.clientX}px`;
          cursorGlow.style.top = `${event.clientY}px`;
          cursorGlow.classList.add('visible');
        });
      },
      { passive: true },
    );
    document.documentElement.addEventListener('mouseleave', () => cursorGlow?.classList.remove('visible'));
  }

  // FAQ Accordion
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
