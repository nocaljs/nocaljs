import {tags, add, state, watch, S} from './nanojs/index.mjs'

const { div, p, button } = tags()

const counter = state(0)

watch(() => {
    if (counter.value === 3) {
        setTimeout(() => alert(`Counter reached 3!`), 0)
    }
})

watch(() => {
    console.log(`Counter: ${counter.value}`)
})

add(S('#watch'), div(
    p("Counter: ", counter),
    p("(increment till 3)"),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec'),
))