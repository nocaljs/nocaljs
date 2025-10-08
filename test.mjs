import { state, watch, derive } from './nocaljs/state.mjs'
import { model } from './nocaljs/model.mjs'

const animals = state(['cat', 'dog', 'bird'])
watch(() => {
    console.log(`Animals: ${animals.value}`)
})
watch(() => {
    console.log(`Animals: ${animals.value.join(' and ')}`)
})
animals.value = [...animals.value, 'horse']

const counter = state(0)
const squaredCounter = derive(_ => counter.value * counter.value)

watch(() => {
    console.log(`counter: ${counter.value}`)
    console.log(`old counter: ${counter.oldValue}`)
    console.log(`squaredCounter: ${squaredCounter.value}`)
})

watch(() => {
    console.log(`counter x 2: ${2 * counter.value}`)
})

watch(() => {
    console.log(`squaredCounter x 2: ${2 * squaredCounter.value}`)
})

counter.value++
counter.value++

const m = model({
    name: "woef",
    list: [],
    list2: [1,2,3],
    sub: {
        a: 1,
        b: 2
    }
})

watch(() => {
    console.log(`My name is: ${m.name.value}`)
})

m.name.value = 'test'

watch(() => {
    const o = m.sub.value
    console.log(`sub changed!`)
})

watch(() => {
    console.log(`sub.a: ${m.sub.value.a.value}`)
})

watch(() => {
    console.log(`sub.b: ${m.sub.value.b.value}`)
})

for (let i = 0; i < 10; i++) {
    m.sub.value.a.value++
}

const deepcounter = model({ count: 0, nested: { multiplier: 2 } })

const multipliedCount = derive(() => {
    const value = deepcounter.count.value * deepcounter.nested.value.multiplier.value
    return value
})

watch(() => {
    console.log(`Multiplied Count: ${multipliedCount.value}`)
})

watch(()=> {
    console.log(`deepCounter: ${deepcounter.count.value}, ${deepcounter.nested.value.multiplier.value}`)
})

deepcounter.count.value++
deepcounter.count.value++
deepcounter.count.value++
deepcounter.nested.value.multiplier.value = 10

setTimeout(() => {
    console.log(JSON.stringify(m.json()))
})

