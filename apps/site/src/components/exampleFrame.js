import { tags } from '../nocal.js';
import { siteURL } from '../urls.js';
import { CodeBlock } from './codeBlock.js';
import { sources } from '../../vendor/example-sources.js';
const { div, h2, iframe, section } = tags();

export function ExampleFrame({ example }) {
  const source = CodeBlock({ code: sources[example.id], lang: 'javascript', label: `${example.id}.js` });
  source.dataset.sourceUrl = example.moduleURL;
  const demoURL = siteURL('demo.html');
  demoURL.searchParams.set('example', example.id);
  demoURL.searchParams.set('theme', document.documentElement.dataset.theme || 'light');
  const frame = iframe({ src: demoURL.href, title: `${example.title} live demo`,
    class: 'demo-frame', 'data-demo': example.id, 'data-module-url': example.moduleURL,
    onload: event => {
      event.target.contentDocument.documentElement.dataset.theme = document.documentElement.dataset.theme || 'light';
    } });
  fetch(example.moduleURL, { cache: 'no-cache' }).then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  }).then(text => source.setCode(text)).catch(() => {
    source.setCode('Source could not load. Please reload and try again.');
    source.setAttribute('role', 'alert');
  });
  return section({ class: 'example-frame' }, h2({ class: 'example-title' }, example.title),
    div({ class: 'example-grid' },
      div({ class: 'example-pane example-demo' }, div({ class: 'pane-label' }, 'Live'), frame),
      div({ class: 'example-pane example-source' }, div({ class: 'pane-label' }, 'Source'), source)));
}
