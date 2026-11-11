const motionScenes = [...document.querySelectorAll('[data-motion-scene]')];
const motionButton = document.querySelector('[data-motion-toggle]');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = false;
const visibleScenes = new Set();

function syncHomeMotion() {
  const enabled = !motionPaused && !motionPreference.matches && !document.hidden;
  motionScenes.forEach((scene) => {
    scene.classList.toggle('is-moving', enabled && visibleScenes.has(scene));
  });
  motionButton.hidden = motionPreference.matches;
  motionButton.textContent = motionPaused ? 'Resume scene animations' : 'Pause scene animations';
}

const sceneObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) visibleScenes.add(target);
    else visibleScenes.delete(target);
  });
  syncHomeMotion();
});
motionScenes.forEach((scene) => sceneObserver.observe(scene));
motionButton.addEventListener('click', () => {
  motionPaused = !motionPaused;
  syncHomeMotion();
});
motionPreference.addEventListener('change', syncHomeMotion);
document.addEventListener('visibilitychange', syncHomeMotion);
syncHomeMotion();
