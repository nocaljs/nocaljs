// NocalJS site bootstrap.
// - Dynamic-imports the vendored framework so a load failure stays visible (F-9).
// - Wires the global theme state + localStorage persistence.
// - Mounts the root <App /> into #app.

const THEME_KEY = 'nocaljs-site:theme';
const FALLBACK_MESSAGE =
  'NocalJS failed to load. Please check your connection or reload the page.';

function renderFallback(error) {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = '';
  const box = document.createElement('section');
  box.className = 'fallback';
  box.setAttribute('role', 'alert');
  const h = document.createElement('h1');
  h.textContent = 'NocalJS unavailable';
  const p = document.createElement('p');
  p.textContent = FALLBACK_MESSAGE;
  box.append(h, p);
  if (error) console.error(error);
  app.append(box);
}

function applyTheme(theme) {
  const t = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = t;
}

async function boot() {
  let nocaljs;
  try {
    const mod = await import('./vendor/nocaljs/nocaljs-core.mjs');
    nocaljs = mod.default || mod;
  } catch (err) {
    console.error('[nocaljs-site] failed to load NocalJS:', err);
    renderFallback(err);
    return;
  }

  const { state } = nocaljs;

  // Global theme state, persisted in localStorage.
  let stored = null;
  try { stored = localStorage.getItem(THEME_KEY); } catch {}
  const theme = state(stored === 'dark' ? 'dark' : 'light');
  applyTheme(theme.value);
  if (typeof nocaljs.watch === 'function') {
    nocaljs.watch(() => {
      applyTheme(theme.value);
      try { localStorage.setItem(THEME_KEY, theme.value); } catch {}
      document.querySelectorAll('iframe[data-demo]').forEach(frame => {
        const root = frame.contentDocument?.documentElement;
        if (root) root.dataset.theme = theme.value;
      });
    });
  }

  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.data?.type !== 'nocal-demo-height') return;
    const height = Number(event.data.height);
    if (!Number.isFinite(height)) return;
    for (const frame of document.querySelectorAll('iframe[data-demo]')) {
      if (event.source === frame.contentWindow) frame.style.height = `${Math.max(140, Math.min(height, 1200))}px`;
    }
  });

  let App;
  try {
    ({ App } = await import('./src/app.js'));
  } catch (err) {
    console.error('[nocaljs-site] failed to load app.js:', err);
    renderFallback(err);
    return;
  }

  const mount = document.getElementById('app');
  try {
    App({ nocaljs, theme, mount });
  } catch (err) {
    console.error('[nocaljs-site] App() crashed:', err);
    renderFallback(err);
  }
}

document.querySelector('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  document.getElementById('app').focus();
});
boot();
