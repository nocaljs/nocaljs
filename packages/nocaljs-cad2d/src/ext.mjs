// tap, units, set, at, on, pad, inset, measure, center, center_v, center_h

export default (cad2d, nocaljs) => {

    const {model, transform, compose, fn} = cad2d
    const { html } = nocaljs

    const {point, boundingbox, to} = model
    const {move, outline} = transform
    const {pipe, layer} = compose
    const {lift1} = fn

    /** PIPE */

    /**
     * Apply a function to a model and return the model
     * Use it for logging, measuring, ...
     * Because of using lift1, you can call it directly or curried.
     * - tap(model, fn)
     * - tap(fn)(model)
     * ```
     * const logBBox = tap(m => console.log(model.boundingbox(m)))
     * const result = pipe(rect, logBBox, transform.move([10, 0])
     * ```
     * @param fn
     * @returns {(function())|*}
     */
    const tap = lift1((m, fn) => (fn(m), m))

    /**
     * Sets the units of a model (e.g. 'mm', 'inch')
     * Because of using lift1, you can call it directly or curries.
     * - units(model, 'mm')
     * - units('mm')(model)
     * ```
     * const in_mm = units('mm')
     * pipe(model, in_mm)
     * ```
     * @param u
     * @returns {(function())|*}
     */
    const units = u => lift1(m => (m.units = u, m))

    /**
     * Set a property on a model
     * Because of using lift1, you can call it directly or curries.
     */
    const set = (key, value) => lift1((m) => (m[key] = value, m))

    /**
     * Move a model
     */
    const at = p => lift1(m => move(m, p))

    /**
     * Put model on layer
     * @param l
     * @returns {(function())|*}
     */
    const on = l => lift1(m => layer(m, l))


    /** LAYOUT */

    /**
     * Offset from top left.
     *
     * @param d
     * @returns {(function())|*}
     */
    const inset = d => lift1(m => move(m, point(d, d)))

    /**
     * Expand geometry buy some distance
     * @param d
     * @returns {(function())|*}
     */
    const pad = d => lift1(m => outline(m, point(d, d)))

    // measure -> boundingbox
    const measure = lift1((m, fn) => fn(m, boundingbox(m)))

    const center = lift1((m, w, h) => measure((model, bb) => move(model, [w / 2 - bb.center[0], h / 2 - bb.center[1]]))(m))

    const center_h = lift1((m, w) => center(m, w, 0))
    const center_v = lift1((m, h) => center(m, 0, h))

    const draw = (model, layerOptions = {}) => html(to.svg(model, {
        layerOptions,
        useSvgPathOnly: true
    }))

    return {
        pipe: {tap, units, set, at, on},
        layout: {inset, pad, measure, center, center_h, center_v},
        ui: { draw }
    }
}
