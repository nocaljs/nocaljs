import assert from 'node:assert/strict'
import test from 'node:test'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseHTML } from 'linkedom'

const site = new URL('../../build/site/', import.meta.url)
const settle = () => new Promise(resolve => setImmediate(resolve))
const fixture = (hash = '#/') => {
    const { window } = parseHTML('<html data-theme="light"><head></head><body><header id="site-header"></header><main id="app"></main><footer id="site-footer"></footer></body></html>')
    window.location = { hash, origin: 'http://localhost' }
    // Focus/layout is checked in Chrome; linkedom supplies the DOM/event simulation.
    window.HTMLElement.prototype.focus = function () {}
    Object.assign(globalThis, { window, document: window.document, HTMLElement: window.HTMLElement, location: window.location })
    globalThis.history = { replaceState: (_state, _title, hash) => { location.hash = hash } }
    globalThis.fetch = async url => ({ ok: existsSync(new URL(url)), text: async () => readFileSync(new URL(url), 'utf8') })
    return document.getElementById('app')
}
fixture()
const { examples, findExample } = await import(new URL('src/examples.js', site))
const { state } = await import(new URL('src/nocal.js', site))
const waitFor = async check => {
    for (let i = 0; i < 100; i++) {
        if (check()) return
        await new Promise(resolve => setTimeout(resolve, 5))
    }
    assert.ok(check(), 'page completed rendering')
}

test('public output contains reference and quickstart but no planning or prototype metadata', () => {
    for (const path of ['docs/index.html', 'docs/getting-started/index.html', 'quickstart/index.html', 'quickstart/counter.mjs', 'LICENSE.txt']) assert.ok(existsSync(new URL(path, site)), path)
    const inspect = directory => {
        for (const entry of readdirSync(directory, { withFileTypes: true })) {
            assert.ok(!['spec', '.git', 'node_modules', 'SOURCE.json', 'package.json', '_stub.js'].includes(entry.name), entry.name)
            if (entry.isDirectory()) inspect(new URL(`${entry.name}/`, directory))
        }
    }
    inspect(site)
    assert.deepEqual(readdirSync(new URL('vendor/nocaljs/', site)).sort(), ['nocaljs-core.mjs', 'nocaljs.css'])
    const docs = parseHTML(readFileSync(new URL('docs/index.html', site), 'utf8')).document
    assert.equal(new URL(docs.querySelector('.md-logo').getAttribute('href'), new URL('docs/index.html', site)).href, site.href)
})

test('initial HTML contains the complete home layout and exact counter source', () => {
    const initial = parseHTML(readFileSync(new URL('index.html', site), 'utf8')).document
    assert.equal(initial.querySelector('.page-home h1').textContent, 'NocalJS')
    assert.ok(initial.querySelector('#site-header nav'))
    assert.ok(initial.querySelector('iframe[title="Counter live demo"]'))
    assert.equal(initial.querySelector('.code-pre code').textContent, readFileSync(new URL('src/pages/examples/counter.js', site), 'utf8'))
    assert.ok(initial.querySelector('noscript a[href="./docs/"]'))
})

test('all local links and assets in generated HTML resolve within the public output', () => {
    const visit = directory => {
        for (const entry of readdirSync(directory, { withFileTypes: true })) {
            const url = new URL(entry.name, directory)
            if (entry.isDirectory()) { visit(new URL(`${entry.name}/`, directory)); continue }
            if (!entry.name.endsWith('.html')) continue
            const page = parseHTML(readFileSync(url, 'utf8')).document
            for (const element of page.querySelectorAll('a[href], link[href], script[src], img[src], iframe[src]')) {
                const href = element.getAttribute('href') || element.getAttribute('src')
                if (!href) continue
                // Root-relative links belong to the site's origin, not the OS root.
                const target = href.startsWith('/') ? new URL(`.${href}`, site) : new URL(href, url)
                if (target.protocol !== 'file:') continue
                let path = fileURLToPath(target)
                assert.ok(path.startsWith(fileURLToPath(site)), `public link escapes site: ${href}`)
                if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html')
                assert.ok(existsSync(path), `${url.pathname}: ${href}`)
            }
        }
    }
    visit(site)
})

test('counter example increments and resets', async () => {
    const target = fixture()
    const module = await import(findExample('counter').moduleURL)
    module.mount(target)
    target.querySelector('[aria-label="Increment"]').click()
    await settle()
    assert.equal(target.querySelector('output').textContent, '1')
    target.querySelectorAll('button')[2].click()
    await settle()
    assert.equal(target.querySelector('output').textContent, '0')
})

