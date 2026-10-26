import assert from 'node:assert/strict'
import test from 'node:test'
import { parseHTML } from 'linkedom'
import { router } from '../src/router.mjs'

test('router mounts the initial route, passes parameters, and handles unknown hashes', () => {
    const { window } = parseHTML('<html><body><main></main></body></html>')
    window.location = { hash: '' }
    globalThis.window = window
    globalThis.document = window.document
    const root = document.querySelector('main')
    router([
        ['#home', () => 'Home'],
        ['#item/:id', ({ id }) => `Item ${id}`]
    ], root, () => 'Missing')
    assert.equal(root.textContent, 'Home')
    window.location.hash = '#item/42'
    window.dispatchEvent(new window.Event('hashchange'))
    assert.equal(root.textContent, 'Item 42')
    window.location.hash = '#unknown'
    window.dispatchEvent(new window.Event('hashchange'))
    assert.equal(root.textContent, 'Missing')
    assert.equal(root.childNodes.length, 1)
})
