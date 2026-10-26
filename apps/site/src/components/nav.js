import { add, state, tags, watch } from '../nocal.js';
import { navItems } from '../routes.js';
import { siteURL } from '../urls.js';

const { a, button, div, img, nav, span } = tags();

export function Nav({ theme }) {
  document.getElementById('site-header').replaceChildren();
  const currentHash = state(location.hash || '#/');
  const open = state(false);
  window.addEventListener('hashchange', () => {
    currentHash.value = location.hash || '#/';
    open.value = false;
  });
  const links = navItems.map(item => a({
    href: item.href,
    onclick: () => { open.value = false; },
  }, item.label));
  watch(() => links.forEach((link, index) => {
    const href = navItems[index].href;
    const active = href === currentHash.value || (href === '#/examples' && currentHash.value.startsWith('#/examples/'));
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }));
  add(document.getElementById('site-header'), div({ class: 'header-inner' },
    a({ href: '#/', class: 'brand', 'aria-label': 'NocalJS home' },
      img({ src: siteURL('vendor/assets/nocal_small.svg').href, alt: '', width: 28, height: 28 }), span('NocalJS')),
    button({ type: 'button', class: 'menu-toggle', 'aria-controls': 'site-nav',
      'aria-label': 'Toggle navigation menu', 'aria-expanded': () => String(open.value),
      onclick: () => { open.value = !open.value; } }, 'Menu'),
    nav({ id: 'site-nav', 'aria-label': 'Primary', class: () => open.value ? 'open' : '' }, links),
    button({ type: 'button', class: 'theme-toggle', 'aria-label': () => `${theme.value === 'dark' ? 'Dark' : 'Light'} theme: toggle dark mode`,
      'aria-pressed': () => String(theme.value === 'dark'),
      onclick: () => { theme.value = theme.value === 'dark' ? 'light' : 'dark'; } },
      () => theme.value === 'dark' ? 'Dark' : 'Light')
  ));
  document.getElementById('site-header').addEventListener('keydown', event => {
    if (event.key === 'Escape' && open.value) {
      open.value = false;
      document.querySelector('.menu-toggle').focus();
    }
  });
}
