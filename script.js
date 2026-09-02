const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
scrollProgress.innerHTML = '<span></span>';
document.body.prepend(scrollProgress);

const quickActions = document.createElement('div');
quickActions.className = 'quick-actions';
quickActions.setAttribute('aria-label', 'Быстрые действия');
quickActions.innerHTML = '<button class="quick-action quick-action--top" type="button" aria-label="Наверх" title="Наверх"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 14 6-6 6 6"/></svg></button><a class="quick-action quick-action--contact" href="tel:+79529563186" aria-label="Позвонить в центр" title="Позвонить"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 3.8 4.7 5.2c-1.2.7-.8 4.4 1.5 8.4s5.3 6.2 6.5 5.5l2.5-1.4-2.3-4-2.2 1c-.8-.7-1.6-1.8-2.3-3s-1.2-2.5-1.4-3.5l2-1.4-2.3-4Z"/><path d="M14 5.5c2.4.6 4 2.6 4.3 5M14.5 2c4 .8 7 4.2 7.3 8.3"/></svg></a>';
document.body.append(quickActions);
const scrollTopButton = quickActions.querySelector('.quick-action--top');
scrollTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

const isHomePage = /(?:^|\/)index\.html$/.test(window.location.pathname) || window.location.pathname.endsWith('/');

if (isHomePage) {
  const preloader = document.createElement('div');
  preloader.className = 'preloader';
  preloader.setAttribute('role', 'status');
  preloader.setAttribute('aria-label', 'Загрузка сайта');
  preloader.innerHTML = '<div class="preloader__mark"><img src="assets/images/brand-mark.webp" alt=""></div><div class="preloader__name">Тайшань</div><div class="preloader__caption">центр китайской медицины</div><div class="preloader__track"><span></span></div><div class="preloader__value">0</div>';
  document.body.prepend(preloader);
  document.body.classList.add('is-loading');

  const preloaderBar = preloader.querySelector('.preloader__track span');
  const preloaderValue = preloader.querySelector('.preloader__value');
  const preloaderStartedAt = performance.now();
  let loadValue = 0;
  const paintLoad = (value) => {
    loadValue = Math.min(100, value);
    preloaderBar.style.width = `${loadValue}%`;
    preloaderValue.textContent = String(Math.round(loadValue));
  };
  const loadingTimer = reducedMotion ? 0 : window.setInterval(() => paintLoad(loadValue + Math.max(1, (88 - loadValue) * .09)), 45);
  const finishLoading = () => {
    if (loadingTimer) window.clearInterval(loadingTimer);
    const minimumWait = reducedMotion ? 0 : Math.max(0, 650 - (performance.now() - preloaderStartedAt));
    window.setTimeout(() => {
      paintLoad(100);
      window.setTimeout(() => {
        preloader.classList.add('is-hidden');
        document.body.classList.remove('is-loading');
        window.setTimeout(() => preloader.remove(), reducedMotion ? 0 : 650);
      }, reducedMotion ? 0 : 180);
    }, minimumWait);
  };
  if (document.readyState === 'complete') finishLoading();
  else window.addEventListener('load', finishLoading, { once: true });
}

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const header = document.querySelector('.site-header');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
    nav.classList.toggle('is-open', !open);
    document.body.classList.toggle('menu-open', !open);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Открыть меню');
      nav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1020) {
      menuButton.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    }
  });
}

const progressBar = scrollProgress.querySelector('span');
const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
  scrollTopButton.classList.toggle('is-visible', window.scrollY > Math.min(600, window.innerHeight * .7));
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0})`;
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealItems = document.querySelectorAll('[data-reveal]');
revealItems.forEach((item, index) => {
  const fromRight = item.matches('figure, .hero-photo, .methods-photo, .conditions-catalog, .contacts-details, .education-programs') || index % 2 === 1;
  item.classList.add(fromRight ? 'reveal-from-right' : 'reveal-from-left');
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelectorAll('.faq details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq details[open]').forEach((other) => {
      if (other !== item) other.removeAttribute('open');
    });
  });
});

const reviewViewport = document.querySelector('.review-viewport');
const reviewTrack = document.querySelector('.review-track');
const reviewCards = reviewTrack ? [...reviewTrack.querySelectorAll('blockquote')] : [];
const reviewPrev = document.querySelector('[data-review-prev]');
const reviewNext = document.querySelector('[data-review-next]');
const reviewStatus = document.querySelector('.review-status');

if (reviewViewport && reviewTrack && reviewCards.length && reviewPrev && reviewNext) {
  let reviewIndex = 0;

  const visibleReviews = () => window.innerWidth <= 720 ? 1 : window.innerWidth <= 1040 ? 2 : 3;
  const updateReviews = () => {
    const visible = visibleReviews();
    const maxIndex = Math.max(0, reviewCards.length - visible);
    reviewIndex = Math.min(reviewIndex, maxIndex);
    reviewTrack.style.transform = `translate3d(-${reviewIndex * (100 / visible)}%, 0, 0)`;
    reviewPrev.disabled = reviewIndex === 0;
    reviewNext.disabled = reviewIndex === maxIndex;
    if (reviewStatus) reviewStatus.textContent = `${reviewIndex + 1} / ${reviewCards.length}`;
  };

  reviewPrev.addEventListener('click', () => { reviewIndex -= 1; updateReviews(); });
  reviewNext.addEventListener('click', () => { reviewIndex += 1; updateReviews(); });
  reviewViewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') reviewPrev.click();
    if (event.key === 'ArrowRight') reviewNext.click();
  });
  window.addEventListener('resize', updateReviews);
  updateReviews();
}
