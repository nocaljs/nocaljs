const entries = [
  ['counter', 'Counter', 'A reactive number with increment, decrement and reset.'],
  ['todo', 'Todo list', 'Add, complete and remove items with reactive list rendering.'],
  ['form', 'Form and model', 'Keep a form and a live preview in sync.'],
  ['router', 'Router', 'Switch views and read route parameters in an isolated demo.'],
  ['derived', 'Derived state', 'Calculate a total automatically from reactive inputs.'],
];

export const examples = entries.map(([id, title, summary]) => ({
  id, title, summary,
  moduleURL: new URL(`./pages/examples/${id}.js`, import.meta.url).href,
}));
export const findExample = id => examples.find(example => example.id === id);
