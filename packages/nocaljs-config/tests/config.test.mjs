import assert from 'node:assert/strict'
import test from 'node:test'
import { parseHTML } from 'linkedom'
import createConfig from '../src/index.mjs'

const { window } = parseHTML('<html><body></body></html>')
Object.assign(globalThis, { window, document: window.document, HTMLElement: window.HTMLElement })
const core = await import('../../nocaljs-core/src/index.mjs')
const config = createConfig(core)

test('config factory creates a panel with parameter states', () => {
    const panel = config.config('Settings', { open: true })
    const { name } = panel({ type: 'text', label: 'Name', default: 'Nocal' })
    const element = panel.dom()
    document.body.append(element)
    assert.equal(name.value, 'Nocal')
    const input = element.shadowRoot.querySelector('input')
    assert.equal(input.value, 'Nocal')
    input.value = 'Updated'
    input.dispatchEvent(new window.Event('input'))
    assert.equal(name.value, 'Updated')
})
