import assert from 'node:assert/strict'
import test from 'node:test'
import { math, fmt } from '../src/index.mjs'

test('angle conversions round trip', () => {
    assert.equal(math.deg(math.rad(180)), 180)
})

test('range is end-exclusive and accepts fractional steps', () => {
    assert.deepEqual(math.range(0, 1, 0.25), [0, 0.25, 0.5, 0.75])
    assert.deepEqual(math.range(3, 0, -1), [3, 2, 1])
})

test('number formatting applies the requested precision', () => {
    assert.equal(fmt.n(2)(1.234), '1.23')
})
