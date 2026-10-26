import assert from 'node:assert/strict'
import test from 'node:test'
import { parseHTML } from 'linkedom'

const { window } = parseHTML('<html><body></body></html>')
Object.assign(globalThis, { window, document: window.document, HTMLElement: window.HTMLElement })
const { default: nocal } = await import('../src/index.mjs')

test('aggregate config is initialized with the shared core', () => {
    assert.equal(typeof nocal.config.config, 'function')
    const value = nocal.state('first')
    const [, input] = nocal.config.text('name', 'Name', value)
    assert.equal(input.value, 'first')
    input.value = 'changed'
    input.dispatchEvent(new window.Event('input'))
    assert.equal(value.value, 'changed')
})

test('aggregate UI and CAD modules are usable', () => {
    assert.equal(nocal.ui.dial(16, 0, 100, nocal.state(0)).querySelector('svg').nodeName, 'SVG')
    const rectangle = nocal.cad2d.model.rectangle(10, 20)
    assert.match(nocal.cad2d.model.to.svg(rectangle), /<svg/)
})
