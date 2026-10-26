import assert from 'node:assert/strict'
import test from 'node:test'
import { state, states, watch, derive, change, until } from '../src/state.mjs'
import { model } from '../src/model.mjs'

test('watch batches synchronous state updates and ignores unchanged assignments', async () => {
    const count = state(0)
    const observed = []
    watch(() => observed.push(count.value))
    count.value = 1
    count.value = 2
    count.value = 2
    await Promise.resolve()
    assert.deepEqual(observed, [0, 2])
    count.value = 2
    await Promise.resolve()
    assert.deepEqual(observed, [0, 2])
    assert.equal(count.oldValue, 1)
})

test('derive follows its state dependencies', async () => {
    const count = state(2)
    const doubled = derive(() => count.value * 2)
    assert.equal(doubled.value, 4)
    count.value = 3
    await Promise.resolve()
    assert.equal(doubled.value, 6)
})

test('change resolves with the next value', { timeout: 1000 }, async () => {
    const count = state(0)
    const changed = change(count)
    count.value = 1
    assert.equal(await changed, 1)
})

test('until waits until its predicate is true', { timeout: 1000 }, async () => {
    const count = state(0)
    let resolved = false
    const ready = until(count, value => value >= 2).then(value => { resolved = true; return value })
    count.value = 1
    await Promise.resolve()
    assert.equal(resolved, false)
    count.value = 2
    assert.equal(await ready, 2)
})

test('states reset restores the grouped initial values', () => {
    const group = states()
    const { first, second } = group(1, 2)
    first.value = 4
    second.value = 5
    group.reset()
    assert.deepEqual([first.value, second.value], [1, 2])
})

test('model preserves nested values and serializes updated state', () => {
    const item = model({ name: 'first', nested: { count: 1 }, list: [1, 2] })
    item.name.value = 'changed'
    item.nested.value.count.value++
    assert.deepEqual(item.json(), { name: 'changed', nested: { count: 2 }, list: [1, 2] })
})
