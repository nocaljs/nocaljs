import { add, state, tags } from './vendor/nocaljs-core.mjs'

const { button, div, output } = tags()
const count = state(0)

add(document.getElementById('app'), div(
    output({ 'aria-live': 'polite' }, count),
    button({ onclick: () => count.value++ }, 'Increment'),
    button({ onclick: () => count.value = 0 }, 'Reset')
))
