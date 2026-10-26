import { tags } from '../../nocal.js';
import { examples } from '../../examples.js';
const { a, article, h1, h2, p, ul, li } = tags();

export default function ExamplesPage() {
  return article({ class: 'page prose' }, h1('Small examples, real code'),
    p('Each example runs beside its source. Try the controls, then copy what you need.'),
    ul({ class: 'example-cards' }, examples.map(example => li(
      h2(a({ href: `#/examples/${example.id}` }, example.title)), p(example.summary)))));
}
