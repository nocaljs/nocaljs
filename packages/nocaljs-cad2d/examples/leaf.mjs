import { add, tags, html } from "https://cdn.jsdelivr.net/gh/nocaljs/nocaljs@cdn/dist/nocaljs.mjs"
import { model, transform, compose } from '../dist/nocaljs-cad2d.mjs'

const { h1, h2, h3, div, pre } = tags()

const { point, beziercurve, rectangle, star, clone, to } = model
const { move, rotate, scale, mirror } = transform
const { pipe, group, color } = compose

const midrib = beziercurve([
    point(0, 0),
    point(10, 40),
    point(0, 80)
])

const side = beziercurve([
    point(0, 0),
    point(25, 20),
    point(10, 80)
])

const mirroredSide = pipe(side, mirror(true, false))

const leafOutline = group(side, mirroredSide, midrib)

const stem = pipe(rectangle(4, 20), move(point(-2, -20)))

const leaf = group(leafOutline, stem)

const veins = []
for (let i = 1; i < 6; i++) {
    const y = 10 + i * 12
    const l = beziercurve([
        point(0, y),
        point(12, y + 6),
        point(24, y + 2)
    ])
    veins.push(group(l, pipe(l, mirror(true, false))))
}

const organicLeaf = pipe(
    group(leaf, ...veins),
    rotate(-20),
    color.green()
)


const liftAndTilt = pipe(
    move(point(0, 50)),
    rotate(30)
)

const part = liftAndTilt(rectangle(100, 200))

console.log(JSON.stringify(part, null, 2))
console.log(JSON.stringify(organicLeaf, null, 2))

const draw = m => html(to.svg(m))

add(document.body,
    h1("Functional 2D CAD DSL"),
    div(
        h2("Leaf"),
        div(draw(organicLeaf)),
        pre(to.svg(organicLeaf))
    ),
    div(
        h2("Lifted and tilted leaf"),
        div(draw(liftAndTilt(organicLeaf)))
    ),
    div(
        h2("Tilted rectangle"),
        div(draw(part))
    ),
    div(
        h2("Star"),
        div(draw(star(5, 100, 25)))
    )
)
