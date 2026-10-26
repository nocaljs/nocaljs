import { add, derive, state, tags } from '../../nocal.js';

export function mount(target) {
  const { div, input, label, output } = tags();
  const quantity = state(2);
  const price = state(12);
  const total = derive(() => quantity.value * price.value);
  add(target, div({ class: 'demo-controls' },
    label({ for: 'quantity' }, 'Quantity'),
    input({ id: 'quantity', type: 'number', min: 0, step: 1, value: quantity,
      oninput: event => { quantity.value = Math.max(0, Number(event.target.value) || 0); } }),
    label({ for: 'price' }, 'Price per item'),
    input({ id: 'price', type: 'number', min: 0, step: '0.01', value: price,
      oninput: event => { price.value = Math.max(0, Number(event.target.value) || 0); } }),
    output({ 'aria-live': 'polite' }, () => `Total: ${total.value.toFixed(2)}`)
  ));
}
