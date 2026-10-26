import { tags } from '../nocal.js';
import { docsURL, siteURL } from '../urls.js';
import { CodeBlock } from '../components/codeBlock.js';
const { a, article, h1, h2, li, p, ul } = tags();

function fileSource(path, label, lang) {
  const url = siteURL(path).href;
  const source = CodeBlock({ code: 'Loading source…', label, lang });
  source.dataset.sourceUrl = url;
  fetch(url, { cache: 'no-cache' }).then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  }).then(text => source.setCode(text)).catch(() => {
    source.setCode('Source could not load. Please reload and try again.');
    source.setAttribute('role', 'alert');
  });
  return source;
}

export default function GetStartedPage() {
  const download = (path, name) => a({ href: siteURL(path).href, download: name }, name);
  return article({ class: 'page prose' }, h1('Get started in the browser'),
    p('NocalJS is not on npm yet. Use the individual files below, or build the framework from source. No bundler is needed for your application.'),
    p(a({ href: 'https://github.com/nocaljs/nocaljs/releases' }, 'Browse browser release downloads'),
      ' for published versions, release notes and SHA-256 checksums. The individual-file quickstart below also works before the first release is published.'),
    h2('1. Copy the files'),
    p('Keep index.html and counter.mjs in one directory, with the core module and optional stylesheet in a vendor subdirectory. Include the MIT license with your copy.'),
    ul(li(download('quickstart/index.html', 'index.html')), li(download('quickstart/counter.mjs', 'counter.mjs')),
      li(download('quickstart/vendor/nocaljs-core.mjs', 'nocaljs-core.mjs')), li(download('quickstart/vendor/nocaljs.css', 'nocaljs.css')),
      li(download('quickstart/LICENSE.txt', 'LICENSE.txt'))),
    CodeBlock({ code: 'my-app/\n  index.html\n  counter.mjs\n  LICENSE.txt\n  vendor/\n    nocaljs-core.mjs\n    nocaljs.css', label: 'Directory layout' }),
    h2('2. Serve the directory'),
    p('Start a local HTTP server in my-app, then open http://localhost:8081/. Browser modules need HTTP; opening index.html directly is not supported.'),
    CodeBlock({ code: 'python3 -m http.server 8081', label: 'From my-app' }),
    p(a({ href: siteURL('quickstart/').href }, 'Open the same counter here'), ' to try it before copying.'),
    h2('3. Read the working code'),
    p('These are the exact files used by that counter. tags() creates DOM helpers, and add() mounts the result into a DOM element.'),
    fileSource('quickstart/index.html', 'index.html', 'html'),
    fileSource('quickstart/counter.mjs', 'counter.mjs', 'javascript'),
    h2('Build from source'),
    p('For checkout instructions, optional module factories, and the full API, continue to ', a({ href: docsURL('getting-started/') }, 'the getting-started reference'), '.'),
    p(a({ href: '#/examples' }, 'Explore the live examples')));
}
