// Data model: model, model.json

import { state } from "./state.mjs";

const toJsonProto = {
    json() {
        const _json = (o) => {
            if (o === null || o === undefined) {
                return o
            }
            else if (Array.isArray(o)) {
                const j = []
                for (let i = 0; i < o.length; ++i) {
                    j[i] = _json(o[i])
                }
                return j
            } else if (o.__isState) {
                return _json(o.value)
            } else if (typeof o === 'object') {
                const j = {}
                for (const [key, value] of Object.entries(o)) {
                    j[key] = _json(value)
                }
                return j
            } else {
                return o
            }
        }
        return _json(this)
    }
}

function model(obj) {
    if (typeof obj !== 'object' || obj === null) throw new Error('model: argument must be an object')

    function wrap(obj, path = '') {
        const mobj = {}
        if (Array.isArray(obj)) {
            return state(obj)
        }
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const fullPath = path ? `${path}.${key}` : key;
                const value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    const wrapped = wrap(value, fullPath)
                    mobj[key] = state(wrapped)
                } else {
                    mobj[key] = state(value)
                }
            }
        }
        return mobj
    }

    const m = wrap(obj, '');
    Object.setPrototypeOf(m, toJsonProto)
    return m
}

export { model }