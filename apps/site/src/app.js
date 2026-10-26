import { add, router, tags } from './nocal.js';
import { routes } from './routes.js';
import { docsURL } from './urls.js';
import { Nav } from './components/nav.js';
import { Footer } from './components/footer.js';
import NotFoundPage from './pages/notFound.js';

const { div, h1, p } = tags();

export function App({ theme, mount }) {
  Nav({ theme });
  Footer();
  let navigation = 0;
  if (!location.hash || location.hash === '#') history.replaceState(null, '', '#/');
  // Old unpublished docs hashes lead to the single Markdown reference.
  if (location.hash === '#/docs' || location.hash.startsWith('#/docs/')) {
    location.replace(docsURL());
    return;
  }
  // Nocal's router parses the page/example parameters and owns hashchange.
  router([['#/:page/:example', ({ page, example }) => {
    if (page === 'docs') {
      location.replace(docsURL());
      return p({ role: 'status' }, 'Opening the reference…');
    }
    const expected = page ? `#/${page}${example ? `/${example}` : ''}` : '#/';
    const entry = location.hash === expected && routes.find(route => route.path === expected);
    const initial = navigation === 0 && expected === '#/' && mount.querySelector('.page-home');
    const turn = ++navigation;
    if (!entry) {
      document.title = 'Page not found — NocalJS';
      return NotFoundPage({ hash: location.hash });
    }
    const host = div({ class: 'page-outlet' }, initial || p({ role: 'status' }, 'Loading…'));
    entry.load().then(module => {
      if (turn !== navigation) return;
      host.replaceChildren();
      add(host, module.default({ example: entry.example }));
      document.title = entry.path === '#/' ? 'NocalJS — A zero-calories reactive framework' : `${entry.title} — NocalJS`;
      if (turn > 1) {
        const heading = host.querySelector('h1');
        heading?.setAttribute('tabindex', '-1');
        heading?.focus();
      }
    }).catch(error => {
      if (turn !== navigation) return;
      console.error(error);
      host.replaceChildren(div({ class: 'route-error', role: 'alert' }, h1('Page could not load'), p('Please reload and try again.')));
    });
    return host;
  }]], mount, () => {
    navigation++;
    document.title = 'Page not found — NocalJS';
    return NotFoundPage({ hash: location.hash });
  });
}
