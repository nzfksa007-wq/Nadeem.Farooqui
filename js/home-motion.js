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
    chapter.setAttribute('aria-pressed', String(index === filmIndex));
  });
  const progress = supplyChainFilm.querySelector('.film-progress span');
  const nextProgress = progress.cloneNode();
  progress.replaceWith(nextProgress);
}

function syncSupplyChainFilm() {
  window.clearInterval(filmTimer);
  const animated = !motionPreference.matches;
  supplyChainFilm.classList.toggle('film-playing', animated);
  showFilmChapter();
  if (!animated || !filmVisible || document.hidden || document.activeElement?.closest('.mega-panel')) return;
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
filmChapters.forEach((chapter, index) => {
  chapter.addEventListener('click', () => {
    filmIndex = index;
    syncSupplyChainFilm();
  });
});
supplyChainFilm.addEventListener('focusin', (event) => {
  if (event.target.closest('.mega-panel')) syncSupplyChainFilm();
});
supplyChainFilm.addEventListener('focusout', (event) => {
  if (event.target.closest('.mega-panel')) window.setTimeout(syncSupplyChainFilm, 0);
});
syncSupplyChainFilm();

const warehouseVideo = document.querySelector('.hero-warehouse-video');
let warehouseVisible = false;

function syncWarehouseVideo() {
  if (motionPreference.matches || document.hidden || !warehouseVisible) {
    warehouseVideo.pause();
    return;
  }
  if (!warehouseVideo.getAttribute('src')) warehouseVideo.src = warehouseVideo.dataset.src;
  warehouseVideo.muted = true;
  warehouseVideo.play().catch(() => {
    // The poster remains visible if the browser restricts background playback.
  });
}

new IntersectionObserver(([entry]) => {
  warehouseVisible = entry.isIntersecting;
  syncWarehouseVideo();
}).observe(warehouseVideo);
motionPreference.addEventListener('change', syncWarehouseVideo);
document.addEventListener('visibilitychange', syncWarehouseVideo);
