// ── CURSOR ──
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// ── MOBILE MENU ──
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ── GSAP ANIMATIONS ──
gsap.registerPlugin(ScrollTrigger);

// Hero entrance
gsap.to('#heroTag', { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' });

document.querySelectorAll('.hero-name .line span').forEach((el, i) => {
  gsap.to(el, { y: '0%', duration: 1.2, delay: 0.5 + i * 0.12, ease: 'power4.out' });
});

gsap.to('#heroBottom', { opacity: 1, y: 0, duration: 1, delay: 1.1, ease: 'power3.out' });
gsap.to('#scrollIndicator', { opacity: 1, duration: 1, delay: 1.6, ease: 'power3.out' });

// Scroll reveals
document.querySelectorAll('.reveal').forEach((el) => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      once: true,
    }
  });
});

// Project items stagger
gsap.utils.toArray('.project-item').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, x: -30 },
    {
      opacity: 1, x: 0, duration: 0.7,
      ease: 'power3.out', delay: i * 0.08,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    }
  );
});

// ── EXPERTISE TAGS OBSERVER ──
const expertiseCards = document.querySelectorAll('.expertise-card');

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3
};

const expertiseObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const tags = entry.target.querySelectorAll('.tag');
      gsap.to(tags, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out'
      });
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

expertiseCards.forEach(card => expertiseObserver.observe(card));


// ── EXPERIENCE ACCORDION ──
function toggleExp(card) {
  const isActive = card.classList.contains('active');
  document.querySelectorAll('.exp-card').forEach(c => c.classList.remove('active'));
  if (!isActive) card.classList.add('active');
}
window.toggleExp = toggleExp;

// All cards closed by default.

// ── TIMELINE DRAW ON SCROLL ──
// ── TIMELINE STATIC SCROLL SETUP ──
const timeline = document.getElementById('expTimeline');
const progressLine = document.getElementById('timelineProgress');

if (timeline && progressLine) {
  // Set SVG height to match container
  const svg = document.getElementById('timelineSvg');

  // Create SVG Gradient dynamically
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  linearGradient.setAttribute("id", "timelineGrad");
  linearGradient.setAttribute("x1", "0%");
  linearGradient.setAttribute("y1", "0%");
  linearGradient.setAttribute("x2", "0%");
  linearGradient.setAttribute("y2", "100%");

  const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", "var(--accent)");
  stop1.setAttribute("stop-opacity", "0");

  const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute("offset", "50%");
  stop2.setAttribute("stop-color", "var(--accent)");
  stop2.setAttribute("stop-opacity", "0.7");

  const stop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop3.setAttribute("offset", "100%");
  stop3.setAttribute("stop-color", "var(--accent)");
  stop3.setAttribute("stop-opacity", "0");

  linearGradient.appendChild(stop1);
  linearGradient.appendChild(stop2);
  linearGradient.appendChild(stop3);
  defs.appendChild(linearGradient);
  svg.appendChild(defs);


  function updateSvgHeight() {
    const h = timeline.offsetHeight;
    svg.setAttribute('height', h);
    progressLine.setAttribute('y2', h);
    svg.querySelector('.track').setAttribute('y2', h);
  }
  
  // Need to wait slightly for exact render height calculation sometimes
  setTimeout(updateSvgHeight, 100);
  window.addEventListener('resize', updateSvgHeight);

  // Animate each card sliding in from left/right alternately
  document.querySelectorAll('.exp-card').forEach((card, i) => {
    const fromLeft = i % 2 === 0;
    gsap.fromTo(card,
      { opacity: 0, x: fromLeft ? -60 : 60 },
      {
        opacity: 1, x: 0, duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%', once: true, onComplete: updateSvgHeight }
      }
    );

    // Animate the dot popping in
    ScrollTrigger.create({
      trigger: card,
      start: 'top 82%',
      once: true,
      onEnter: () => card.classList.add('dot-visible')
    });
  });
}
