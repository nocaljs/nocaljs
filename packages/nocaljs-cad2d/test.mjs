import { add, html } from "https://cdn.jsdelivr.net/gh/nocaljs/nocaljs@cdn/dist/nocaljs.mjs"
import { model, transform, compose, combine, pattern } from './dist/nocaljs-cad2d.mjs'

const { point, line, to, circle, rectangle } = model
const { paths, color, pipe, group } = compose
const { fillet, intersection, points } = combine
const { grid, brick, honeycomb, radial } = pattern
const { rotate, move, center } = transform

const l1 = line(point(0,0), point(100, 100))
const l2 = line(point(100, 100), point(0, 200))
const l3 = line(point(10,0), point(105,205))

const red_circle = p => color.red(circle(p, 3))
const circles = [...points(intersection(l1, l3)), ...points(intersection(l2, l3))].map(red_circle)

const drawing = paths(l1, l2, fillet(l1, 25)(l2), l3, ...circles)

const cg = grid(
    circle(point(10,10), 5),
    3,4,1
)
const cb = brick(
    circle(point(10,10), 5),
    3,4,1
)
const ch = honeycomb(
    circle(point(10,10), 5),
    3,4,1
)

const n = 16
const cr = radial(
    circle(point(10,10), 5),
    n, 360/n
)

add(document.body,
    html(to.svg(drawing)),
    html(to.svg(cg)),
    html(to.svg(cb)),
    html(to.svg(ch)),
    html(to.svg(cr)),
)

const range = (start, stop, step) => Array.from(
    { length: Math.ceil((stop - start) / step) },
    (_, i) => start + i * step, )

const square_at_angle = (s, a) => rotate(center(rectangle(s, s)), a)

const figure = group(
    ...range(0, 180, 15).map( a => square_at_angle(50, a))
)

const render = m => html(to.svg(m))

add(document.body, render(figure))