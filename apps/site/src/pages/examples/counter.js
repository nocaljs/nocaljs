import { add, state, tags } from '../../nocal.js';

export function mount(target) {
  const { button, div, output } = tags();
  const count = state(0);
  add(target, div({ class: 'counter' },
    button({ type: 'button', class: 'counter-btn', 'aria-label': 'Decrement', onclick: () => count.value-- }, '−'),
    output({ class: 'counter-value', 'aria-live': 'polite' }, count),
    button({ type: 'button', class: 'counter-btn', 'aria-label': 'Increment', onclick: () => count.value++ }, '+'),
    button({ type: 'button', class: 'counter-btn', onclick: () => { count.value = 0; } }, 'Reset')
  ));
}
