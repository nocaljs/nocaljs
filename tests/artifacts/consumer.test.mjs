import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseHTML } from 'linkedom'

const root = new URL('../../', import.meta.url)
const directory = mkdtempSync(join(tmpdir(), 'nocal-consumer-'))
after(() => rmSync(directory, { recursive: true, force: true }))
cpSync(new URL('dist/', root), join(directory, 'vendor'), { recursive: true })
const { window } = parseHTML('<html><body><main id="app"></main></body></html>')
Object.assign(globalThis, { window, document: window.document, HTMLElement: window.HTMLElement })
const load = name => import(pathToFileURL(join(directory, 'vendor', name)))
const core = await load('nocaljs-core.mjs')

test('all advertised root and package exports exist and import successfully', async () => {
    const manifests = ['package.json', ...['core', 'ext', 'ui', 'config', 'cad2d'].map(name => `packages/nocaljs-${name}/package.json`)]
    for (const manifest of manifests) {
        const location = new URL(manifest, root)
        const data = JSON.parse(readFileSync(location, 'utf8'))
        for (const entry of Object.values(data.exports)) {
            const target = new URL(entry, location)
            assert.ok(existsSync(target), `${data.name}: ${entry}`)
            if (entry.endsWith('.mjs')) assert.ok(Object.keys(await import(target)).length > 0)
        }
    }
    const entry = await import('nocaljs')
    assert.equal(typeof entry.state, 'function')
    assert.equal(entry.default, undefined)
    assert.equal(typeof (await import('nocaljs/all')).default.config.config, 'function')
})

test('the shipped quickstart runs using only copied HTML, CSS, core and counter files', async () => {
    const counter = join(directory, 'counter')
    mkdirSync(join(counter, 'vendor'), { recursive: true })
    for (const file of ['index.html', 'counter.mjs']) cpSync(new URL(`examples/counter/${file}`, root), join(counter, file))
    for (const file of ['nocaljs-core.mjs', 'nocaljs.css']) cpSync(join(directory, 'vendor', file), join(counter, 'vendor', file))
    assert.deepEqual(readdirSync(join(counter, 'vendor')).sort(), ['nocaljs-core.mjs', 'nocaljs.css'])
    assert.match(readFileSync(join(counter, 'index.html'), 'utf8'), /src="\.\/counter.mjs"/)
    await import(pathToFileURL(join(counter, 'counter.mjs')))
    assert.equal(document.querySelector('output').textContent, '0')
    document.querySelector('button').click()
    await Promise.resolve()
    assert.equal(document.querySelector('output').textContent, '1')
    document.querySelectorAll('button')[1].click()
    await Promise.resolve()
    assert.equal(document.querySelector('output').textContent, '0')
    assert.doesNotMatch(readFileSync(join(counter, 'vendor/nocaljs-core.mjs'), 'utf8'), /\b(?:import|require)\s*(?:\(|["'{*])/)
})

test('built optional modules initialize against the copied core', async () => {
    const { default: createUI } = await load('nocaljs-ui.mjs')
    const { default: createConfig } = await load('nocaljs-config.mjs')
    const cad = await load('nocaljs-cad2d-core.mjs')
    const { default: createExtensions } = await load('nocaljs-cad2d-ext.mjs')
    assert.ok(createUI(core).dial(16, 0, 100, core.state(0)).querySelector('svg'))
    const value = core.state('before')
    const [, input] = createConfig(core).text('name', 'Name', value)
    input.value = 'after'
    input.dispatchEvent(new window.Event('input'))
    assert.equal(value.value, 'after')
    const rectangle = cad.model.rectangle(10, 20)
    assert.equal(createExtensions(cad, core).pipe.on('cut')(rectangle).layer, 'cut')
    assert.match(cad.model.to.svg(rectangle), /<svg/)
})

test('built aggregate retains its default API with initialized modules', async () => {
    const { default: all } = await load('nocaljs.mjs')
    assert.equal(all.val(all.state(7)), 7)
    assert.equal(typeof all.config.config, 'function')
    assert.equal(typeof all.ui.download, 'function')
    assert.equal(all.ext.fmt.n(2)(1.234), '1.23')
})

test('website assets match the current build and entry modules use core', () => {
    for (const file of readdirSync(new URL('dist/', root))) {
        assert.deepEqual(readFileSync(new URL(`apps/site/vendor/nocaljs/${file}`, root)), readFileSync(new URL(`dist/${file}`, root)))
    }
    assert.deepEqual(readFileSync(new URL('apps/site/vendor/assets/nocal_small.svg', root)), readFileSync(new URL('assets/nocal_small.svg', root)))
    for (const file of ['apps/site/index.js', 'apps/site/src/nocal.js']) {
        const source = readFileSync(new URL(file, root), 'utf8')
        assert.match(source, /nocaljs-core\.mjs/)
        assert.doesNotMatch(source, /['"].*\/nocaljs\.mjs['"]|cad2d/)
    }
    assert.match(readFileSync(new URL('apps/site/src/pages/examples/counter.js', root), 'utf8'), /from '\.\.\/\.\.\/nocal\.js'/)
})
