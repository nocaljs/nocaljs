import {tags, add, state, derive, S} from './nanojs/index.mjs'

const { div, p, button } = tags()

const counter = state(0)

const square = derive(_ => counter.value * counter.value)

add(S('#derived'), div(
    p("Counter: ", counter),
    p("Square: ", square),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec')
))