import assert from 'node:assert/strict'
import test from 'node:test'
import { parseHTML } from 'linkedom'
import { add, tags } from '../src/dom.mjs'
import { state } from '../src/state.mjs'

const { document } = parseHTML('<html><body></body></html>')
globalThis.document = document
const { div, em, button, input } = tags()

for (const initialValue of [null, undefined, false]) {
    for (const useFunction of [false, true]) {
        test(`${useFunction ? 'function' : 'state'} child starting at ${initialValue} restores in place`, async () => {
            const value = state(initialValue)
            const parent = div('before', useFunction ? () => value.value : value, 'after')
            assert.equal(parent.textContent, 'beforeafter')

            value.value = 'visible'
            await Promise.resolve()
            assert.equal(parent.textContent, 'beforevisibleafter')

            value.value = false
            await Promise.resolve()
            assert.equal(parent.textContent, 'beforeafter')

            value.value = 0
            await Promise.resolve()
            assert.equal(parent.textContent, 'before0after')

            value.value = null
            await Promise.resolve()
            assert.equal(parent.textContent, 'beforeafter')

            const restored = em('restored')
            value.value = restored
            await Promise.resolve()
            assert.equal(parent.textContent, 'beforerestoredafter')
            assert.equal(parent.querySelector('em'), restored)
        })
    }
}

test('add updates a state child while preserving sibling nodes', async () => {
    const count = state(0)
    const stable = em('stable')
    const parent = add(div(), count, stable)
    count.value++
    await Promise.resolve()
    assert.equal(parent.textContent, '1stable')
    assert.equal(parent.querySelector('em'), stable)
})

test('static disabled attributes and properties agree', () => {
    for (const disabled of [false, null, undefined, true]) {
        const element = button({ disabled }, 'Save')
        assert.equal(element.disabled, disabled === true)
        assert.equal(element.hasAttribute('disabled'), disabled === true)
    }
})

for (const useFunction of [false, true]) {
    test(`${useFunction ? 'function' : 'state'} disabled binding toggles property and attribute`, async () => {
        const disabled = state(true)
        const element = button({ disabled: useFunction ? () => disabled.value : disabled }, 'Save')
        assert.equal(element.disabled, true)
        assert.equal(element.hasAttribute('disabled'), true)

        for (const value of [false, true, null, true, undefined, true]) {
            disabled.value = value
            await Promise.resolve()
            assert.equal(element.disabled, value === true)
            assert.equal(element.hasAttribute('disabled'), value === true)
        }
    })
}

test('input values follow reactive state', async () => {
    const value = state('first')
    const element = input({ value })
    assert.equal(element.value, 'first')
    value.value = 'second'
    await Promise.resolve()
    assert.equal(element.value, 'second')
})
