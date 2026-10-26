import { tags } from '../nocal.js';
import { findExample } from '../examples.js';
import { docsURL, repoURL, siteURL } from '../urls.js';
import { ExampleFrame } from '../components/exampleFrame.js';
const { a, article, div, h1, h2, img, li, p, section, ul } = tags();

export default function HomePage() {
  return article({ class: 'page page-home' },
    section({ class: 'hero' },
      img({ class: 'hero-logo', src: siteURL('vendor/assets/nocal_small.svg').href, alt: '', width: 96, height: 96 }),
      h1({ class: 'hero-title' }, 'NocalJS'),
      p({ class: 'hero-tagline' }, 'A zero-calories reactive framework.'),
      p({ class: 'hero-blurb' }, 'Build reactive interfaces with plain JavaScript. Copy a small ES module, serve your files, and start with state, DOM helpers and routing.'),
      div({ class: 'hero-ctas' },
        a({ href: '#/get-started', class: 'btn btn-primary' }, 'Get started'),
        a({ href: docsURL(), class: 'btn btn-secondary' }, 'Read the docs'),
        a({ href: repoURL, class: 'btn btn-secondary' }, 'GitHub'))),
    section({ class: 'home-live' }, h2('See it run'),
      p('Try this counter. The source beside it is the module running in the demo.'),
      ExampleFrame({ example: findExample('counter') })),
    section({ class: 'home-features' }, h2('Keep the moving parts small'),
      ul({ class: 'feature-list' }, [
        'No consumer build step or transpiler.', 'Reactive state with state, derive and watch.',
        'DOM helpers that compose as functions.', 'A hash router for small applications.',
        'Plain ES modules with readable source.', 'A dependency-free core; load optional modules when needed.',
      ].map(feature => li(feature)))),
    section({ class: 'home-features' }, h2('More to build with'),
      p('Use the core on its own, or explore the optional modules:'),
      ul(li(a({ href: docsURL('nocaljs-ui/') }, 'UI helpers')),
        li(a({ href: docsURL('nocaljs-config/') }, 'Interactive configuration panels')),
        li(a({ href: docsURL('nocaljs-cad2d/') }, 'Functional 2D CAD')))));
}
