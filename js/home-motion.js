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
