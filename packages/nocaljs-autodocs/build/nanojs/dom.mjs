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

function getDom(elt) {
    return isNode(elt)
        ? elt
        : isFun(elt)
            ? getDom(elt())
            : document.createTextNode(elt) // new Text(elt)
}

function add(dom, ...children)  {

    function createNode(elt) {
        if (elt === null) return null
        if (isNode(elt)) return elt
        return document.createTextNode(elt)
    }

    for (let child of children.flat(Infinity)) {
        if (isState(child)) {
            let node = createNode(child.value)
            watch(() => {
                const newNode = createNode(child.value)
                newNode === null ? node.remove() : node.replaceWith(newNode)
                node = newNode
            })
            dom.appendChild(node)
        } else
        if (isFun(child)) {
            let node = createNode(child())
            watch(() => {
                const newNode = createNode(child())
                newNode === null ? node.remove() : node.replaceWith(newNode)
                node = newNode
            })
            dom.appendChild(node)
        } else {
            dom.appendChild(getDom(child))
        }
    }
    return dom
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
                                elt.setAttribute(prop, value(elt, prop))
                            })
                        } else if (isState(value)) {
                            watch(() => {
                                elt.setAttribute(prop, value.value)
                            })
                        } else {
                            elt.setAttribute(prop, value)
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