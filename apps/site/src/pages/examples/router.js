import { add, router, tags } from '../../nocal.js';

export function mount(target) {
  const { a, div, nav, p } = tags();
  const outlet = div({ class: 'router-outlet', 'aria-live': 'polite' });
  add(target,
    nav({ 'aria-label': 'Demo navigation' }, a({ href: '#intro' }, 'Introduction'), ' · ', a({ href: '#item/42' }, 'Item 42')),
    outlet
  );
  router([
    ['#intro', () => p('This is the introduction. Open Item 42 to pass a route parameter.')],
    ['#item/:id', ({ id }) => p(`You are viewing item ${id}.`)],
  ], outlet, () => p('This demo route does not exist.'));
}
