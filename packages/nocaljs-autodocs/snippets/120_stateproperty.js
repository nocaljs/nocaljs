import {tags, add, state, S} from './nanojs/index.mjs'

const { div, p, input, button } = tags()

const counter = state(0)

add(S('#stateproperty'), div(
    p("Counter: ", counter),
    input({type: "number", value: counter, disabled: true}),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec')
))