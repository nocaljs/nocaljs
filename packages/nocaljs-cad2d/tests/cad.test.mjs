import assert from 'node:assert/strict'
import test from 'node:test'
import * as cad from '../src/index.mjs'
import createExtensions from '../src/ext.mjs'

test('CAD composition clones the original geometry and exports SVG', () => {
    const rectangle = cad.model.rectangle(10, 20)
    const moved = cad.compose.pipe(rectangle, cad.transform.move([5, 6]))
    assert.deepEqual(cad.model.boundingbox(rectangle).low, [0, 0])
    assert.deepEqual(cad.model.boundingbox(moved).low, [5, 6])
    assert.match(cad.model.to.svg(moved), /<svg/)
})

test('CAD extension on assigns the requested layer', () => {
    const extension = createExtensions(cad, {})
    const rectangle = cad.model.rectangle(10, 20)
    assert.equal(extension.pipe.on('cut')(rectangle).layer, 'cut')
})

test('CAD extension tap observes and preserves a model in direct and curried forms', () => {
    const extension = createExtensions(cad, {})
    const rectangle = cad.model.rectangle(10, 20)
    const seen = []
    assert.equal(extension.pipe.tap(rectangle, model => seen.push(model)), rectangle)
    assert.equal(extension.pipe.tap(model => seen.push(model))(rectangle), rectangle)
    assert.deepEqual(seen, [rectangle, rectangle])
})
