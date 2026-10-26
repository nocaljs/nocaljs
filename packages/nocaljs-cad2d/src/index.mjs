/**
 * Functional CAD DSL over Maker.js.
 */

import makerjs from 'makerjs'
import opentype from 'opentype.js'

const isModel = (m) => m && typeof m === 'object' && (m.models || m.paths || ['line', 'circle', 'arc'].includes(m.type))
const toMap = (...map) => Object.fromEntries(map.map(_ => [_, _.toLowerCase()]))

/**
 * Identity helper does nothing to the passed function.
 * This allows us to pass a 'lift strategy' without handling the special no-lift case.
 * @param fn
 */
const lift0 = (fn) => fn

/**
 * Wrap a function so it can be called in two ways:
 * - If the first arg is a model, call the function immediately.
 * - If the first arg is not a model, return a function that expects a model as the argument.
 * e.g. if `move` is a lift1 function:
 *  const move = lift1(fn_that_does_a_move)
 * You can call it like:
 * With a model as first parameter
 *  - move(model, point(5,5))
 * Curried
 *  - const move5 = move(point(5,5))
 *  - move5(m)
 * @param fn
 */
const lift1 = (fn) => new Proxy(function () {}, {
    apply(_target, _this, _args) {
        if (isModel(_args[0])) {
            const [model, ...rest] = _args
            return fn(model, ...rest)
        }
        return (model) => fn(model, ..._args)
    }
})

/**
 * This is the 'two-model' version of lift1.
 * It wraps a function that needs 2 models, like e.g. boolean combines.
 * If you pass 2 models as the two first args, it gets called immediately.
 * Otherwise it returns a function that expects the first model later, when you call it.
 * e.g.
 * direct
 *  - union(model1, model2)
 * curried
 *  - const unionWithM2 = union(model2)
 *  - unionWithM2(model1)
 * @param fn
 */
const lift2 = (fn) => new Proxy(function () {}, {
    apply(_target, _this, _args) {
        if (_args.length >= 2 && isModel(_args[0]) && isModel(_args[1])) {
            const [m1, m2, ...rest] = _args
            return fn(m1, m2, ...rest)
        }
        const [m2, ...rest] = _args
        return (m1) => {
            if (!isModel(m1)) throw new Error('lift2: expected a model.')
            return fn(m1, m2, ...rest)
        }
    }
})

/**
 * genFns builds a map of wrapper functions around Maker.js constructors/helpers.
 * It takes a Maker.js namespace path (e.g. paths, models, exporter), a name map (e.g. { Line: 'line' }), and a “lift” strategy (lift0/lift1/lift2).
 * @param path - makerjs namespace path (paths, models, ...)
 * @param classNamesMap - a map of makejs name to cad2d name
 * @param lift - the lift strategy
 * @param isFn - true: fn(..args), false: new fn(...args)
 */
const genFns = (path, classNamesMap, lift = lift0, isFn = false) => {
    return Object.fromEntries(
        Object.keys(classNamesMap).map(name => {
            const fn = makerjs[path][name]
            if (!fn) throw new Error(`'makerjs.${path}.${name}' does not exist`)
            return [classNamesMap[name], lift(isFn ? (...args) => fn(...args) : (...args) => new fn(...args))]
        })
    )
}

/**
 * genNested creates a helper function that groups multiple items under a named key.
 * @param name
 * @returns {function(...[*]): {}}
 */
const genNested = name => (...children) => ({ [name]: Object.fromEntries(children.map( (m, i) => [`m${i}`, m] )) })

const pathFnMap = toMap( 'Line', 'Circle', 'Arc' )
const modelFnMap = toMap('Belt', 'BezierCurve', 'BoltCircle', 'BoltRectangle', 'ConnectTheDots', 'Dogbone', 'Dome', 'Ellipse', 'EllipticArc', 'Holes', 'Oval', 'OvalArc', 'Polygon', 'Rectangle', 'Ring', 'RoundRectangle', 'SCurve', 'Slot', 'Square', 'Star', 'Text')
const transformFnMap = toMap('move', 'rotate', 'scale', 'distort', 'mirror', 'center', 'outline')
const modelCombineFnMap = { 'combineIntersection': 'intersect', 'combineSubtraction': 'subtract', 'combineUnion': 'union' }
const exportFnMap = { 'toSVG': 'svg', 'toDXF': 'dxf'}
const pathCombineFnMap = toMap('fillet', 'dogbone', 'expand', 'intersection')
const patternFnMap = { 'cloneToGrid': 'grid', 'cloneToBrick': 'brick', 'cloneToHoneycomb': 'honeycomb', 'cloneToRadial': 'radial' }

const point = (x, y) => [x, y]
const polar = (a, r) => makerjs.point.fromPolar(makerjs.angle.toRadians(a), r)
const pathFns = genFns('paths', pathFnMap)
const modelFns = genFns('models', modelFnMap)
const clone = m => makerjs.cloneObject(m)
const to = genFns('exporter', exportFnMap, lift1, true)
const pattern = genFns('layout', patternFnMap, lift1)

const paths = genNested('paths')
const models = genNested('models')

const transform = genFns('model', transformFnMap, lift1)

const pathCombine = genFns('path', pathCombineFnMap, lift2)
const modelCombine = genFns('model', modelCombineFnMap, lift2)
const points = i => i.intersectionPoints
const angles = i => i.path2Angles
const combine = { ...modelCombine, ...pathCombine, points, angles }
const boundingbox = m => makerjs.measure.modelExtents(m)

const model = {point, polar, ...pathFns, ...modelFns, clone, to, boundingbox }

/**
 * pipe clones a model and runs it through a sequence of functions, left‑to‑right
 * It avoids mutating the original model y cloning it.
 * Because it uses lift1, you can call it as pipe(model, f1, f2) or curry it: pipe(f1, f2)(model).
 * @type {(function())|*}
 */
const pipe = lift1((v, ...fns) => fns.reduce((acc, fn) => fn(acc), clone(v)) )
const layer = lift1((m, l) => (m.layer = l, m))
const colors = Object.keys(makerjs.exporter.colors)
const color = lift1((m, c) => {
    if (!colors.includes(c)) throw new Error(`color '${c}' does not exist, use '${colors.join(', ')}'`)
    return layer(m, c)
})
colors.forEach(c => color[c] = lift1(m => layer(m, c)))
color.colors = colors
const compose = { pipe, group: models, models, paths, layer, color }
compose.style = compose.color

const load_font = async (url) => opentype.parse(await fetch(url).then(res => res.arrayBuffer()))

const fn = { lift0, lift1, lift2 }

export { model, transform, combine, compose, pattern, fn, load_font }