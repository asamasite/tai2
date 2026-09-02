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

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealItems = document.querySelectorAll('[data-reveal]');
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
