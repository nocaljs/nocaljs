import { tags } from '../nocal.js';
import { ExampleFrame } from '../components/exampleFrame.js';
const { a, article, h1, p } = tags();

export default function ExamplePage({ example }) {
  return article({ class: 'page' },
    a({ href: '#/examples' }, 'All examples'), h1(example.title), p(example.summary),
    ExampleFrame({ example }));
}
