import { tags } from '../nocal.js';
import { docsURL } from '../urls.js';
const { a, code, h1, p, section } = tags();

export default function NotFoundPage({ hash = location.hash } = {}) {
  return section({ class: 'page page-404' }, p({ class: 'not-found-code' }, '404'), h1('Page not found'),
    p('There is no page at ', code(hash || '/'), '.'),
    p({ class: 'not-found-links' }, a({ href: '#/' }, 'Back to home'), ' · ',
      a({ href: docsURL() }, 'Browse the docs'), ' · ', a({ href: '#/examples' }, 'See live examples')));
}
