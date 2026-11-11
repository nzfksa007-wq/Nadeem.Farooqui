document.querySelectorAll('[data-explorer]').forEach((explorer) => {
  const buttons = [...explorer.querySelectorAll('[data-choice]')];
  const panels = [...explorer.querySelectorAll('[data-panel]')];

  function select(choice) {
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.choice === choice));
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.panel !== choice; });
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => select(button.dataset.choice));
  });
  select(buttons[0].dataset.choice);
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

document.querySelectorAll('.evidence-disclosure').forEach((disclosure) => {
  const charts = [...disclosure.querySelectorAll('.panel, .cpanel')]
    .filter((chart) => chart.querySelector('h4'));
  if (charts.length < 2) return;

  const controls = document.createElement('div');
  controls.className = 'choice-row evidence-controls is-ready';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Choose an analytics view');
  const grids = [...new Set(charts.map((chart) => chart.parentElement))];

  function showChart(index) {
    charts.forEach((chart, i) => {
      chart.hidden = i !== index;
      controls.children[i].setAttribute('aria-pressed', String(i === index));
    });
    grids.forEach((grid) => {
      grid.classList.add('single-evidence-chart');
      grid.hidden = [...grid.children].every((item) => item.hidden);
    });
  }

  charts.forEach((chart, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = chart.querySelector('h4').textContent;
    button.addEventListener('click', () => showChart(i));
    controls.append(button);
  });
  disclosure.querySelector('summary').after(controls);
  showChart(0);
});
