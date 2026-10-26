import { tags, add, state, S } from './nanojs/index.mjs'

const { div, p, button } = tags()

const counter = state(0)

add(S('#state'), div(
    p("Counter: ", counter),
    button({ onclick: () => counter.value++ }, 'inc'),
    button({ onclick: () => counter.value-- }, 'dec')
))