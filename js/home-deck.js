const deckNav = document.querySelector('.deck-nav');
const deckTabs = [...deckNav.querySelectorAll('a')];
const deckPanels = deckTabs.map((tab) => document.querySelector(tab.hash));
deckNav.setAttribute('role', 'tablist');

deckTabs.forEach((tab, index) => {
  tab.id = 'view-' + deckPanels[index].id;
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', deckPanels[index].id);
  deckPanels[index].setAttribute('role', 'tabpanel');
  deckPanels[index].setAttribute('aria-labelledby', tab.id);
  tab.addEventListener('click', (event) => {
    event.preventDefault();
    history.replaceState(null, '', tab.hash);
    showHomeView(index);
  });
  tab.addEventListener('keydown', (event) => {
    const directions = { ArrowLeft: -1, ArrowRight: 1 };
    let next = index + (directions[event.key] || 0);
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = deckTabs.length - 1;
    else if (!(event.key in directions)) return;
    event.preventDefault();
    next = (next + deckTabs.length) % deckTabs.length;
    deckTabs[next].click();
    deckTabs[next].focus();
  });
});

function showHomeView(index) {
  deckTabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
    deckPanels[i].hidden = i !== index;
  });
}

function showHashView() {
  const index = deckTabs.findIndex((tab) => tab.hash === window.location.hash);
  showHomeView(index < 0 ? 0 : index);
}
window.addEventListener('hashchange', showHashView);
document.querySelectorAll('.compact-intro a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    history.replaceState(null, '', link.hash);
    showHashView();
    document.querySelector(link.hash).scrollIntoView({ block: 'start' });
  });
});
showHashView();
