// DOM: tags, add

import { watch } from './state.mjs'

const proto = Object.getPrototypeOf
const objProto = proto({})
const funProto = proto(function() {})
const asyncProto = proto(async function() {})

const isObj = _ => proto(_ ?? 0) === objProto
const isFun = _ => [funProto, asyncProto].includes(proto(_ ?? 0))
const isNode = _ => !!(_?.nodeType ?? 0)
const isState = _ => !!(_?.__isState ?? false)

const booleanProps = new Set(['disabled','required','checked','readonly','selected','autoplay','controls', 'open','hidden','multiple','muted','playsinline' ])

function getDom(elt) {
    return isNode(elt)
        ? elt
        : isFun(elt)
            ? getDom(elt())
            : document.createTextNode(elt) // new Text(elt)
}

function add(dom, ...children)  {

    function createNode(elt) {
        if (elt === null || elt === undefined || elt === false) return null
        if (isNode(elt)) return elt
        return document.createTextNode(elt)
    }

    // This function solves the 'mount paradox', i.e. what do we do when we try to initially mount a null value.
    // Null signals removal...
    // We use a comment element as an anchor that stays in the DOM
    function mount(dom, childfn) {
        const anchor = document.createComment('nocaljs')
        dom.appendChild(anchor)
        let current = null

        const render = () => {
            const next = createNode(childfn())
            if (next === null && !current) return  // Do nothing when there's no element
            if (next === null && current) {        // Next is null, and we have an existing one, this signals removal
                current.remove()
                current = null
                return
            }
            if (current) {                         // We have an existing element, replace it
                current.replaceWith(next)
            } else {
                anchor.before(next)                // Insert new element at anchor (we keep anchor)
            }
            current = next
        }

        render()
        watch(render)
    }

    for (let child of children.flat(Infinity)) {
        if (isState(child)) {
            mount(dom, () => child.value)
        } else
        if (isFun(child)) {
            mount(dom, child)
        } else {
            dom.appendChild(getDom(child))
        }
    }
    return dom
}

function setProp(elt, prop, value) {
    // Remove attribute if falsy
    if (value == null || value === false || value === undefined) {
        if (booleanProps.has(prop) && prop in elt) elt[prop] = false
        elt.removeAttribute(prop)
        return
    }

    // Boolean props need element value set, but attribute value removed (only present)
    if (booleanProps.has(prop) && prop in elt) {
        elt[prop] = true
        elt.setAttribute(prop, '')
        return
    }

    // Elements with a value (like text area)
    if (prop === 'value' && 'value' in elt) {
        elt.value = String(value)
        return
    }

    // Everything else
    elt.setAttribute(prop, String(value))
}

function tags(namespace) {
    return new Proxy(
        {},
        {
            get(target, tag) {
                return (...args) => {
                    const [props, ...children] = (isObj(args[0]) && !isState(args[0])) ? args : [{}, ...args]
                    const elt = namespace ? document.createElementNS(namespace, tag) : document.createElement(tag)
                    for (let [prop, value] of Object.entries(props)) {
                        if (isFun(value) && prop.startsWith('on')) {
                            elt.addEventListener(prop.slice(2).toLowerCase(), value)
                        } else if (isFun(value)) {
                            watch(() => {
                                setProp(elt, prop, value(elt, prop))
                            })
                        } else if (isState(value)) {
                            watch(() => {
                                setProp(elt, prop, value.value)
                            })
                        } else {
                            setProp(elt, prop, value)
                        }
                    }
                    return add(elt, children)
                }
            }
        })
}

function html(text) {
    return document.createRange().createContextualFragment(text)
}

export { tags, add, html }