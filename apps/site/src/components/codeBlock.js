import { tags } from '../nocal.js';
const { button, code: codeTag, div, pre } = tags();

export function CodeBlock({ code = '', lang = '', label = '' } = {}) {
  const source = codeTag({ class: lang ? `language-${lang}` : '' }, code);
  let resetTimer;
  const copy = button({ type: 'button', class: 'code-copy', 'aria-label': label ? `Copy ${label}` : 'Copy code',
    onclick: async () => {
      let ok;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(source.textContent);
          ok = true;
        } else ok = legacyCopy(source.textContent);
      } catch { ok = legacyCopy(source.textContent); }
      copy.textContent = ok ? 'Copied' : 'Copy failed';
      copy.setAttribute('aria-label', `${copy.textContent} ${label || 'code'}`);
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        copy.textContent = 'Copy';
        copy.setAttribute('aria-label', label ? `Copy ${label}` : 'Copy code');
      }, 1500);
    } }, 'Copy');
  const block = div({ class: 'code-block' },
    label ? div({ class: 'code-block-label' }, label) : [], copy,
    pre({ class: 'code-pre', tabindex: '0', 'aria-label': label || 'Source code' }, source));
  block.setCode = next => { source.textContent = next; };
  return block;
}

function legacyCopy(text) {
  let textarea;
  try {
    textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.append(textarea);
    textarea.select();
    return Boolean(document.execCommand?.('copy'));
  } catch { return false; }
  finally { textarea?.remove(); }
}
