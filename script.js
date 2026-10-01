// ---- Opening (tap-to-open) ----
const cover = document.getElementById('cover');
const main = document.getElementById('main');
document.documentElement.classList.add('locked');

// ---- Background music ----
const audio = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');
const iconSound = document.getElementById('icon-sound');
const iconMuted = document.getElementById('icon-muted');

let musicStarted = false;
let opened = false;

// Only marks success once play() actually resolves, so an early blocked
// attempt never prevents a later gesture-based attempt.
function tryPlayMusic() {
  if (musicStarted) return;
  audio.volume = 0.45;
  audio.play().then(() => { musicStarted = true; }).catch(() => {});
}

function openInvite() {
  if (opened) return;
  opened = true;
  cover.classList.add('open');
  main.classList.add('show');
  document.documentElement.classList.remove('locked');
  window.scrollTo(0, 0);
  setTimeout(() => cover.classList.add('hidden'), 1800);
  tryPlayMusic();
}

cover.addEventListener('click', openInvite);
cover.addEventListener('touchend', (e) => {
  if (e.target.closest('#mute-btn')) return;
  e.preventDefault();
  openInvite();
}, { passive: false });

// ---- Countdown: 12 November 2026, 11:30 AM IST ----
const target = new Date('2026-11-12T11:30:00+05:30').getTime();
const pad = n => String(n).padStart(2, '0');

function tick() {
  const diff = Math.max(0, target - Date.now());
  document.getElementById('cd-days').textContent  = pad(Math.floor(diff / 86400000));
  document.getElementById('cd-hours').textContent = pad(Math.floor((diff % 86400000) / 3600000));
  document.getElementById('cd-mins').textContent  = pad(Math.floor((diff % 3600000) / 60000));
  document.getElementById('cd-secs').textContent  = pad(Math.floor((diff % 60000) / 1000));
}
tick();
setInterval(tick, 1000);

// ---- Music fallbacks ----
document.addEventListener('click', tryPlayMusic, { once: true });
document.addEventListener('scroll', tryPlayMusic, { once: true, passive: true });
document.addEventListener('touchstart', tryPlayMusic, { once: true, passive: true });
window.addEventListener('load', tryPlayMusic);

// ---- Mute / unmute ----
muteBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  tryPlayMusic();
  if (audio.paused) {
    audio.play().catch(() => {});
    iconSound.style.display = '';
    iconMuted.style.display = 'none';
  } else {
    audio.pause();
    iconSound.style.display = 'none';
    iconMuted.style.display = '';
  }
});

// ---- Scroll reveal ----
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}
