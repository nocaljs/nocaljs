import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { parseHTML } from 'linkedom'

const root = new URL('../', import.meta.url)
const output = new URL('build/site/', root)
const source = new URL('apps/site/', root)
rmSync(output, { recursive: true, force: true })
mkdirSync(output, { recursive: true })

// Explicit public inputs: planning files and prototype metadata never enter the site.
for (const path of ['index.html', 'index.js', 'styles.css', 'src', 'demo.html', 'demo.js']) {
    cpSync(new URL(path, source), new URL(path, output), { recursive: true })
}
mkdirSync(new URL('vendor/nocaljs/', output), { recursive: true })
mkdirSync(new URL('vendor/assets/', output), { recursive: true })
for (const file of ['nocaljs-core.mjs', 'nocaljs.css']) {
    cpSync(new URL(`dist/${file}`, root), new URL(`vendor/nocaljs/${file}`, output))
}
cpSync(new URL('assets/nocal_small.svg', root), new URL('vendor/assets/nocal_small.svg', output))
cpSync(new URL('vendor/example-sources.js', source), new URL('vendor/example-sources.js', output))
cpSync(new URL('LICENSE', root), new URL('LICENSE.txt', output))
cpSync(new URL('packages/nocaljs-docs/site/', root), new URL('docs/', output), { recursive: true })
mkdirSync(new URL('quickstart/', output), { recursive: true })
for (const file of ['index.html', 'counter.mjs']) {
    cpSync(new URL(`examples/counter/${file}`, root), new URL(`quickstart/${file}`, output))
}
mkdirSync(new URL('quickstart/vendor/', output), { recursive: true })
for (const file of ['nocaljs-core.mjs', 'nocaljs.css']) {
    cpSync(new URL(`dist/${file}`, root), new URL(`quickstart/vendor/${file}`, output))
}
cpSync(new URL('LICENSE', root), new URL('quickstart/LICENSE.txt', output))

// Render the initial home layout from the same components used in the browser.
// The result remains ordinary static HTML, including when JavaScript is disabled.
const { window } = parseHTML(readFileSync(new URL('index.html', source), 'utf8'))
Object.assign(globalThis, { window, document: window.document, HTMLElement: window.HTMLElement, location: { hash: '#/' } })
document.documentElement.dataset.theme = 'light'
globalThis.fetch = async url => ({ ok: true, text: async () => readFileSync(new URL(url), 'utf8') })
const { state } = await import(new URL('src/nocal.js', source))
const { Nav } = await import(new URL('src/components/nav.js', source))
const { Footer } = await import(new URL('src/components/footer.js', source))
const { default: HomePage } = await import(new URL('src/pages/home.js', source))
Nav({ theme: state('light') })
Footer()
document.getElementById('app').replaceChildren(HomePage())
const notice = document.createElement('noscript')
notice.innerHTML = '<p>Live examples need JavaScript. <a href="./docs/">Read the documentation</a> without it.</p>'
document.getElementById('app').append(notice)
writeFileSync(new URL('index.html', output), document.toString().split(source.href).join('./'))
console.log('Built combined website and Markdown reference in build/site')
