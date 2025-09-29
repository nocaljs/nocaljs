// Reactive state: state, states, derive, watch,

import { schedule } from "./utils.mjs"

const dependingMap = new Map()
const queuedDerives = new Set()

const activeDependingSetStack = []
const activeDependingStack = []

function states() {
    let values = null, i = 0, states = []
    const _states = (...initialValues) => {
        values = initialValues
        const proxy = new Proxy({},
            {
                get(target, name) {
                    return states[i] = state(values[i++]);
                },
            })
        return proxy
    }
    _states.reset = () => {
        states.forEach(((state, i) => state.value = values[i]))
    }
    return _states
}

function state(initialValue) {
    return new Proxy(
       {
           value: initialValue,
           oldValue: null
        },
    {
       get(target, property, receiver) {
           if (property === '__isState') return true
           if (property === 'value') {
               findDepending(target)
           }
           return Reflect.get(target, property, receiver)
       },
       set(target, property, value, receiver) {
           if (property === 'value') {
               if (target.value !== value) {
                   target.oldValue = target.value
                   const reflect = Reflect.set(target, property, value, receiver)
                   updateDepending(target)
                   return reflect
               }
           }
           return Reflect.set(target, property, value, receiver)
       }
    })
}

function watch(fn) {
    const activeDependingSet = new Set()
    activeDependingSetStack.push(activeDependingSet)
    activeDependingStack.push(fn)
    fn()
    for (const state of activeDependingSet) {
        if (!dependingMap.has(state)) {
            dependingMap.set(state, new Set())
        }
        dependingMap.get(state).add(fn)
    }
    activeDependingStack.pop()
    activeDependingSetStack.pop()
}

function findDepending(state) {
    if (activeDependingStack.length === 0) return
    activeDependingSetStack[activeDependingSetStack.length - 1].add(state)
}

function updateDepending(state) {
    if (dependingMap.has(state)) {
        const derives = dependingMap.get(state)
        for (const derive of derives) queuedDerives.add(derive)
    }
    schedule(() => {
        for (const derive of queuedDerives) derive()
        queuedDerives.clear()
    })
}

function derive(fn) {
    const derived = state(fn())
    watch(_ => derived.value = fn())
    return derived
}

async function change(state) {
    return new Promise(resolve => {
        const old = state.value
        watch(_ => (state.value !== old) && resolve(state.value))
    })
}

async function until(state, fn) {
    return new Promise(resolve => {
        watch(_ => (fn(state.value)) && resolve(state.value))
    })
}

export { state, states, watch, derive, change, until }