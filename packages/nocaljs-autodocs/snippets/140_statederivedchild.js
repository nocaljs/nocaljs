import {tags, add, state, derive, S} from './nanojs/index.mjs'

const { div, button, sup } = tags()

const counter = state(0)
const square = derive(_ => Math.pow(counter.value, 2))

add(S('#statederivedchild'), div(
    div(counter, sup(2), ' = ', square),
    div(square, sup(3), ' = ', () => Math.pow(square.value, 3)),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec'),
))
