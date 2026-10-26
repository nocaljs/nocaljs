import { findExample } from './src/examples.js';
import { add, tags } from './src/nocal.js';
const { p } = tags();
const params = new URLSearchParams(location.search);
const example = findExample(params.get('example'));
const theme = params.get('theme');
document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
const target = document.getElementById('demo');
try {
  if (!example) throw new Error('Unknown example');
  const module = await import(example.moduleURL);
  module.mount(target);
  document.documentElement.dataset.ready = 'true';
  document.documentElement.dataset.moduleUrl = example.moduleURL;
} catch (error) {
  console.error(error);
  add(target, p({ role: 'alert' }, 'This example could not load. Please reload and try again.'));
}
new ResizeObserver(() => parent.postMessage({ type: 'nocal-demo-height', height: target.scrollHeight + 32 }, location.origin)).observe(target);
