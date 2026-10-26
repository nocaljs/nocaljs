import assert from 'node:assert/strict'
import test from 'node:test'
import { parseHTML } from 'linkedom'
import * as stateAPI from '../src/state.mjs'

const { state, watch } = stateAPI

test('val preserves falsy state values and object identity', () => {
    for (const value of [0, false, '', null, undefined, { count: 1 }]) {
        assert.equal(stateAPI.val(state(value)), value)
    }
})

test('val reads the current value after an update', () => {
    const count = state(0)
    count.value = 7
    assert.equal(stateAPI.val(count), 7)
})

test('val participates in watcher dependency tracking', async () => {
    const count = state(0)
    const observed = []
    watch(() => observed.push(stateAPI.val(count)))
    count.value = 3
    await Promise.resolve()
    assert.deepEqual(observed, [0, 3])
})

test('the public core entry point exports the same val helper', async () => {
    const { window } = parseHTML('<html><body></body></html>')
    globalThis.HTMLElement = window.HTMLElement
    try {
        const core = await import('../src/index.mjs')
        assert.equal(typeof core.val, 'function')
        assert.equal(core.val, stateAPI.val)
        assert.equal(core.val(core.state(5)), 5)
    } finally {
        delete globalThis.HTMLElement
    }
})
