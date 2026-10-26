import assert from 'node:assert/strict'
import test from 'node:test'
import { parseHTML } from 'linkedom'
import { state, watch } from '../../nocaljs-core/src/state.mjs'
import { tags } from '../../nocaljs-core/src/dom.mjs'
import createUI from '../src/index.mjs'

const { window } = parseHTML('<html><body></body></html>')
globalThis.document = window.document
const ui = createUI({ tags, state, watch })

test('dial wheel updates the injected state only while active', () => {
    const value = state(99)
    const dial = ui.dial(16, 0, 100, value)
    const control = dial.querySelector('circle')
    const wheel = () => {
        const event = new window.Event('wheel', { cancelable: true })
        event.deltaY = 1
        control.dispatchEvent(event)
    }
    wheel()
    assert.equal(value.value, 99)
    control.dispatchEvent(new window.Event('click'))
    wheel()
    assert.equal(value.value, 100)
    wheel()
    assert.equal(value.value, 100)
})

test('download creates a labeled button', () => {
    const button = ui.download('Save', 'text/plain', 'file.txt', () => 'hello').querySelector('button')
    assert.equal(button.textContent, 'Save')
})
