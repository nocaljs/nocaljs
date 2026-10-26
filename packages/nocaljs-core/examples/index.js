import { state, derive, tags, add, router, sleep, component } from '../src/index.mjs'

const { h1, h2, div, button, input, sup, hr, span, a, li, ul, table, tr, td } = tags()
const { svg, circle } = tags('http://www.w3.org/2000/svg')
const { math, mfrac, mi, mn, mo, mrow, msqrt, msup } = tags('http://www.w3.org/1998/Math/MathML')

const counter = state(0)
const square = derive(_ => counter.value * counter.value)

derive(() => console.log("Counter: ", counter.value))

const menu = [ '#home', '#example', '#derived-state', '#timer/5', "#listdemo", "#test", "#component", "#svg", '#math', '#table' ]

const Menu = (menu) => {
    return div(
        hr(),
        menu.flatMap(path => [ a({href: path}, path.slice(1).split('/')[0]), span(' | ') ]).slice(0, -1),
        hr()
    )
}

const Header = (page) => div(
    h1("nanojs ~ a nano size reactive framework"),
    Menu(menu),
    h2(page)
)

const Home = () => div(
    Header('home'),
    div(
        `Welcome to nanojs! A minimal reactive framework for building web apps.`
    )
)

const App = () => div(
    Header('example'),
    div(
        h2('state'),
        div("counter: ", counter),
        h2('derived state'),
        div("square:", counter, sup(2),'=', square),
        h2('property'),
        input({type: "number", value: _ => counter.value, disabled: true}),
        h2('state-derived property'),
        div({style: () => `font-size: ${8 + counter.value}px;`}, "Hello"),
        h2('state-derived child'),
        div(counter, sup(2), () => ` = ${square.value}`),
        hr(),
        button({ onclick: () => counter.value++ }, 'inc'),
        button({ onclick: () => counter.value-- }, 'dec'),
        button({ onclick: () => counter.value = 0 }, 'reset')
    )
)

const DerivedState = () => {
    const text = state("n, nanoJS")
    const length = derive(() => text.value.length)
    return div(
        Header('derived state'),
        span(
            "The length of ",
            input({type: "text", value: text, oninput: e => text.value = e.target.value}),
            " is ", length, ".",
        )
    )
}

const Timer = ({totalSecs}) => {
    const secs = state(totalSecs)
    return div(
        Header('async example'),
        span(' rocket launch in:', secs, "s ",
        button({onclick: async () => {
                while (secs.value > 0) {
                    await sleep(1000)
                    --secs.value
                }
                await sleep(10) // Wait briefly for DOM update
                alert("Launch 🚀")
                secs.value = totalSecs
            }}, "Start")
        )
    )
}

const ListDemo = () => {

    const item = ({text}) => {
        const deleted = state(false)
        return () => deleted.value
                                    ? null
                                    : li(text, a({href: '', onclick: (e) => {e.preventDefault(); deleted.value = true}}, " [remove]"))
    }

    const list = ul({ type: 'square'})
    const text = input({type: "text"})
    return div(
        Header('todo'),
        div(
        "add item: ",
        text,
        " ",
        button(
            {
                onclick: () => {
                    const todo = item({text: text.value})
                    return add(list, todo)
                }
            },
            "add"),
        list
        )
    )
}

const Test = () => {
    const item = (text) => {
        const deleted = state(false)
        return () => deleted.value
            ? null
            : li(text, a({href: '', onclick: (e) => {e.preventDefault(); deleted.value = true}}, " [remove]"))
    }
    return div(
        Header('test'),
        div(
            ul({ type: 'square'},
                item('A'),
                item('B'),
                item('C'),
                item('D'),
                item('E'),
                item('F'),
                item('G'),
                item('H'),
                item('I'),
                item('J'),
                item('K')
            )
        )
    )
}

const Component = () => {
    const zero = component('nano-zero')
    const one = component('nano-one', (args) => h1(`I am ${args.name} component!`))
    const app = component('nano-app', (args) => {
        const start = args.start || 0
        const counter = state(start)
        return div(
            "counter: ", counter, button({onclick: () => counter.value++}, "inc"), button({onclick: () => counter.value--}, "dec")
        )
    })
    return div(
        Header('component'),
        div(
            zero(),
            one({name: 'one'}),
            one({name: 'two'}),
            app(),
            app(13)
        )
    )
}

const beat = (r, m, M) => {
    const R = state(r)
    let d = 1
    setInterval(()=>{
        if (R.value + d > M || R.value + d < m) d = -1 * d
        R.value += d
    }, 20)
    return R
}

const Svg = () => {
    const colors = ['red', 'green', 'blue']
    const color = state(0)
    return div(
        Header('svg'),
        div(
            svg(
                circle({ cx: 60, cy: 60, r: beat(50, 40, 60), fill: _ => colors[color.value] })
            )
        ),
        div(
            button({onclick: () => {
                color.value = ++color.value % colors.length
            }}, "change color")
        )
    )
}

const Math = () => div(
    Header('math'),
    div(
        math({ display: "block" },
            mrow(
                mi(
                    "x",
                ),
                mo(
                    "=",
                ),
                mfrac(
                    mrow(
                        mrow(
                            mo(
                                "−",
                            ),
                            mi(
                                "b",
                            ),
                        ),
                        mo(
                            "±",
                        ),
                        msqrt(
                            mrow(
                                msup(
                                    mi(
                                        "b",
                                    ),
                                    mn(
                                        "2",
                                    ),
                                ),
                                mo(
                                    "−",
                                ),
                                mrow(
                                    mn(
                                        "4",
                                    ),
                                    mo(
                                        "⁢",
                                    ),
                                    mi(
                                        "a",
                                    ),
                                    mo(
                                        "⁢",
                                    ),
                                    mi(
                                        "c",
                                    ),
                                ),
                            ),
                        ),
                    ),
                    mrow(
                        mn(
                            "2",
                        ),
                        mo(
                            "⁢",
                        ),
                        mi(
                            "a",
                        ),
                    ),
                ),
            ),
        )

    )
)

const createTable = (array = []) => {
    return table(...array.map( rows => tr(...rows.map( column => td(column) )) ))
}

const Table = () => div(
    Header('table'),
    div(
        createTable([
            [1,2,3],
            [4,5,6],
            [7,8,9]
        ])
    )
)


router([
    ['#home', Home],
    ['#example', App],
    ['#derived-state', DerivedState],
    ['#timer/:totalSecs', Timer],
    ['#listdemo', ListDemo],
    ['#test', Test],
    ['#component', Component],
    ['#svg', Svg],
    ['#math', Math],
    ['#table', Table]
])