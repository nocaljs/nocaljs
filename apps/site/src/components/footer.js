import { add, tags } from '../nocal.js';
import { docsURL, repoURL, siteURL } from '../urls.js';
const { a, div, span } = tags();

export function Footer() {
  document.getElementById('site-footer').replaceChildren();
  add(document.getElementById('site-footer'), div({ class: 'footer-inner' },
    span('NocalJS — a zero-calories reactive framework.'),
    div({ class: 'footer-meta' },
      a({ href: siteURL('LICENSE.txt').href }, 'MIT license'), ' · ',
      a({ href: docsURL() }, 'Documentation'), ' · ',
      a({ href: repoURL }, 'GitHub'))
  ));
}
