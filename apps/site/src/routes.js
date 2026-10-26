import { examples } from './examples.js';
import { docsURL } from './urls.js';

export const routes = [
  { path: '#/', title: 'NocalJS', load: () => import('./pages/home.js') },
  { path: '#/get-started', title: 'Get Started', load: () => import('./pages/getStarted.js') },
  { path: '#/examples', title: 'Examples', load: () => import('./pages/examples/index.js') },
  ...examples.map(example => ({
    path: `#/examples/${example.id}`, title: example.title, example,
    load: () => import('./pages/example.js'),
  })),
  { path: '#/about', title: 'About', load: () => import('./pages/about.js') },
];

export const navItems = [
  { href: '#/', label: 'Home' },
  { href: '#/get-started', label: 'Get Started' },
  { href: docsURL(), label: 'Docs' },
  { href: '#/examples', label: 'Examples' },
  { href: '#/about', label: 'About' },
];
