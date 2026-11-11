const motionScenes = [...document.querySelectorAll('[data-motion-scene]')];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const visibleScenes = new Set();

function syncHomeMotion() {
  const enabled = !motionPreference.matches && !document.hidden;
  motionScenes.forEach((scene) => {
    scene.classList.toggle('is-moving', enabled && visibleScenes.has(scene));
  });
}

const sceneObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) visibleScenes.add(target);
    else visibleScenes.delete(target);
  });
  syncHomeMotion();
});
motionScenes.forEach((scene) => sceneObserver.observe(scene));
motionPreference.addEventListener('change', syncHomeMotion);
document.addEventListener('visibilitychange', syncHomeMotion);

const supplyChainFilm = document.querySelector('[data-supply-chain-film]');
const filmPanels = [...supplyChainFilm.querySelectorAll('[data-panel]')];
const filmChapters = [...supplyChainFilm.querySelectorAll('[data-chapter]')];
let filmIndex = 0;
let filmTimer;
let filmVisible = false;

function showFilmChapter() {
  filmPanels.forEach((panel, index) => { panel.hidden = index !== filmIndex; });
  filmChapters.forEach((chapter, index) => {
    chapter.classList.toggle('is-current', index === filmIndex);
  });
  const progress = supplyChainFilm.querySelector('.film-progress span');
  const nextProgress = progress.cloneNode();
  progress.replaceWith(nextProgress);
}

function syncSupplyChainFilm() {
  window.clearInterval(filmTimer);
  const animated = !motionPreference.matches;
  supplyChainFilm.classList.toggle('film-playing', animated);
  if (!animated) {
    filmPanels.forEach((panel) => { panel.hidden = false; });
    filmChapters.forEach((chapter) => chapter.classList.remove('is-current'));
    return;
  }

  showFilmChapter();
  if (!filmVisible || document.hidden || supplyChainFilm.contains(document.activeElement)) return;
  filmTimer = window.setInterval(() => {
    filmIndex = (filmIndex + 1) % filmPanels.length;
    showFilmChapter();
  }, 5000);
}

new IntersectionObserver(([entry]) => {
  filmVisible = entry.isIntersecting;
  syncSupplyChainFilm();
}).observe(supplyChainFilm);
motionPreference.addEventListener('change', syncSupplyChainFilm);
document.addEventListener('visibilitychange', syncSupplyChainFilm);
supplyChainFilm.addEventListener('focusin', syncSupplyChainFilm);
supplyChainFilm.addEventListener('focusout', () => window.setTimeout(syncSupplyChainFilm, 0));
syncSupplyChainFilm();
