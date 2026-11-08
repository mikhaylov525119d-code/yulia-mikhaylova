// Анимации сайта: появление блоков, счётчики, параллакс фото, шапка, меню, отзывы
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // шапка: фон после прокрутки
  const top = $('#top');
  const onScroll = () => top.classList.toggle('scrolled', window.scrollY > 10);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // мобильное меню
  const burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
  $$('#nav a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));

  // отзывы: смена раз в 6 секунд + точки
  const qs = $$('#quotes .q'), dots = $$('#dots button'); let qi = 0, qt;
  const showQ = i => { qs[qi].classList.remove('on'); dots[qi].classList.remove('on'); qi = i; qs[qi].classList.add('on'); dots[qi].classList.add('on'); };
  const loop = () => { clearInterval(qt); qt = setInterval(() => showQ((qi + 1) % qs.length), 6000); };
  dots.forEach((d, i) => d.addEventListener('click', () => { showQ(i); loop(); }));
  loop();

  // без анимаций (настройка «уменьшить движение» или не загрузилась библиотека) — просто показываем всё
  if (reduce || !window.gsap || !window.ScrollTrigger) { document.documentElement.classList.remove('js'); return; }
  gsap.registerPlugin(ScrollTrigger);

  // первый экран: заголовок по строкам, фото в арке выезжает
  const heroRv = $$('.hero .rv');
  gsap.to(heroRv, { opacity: 1, y: 0, duration: .9, stagger: .09, ease: 'power3.out', delay: .1 });
  gsap.from('.hero .arch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 18px 18px)', duration: 1.2, ease: 'power3.inOut', delay: .15 });
  gsap.from('.hero .arch img', { scale: 1.08, opacity: 0, duration: 1.4, ease: 'power3.out', delay: .3 });
  gsap.from('.arch-line', { opacity: 0, x: -14, y: 14, duration: 1, delay: .9 });
  gsap.from('.badge', { scale: 0, rotate: -90, duration: .8, ease: 'back.out(1.7)', delay: 1.1 });
  // лёгкий параллакс фото при прокрутке — только вниз, чтобы голова не уходила под край арки
  gsap.fromTo('.hero .arch img', { y: 0 }, { y: 30, ease: 'none', immediateRender: false,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // остальные блоки появляются при прокрутке, карточки — лесенкой
  $$('.rv').filter(el => !el.closest('.hero')).forEach(el => {
    const sibs = el.parentElement.children, idx = [...sibs].indexOf(el);
    gsap.to(el, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', delay: (el.matches('.card, .steps li, .stat') ? (idx % 4) * .08 : 0),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  // счётчики в полосе цифр
  $$('[data-count]').forEach(el => {
    const to = +el.dataset.count, suf = el.dataset.suffix || '', o = { v: 0 };
    const fmt = v => Math.round(v).toLocaleString('ru-RU').replace(/\s/g, ' ') + suf;
    el.textContent = fmt(0);
    gsap.to(o, { v: to, duration: to > 100 ? 1.8 : 1, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(o.v)),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  // телефон с калькулятором чуть поднимается при прокрутке
  gsap.from('.phone', { y: 90, ease: 'none', scrollTrigger: { trigger: '.calc', start: 'top bottom', end: 'center center', scrub: true } });
})();
