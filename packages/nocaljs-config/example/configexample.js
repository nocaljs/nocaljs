import * as nocaljs_core from "/packages/nocaljs-core/dist/nocaljs-core.mjs"
import create_config from '../dist/nocaljs-config.mjs'

const { add, derive } = nocaljs_core
const { config } = create_config(nocaljs_core)

const { div, h1, br, span } = nocaljs_core.tags()

// example
const params = config(span({style: 'font-weight:bold'}, 'Settings'), { position: 'top-right', open: false}   )
const { activate, temperature, colour, name, chooseone, choosemultiple } = params(
    {type: 'separator', label: 'Main'},
    {type: 'bool', label: 'Activate:', default: true},
    {type: 'range', label: 'Temperature:', default: 50, min: 0, max: 100, step: 1},
    {type: 'separator', label: 'Optional'},
    {type: 'color', label: 'Color:', default: '#ff8800'},
    {type: 'text', label: 'Name:', default: 'John'},
    {type: 'choice', label: 'Toppings:', default: 'butter', options: {butter: 'Butter', choklat: 'Choklat', dust: 'Dust'}},
    {type: 'choice', label: 'Breakfast:', default: 'eggs', options: {eggs: 'Eggs', spam: 'Spam', bacon: 'Bacon'}, multiple: true}
)
add(document.body, params.dom())

derive(()=>{
    console.log(`--> activate: ${activate.value}`)
    console.log(`--> temperature: ${temperature.value}`)
})

add(document.body, () => div(
        h1('Hello World'),
        span(`Am I activated? ${activate.value ? 'Yes' : 'No'}`),
        br(),
        span(`Oh boy, so hot: ${temperature.value}`),
        br(),
        span(`Oh boy, so colorful: ${colour.value}`),
        br(),
        span({style: () => `background-color: ${colour.value}`}, "You choose an ugly color!"),
        br(),
        span(`My name is ${name.value}`),
        br(),
        span(`I like ${chooseone.value}`),
        br(),
        span(`I like ${choosemultiple.value.join(', ')}`)
    )
)
