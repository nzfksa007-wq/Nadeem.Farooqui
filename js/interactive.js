document.querySelectorAll('[data-explorer]').forEach((explorer) => {
  const buttons = [...explorer.querySelectorAll('[data-choice]')];
  const panels = [...explorer.querySelectorAll('[data-panel]')];
  const preview = explorer.closest('.operations-preview');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0;
  let timer;
  let paused = false;

  function select(index) {
    selected = index;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
  }
  function stop() {
    window.clearInterval(timer);
    timer = undefined;
  }
  function play(force = false) {
    stop();
    if (!paused && !document.hidden && (force || (!preview.matches(':hover') && !preview.contains(document.activeElement)))) {
      timer = window.setInterval(() => select((selected + 1) % panels.length), 6500);
    }
  }
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    select(index);
    stop();
    if (pause) {
      paused = true;
      pause.textContent = 'Play preview';
    }
  }));
  let pause;
  if (preview) {
    pause = document.createElement('button');
    pause.type = 'button';
    pause.textContent = reducedMotion.matches ? 'Play preview' : 'Pause preview';
    paused = reducedMotion.matches;
    pause.addEventListener('click', () => {
      paused = !paused;
      pause.textContent = paused ? 'Play preview' : 'Pause preview';
      if (paused) stop();
      else play(true);
    });
    explorer.querySelector('.choice-row').append(pause);
    preview.addEventListener('mouseenter', stop);
    preview.addEventListener('mouseleave', () => {
      if (!preview.contains(document.activeElement)) play();
    });
    preview.addEventListener('focusin', stop);
    preview.addEventListener('focusout', (event) => {
      if (!preview.contains(event.relatedTarget) && !preview.matches(':hover')) play();
    });
    document.addEventListener('visibilitychange', () => play());
    reducedMotion.addEventListener('change', () => {
      paused = reducedMotion.matches;
      pause.textContent = paused ? 'Play preview' : 'Pause preview';
      play();
    });
    play();
  }
  select(0);
  explorer.classList.add('is-ready');
});

const filters = document.querySelector('.case-filters');
if (filters) {
  const cards = [...document.querySelectorAll('[data-case]')];
  const buttons = [...filters.querySelectorAll('[data-filter]')];
  buttons.forEach((button) => button.addEventListener('click', () => {
    buttons.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    cards.forEach((card) => {
      card.hidden = button.dataset.filter !== '0' && card.dataset.case !== button.dataset.filter;
    });
  }));
  filters.classList.add('is-ready');
}