test('todo example adds, completes and removes tasks', async () => {
    const target = fixture()
    const module = await import(findExample('todo').moduleURL)
    module.mount(target)
    target.querySelector('#new-task').value = 'Ship the site'
    target.querySelector('form').dispatchEvent(new window.Event('submit', { cancelable: true }))
    await settle()
    assert.equal(target.querySelectorAll('li').length, 2)
    const checkbox = target.querySelector('input[type="checkbox"]')
    checkbox.checked = true
    checkbox.dispatchEvent(new window.Event('change'))
    await settle()
    assert.equal(target.querySelector('[role="status"]').textContent, '1 of 2 completed')
    target.querySelector('li button').click()
    await settle()
    assert.equal(target.querySelectorAll('li').length, 1)
})

test('form example keeps inputs and model preview synchronized', async () => {
    const target = fixture()
    const module = await import(findExample('form').moduleURL)
    module.mount(target)
    const input = target.querySelector('#profile-name')
    input.value = 'Johan'
    input.dispatchEvent(new window.Event('input'))
    await settle()
    assert.match(target.querySelector('[role="status"]').textContent, /Johan is building/)
    assert.equal(JSON.parse(target.querySelector('pre').textContent).name, 'Johan')
})

test('router example passes the route parameter', () => {
    const target = fixture('#intro')
    return import(findExample('router').moduleURL).then(module => {
        module.mount(target)
        assert.match(target.querySelector('.router-outlet').textContent, /introduction/)
        window.location.hash = '#item/42'
        window.dispatchEvent(new window.Event('hashchange'))
        assert.match(target.querySelector('.router-outlet').textContent, /item 42/)
    })
})

test('derived example updates the calculated total', async () => {
    const target = fixture()
    const module = await import(findExample('derived').moduleURL)
    module.mount(target)
    target.querySelector('#quantity').value = '4'
    target.querySelector('#quantity').dispatchEvent(new window.Event('input'))
    await settle()
    assert.equal(target.querySelector('output').textContent, 'Total: 48.00')
})

test('every live source pane fetches the same resolved module used by its demo', async () => {
    fixture()
    const { ExampleFrame } = await import(new URL('src/components/exampleFrame.js', site))
    for (const example of examples) {
        const frame = ExampleFrame({ example })
        await settle()
        assert.equal(frame.querySelector('code').textContent, readFileSync(new URL(example.moduleURL), 'utf8'))
        assert.equal(frame.querySelector('[data-source-url]').dataset.sourceUrl, frame.querySelector('iframe').dataset.moduleUrl)
        assert.equal(new URL(frame.querySelector('iframe').getAttribute('src')).searchParams.get('example'), example.id)
    }
})

test('getting-started source panes match the runnable quickstart files', async () => {
    fixture()
    const { default: page } = await import(new URL('src/pages/getStarted.js', site))
    const node = page()
    await settle()
    for (const block of node.querySelectorAll('[data-source-url]')) assert.equal(block.querySelector('code').textContent, readFileSync(new URL(block.dataset.sourceUrl), 'utf8'))
    const script = readFileSync(new URL('quickstart/counter.mjs', site), 'utf8')
    assert.match(script, /tags\(\)/)
    assert.match(script, /document.getElementById\('app'\)/)
})

test('Nocal site routing handles every public page and unknown hashes', async () => {
    const mount = fixture()
    const { App } = await import(new URL('src/app.js', site))
    App({ mount, theme: state('light') })
    await waitFor(() => mount.querySelector('h1')?.textContent === 'NocalJS')
    const paths = ['#/get-started', '#/examples', ...examples.map(example => `#/examples/${example.id}`), '#/about']
    for (const path of paths) {
        location.hash = path
        window.dispatchEvent(new window.Event('hashchange'))
        await waitFor(() => mount.querySelector('h1'))
        assert.doesNotMatch(mount.textContent, /placeholder|coming soon|not implemented|Page could not load/i)
    }
    location.hash = '#/missing'
    window.dispatchEvent(new window.Event('hashchange'))
    assert.equal(mount.querySelector('h1').textContent, 'Page not found')
    location.hash = '#/examples/counter/extra'
    window.dispatchEvent(new window.Event('hashchange'))
    assert.equal(mount.querySelector('h1').textContent, 'Page not found')
})

test('legacy docs hashes lead to the canonical reference on load and navigation', async () => {
    const mount = fixture()
    const { App } = await import(new URL('src/app.js', site))
    let redirected
    location.replace = url => { redirected = url }
    App({ mount, theme: state('light') })
    await waitFor(() => mount.querySelector('h1')?.textContent === 'NocalJS')
    location.hash = '#/docs/state'
    window.dispatchEvent(new window.Event('hashchange'))
    assert.equal(redirected, new URL('docs/', site).href)
    const initial = fixture('#/docs')
    redirected = undefined
    location.replace = url => { redirected = url }
    App({ mount: initial, theme: state('light') })
    assert.equal(redirected, new URL('docs/', site).href)
})
