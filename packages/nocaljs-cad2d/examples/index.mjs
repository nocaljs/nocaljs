import { model, transform, paths, models, compose, to } from '../nocaljs-cad2d.mjs'

const { point, line, circle, rectangle } = model
const { move } = transform
const { pipe, color, group } = compose

const shape = size =>  models(
    paths(
        line(point(0, 0), point(size, 0)),
        line(point(size, 0), point(size, size)),
        line(point(size, size), point(0, size)),
        line(point(0, size), point(0, 0)),
    )
)

const testshape = models(
    move(shape(50), point(30, 40)),
    pipe(
        shape(60),
        move(point(70, 80))
    )
)
console.log(JSON.stringify(testshape))

const part = pipe(
    group(
        pipe(circle(30), color.red()),
        pipe(rectangle(60, 10), color.black())
    ),
    move(point(40, 20))
);

console.log(JSON.stringify(part))
console.log(to.svg(part));