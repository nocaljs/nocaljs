import { tags } from '../nocal.js';
import { docsURL, repoURL, siteURL } from '../urls.js';
const { a, article, h1, h2, li, p, ul } = tags();

export default function AboutPage() {
  return article({ class: 'page prose' }, h1('About NocalJS'),
    h2('Small pieces, plain JavaScript'),
    p('NocalJS brings reactive state, DOM construction and hash routing to applications that benefit from a small, readable core. Use ordinary functions and ES modules, and add optional tools when you need them.'),
    p('This website uses NocalJS for its interface and routing. Every live example runs from the source displayed beside it.'),
    h2('License and credits'),
    p('Created by Johan Van den Brande. NocalJS is available under the ', a({ href: siteURL('LICENSE.txt').href }, 'MIT license'), '. Keep the copyright and permission notice when distributing copies or substantial portions of the software.'),
    h2('Explore'), ul(
      li(a({ href: repoURL }, 'Source and issue tracker on GitHub')),
      li(a({ href: docsURL() }, 'API reference')),
      li(a({ href: '#/examples' }, 'Live examples'))));
}
