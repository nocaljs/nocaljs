# nocaljs-cad2d

## Overview
`nocaljs-cad2d` is a functional CAD Domain Specific Language (DSL) built on top of [Maker.js](https://maker.js.org/). It provides a clean, composable API for creating 2D geometries, performing transformations, and exporting to formats like SVG and DXF.

## Installation
> [!IMPORTANT]
> **NocalJS is not currently published on the npm registry.**
> To use it in your project, you must locally install it by copying the `./dist` folder from the NocalJS repository into your project.

```bash
# Example (once copied to your project)
# npm install ./dist/nocaljs-cad2d
```

## Core Concepts

### Models and Paths
Everything in `nocaljs-cad2d` is a model or a path.
- **Paths**: Basic geometric primitives like Lines, Circles, and Arcs.
- **Models**: Complex shapes composed of paths and other models.

### Functional Composition (Lifting)
The library uses "lifting" strategies (`lift1`, `lift2`) to allow functions to be used in two ways:
1. **Directly**: `move(myModel, [10, 10])`
2. **Curried (Piped)**: `pipe(myModel, move([10, 10]))`

### Pipe
The `pipe` function allows for a sequence of transformations to be applied to a model in a readable, left-to-right manner. It automatically clones the model to avoid mutating the original.

---

## API Reference

### `model`
A collection of geometric primitives and basic utilities.
- `point(x, y)`: Creates a point coordinate array `[x, y]`.
- `polar(angle, radius)`: Creates a point from polar coordinates.
- `line(p1, p2)`, `circle(radius)`, `arc(radius, startAngle, endAngle)`: Path primitives.
- `rectangle(width, height)`, `square(size)`, `oval(width, height)`, `text(font, text, size)`: Model primitives.
- `clone(model)`: Deep clones a model.
- `boundingbox(model)`: Measures the extents of a model.

### `transform` (Lifted)
Functions for manipulating models.
- `move(model, point)`: Translates the model.
- `rotate(model, angle, [origin])`: Rotates the model.
- `scale(model, scaleFactor)`: Scales the model.
- `mirror(model, xAxis, yAxis)`: Mirrors the model.

### `combine` (Lifted)
Boolean operations for combining models and paths.
- `union(m1, m2)`: Combines two models.
- `intersect(m1, m2)`: Intersection of two models.
- `subtract(m1, m2)`: Subtracts m2 from m1.

### `compose`
Utilities for grouping and styling.
- `pipe(model, ...fns)`: Pipes a model through multiple functions.
- `models(...items)`: Groups multiple models into a single model.
- `paths(...items)`: Groups multiple paths.
- `color`: Sub-API for styling (e.g., `color.red()`, `color.blue()`).

### `to` (Lifted)
Export utilities.
- `svg(model, [options])`: Returns an SVG string representation.
- `dxf(model, [options])`: Returns a DXF string representation.

---

## Extended API (`nocaljs-cad2d-ext`)

These utilities are available when using the extension package. They are often used within a `pipe`.

### Pipe Utilities
- `tap(fn)`: Executes `fn(model)` and returns the original model (useful for logging).
- `units(unit)`: Sets the model's units (e.g., 'mm', 'inch').
- `at(point)`: Alias for `move`.
- `on(layer)`: Alias for `layer`.

### Layout Utilities
- `inset(distance)`: Moves the model by `distance` in both X and Y.
- `pad(distance)`: Expands the geometry by `distance`.
- `center(width, height)`: Centers the model within a box of `width` x `height`.
- `measure(fn)`: Calls `fn(model, boundingbox)`.

### UI Utilities
- `draw(model)`: Returns a NocalJS `html` fragment containing the SVG of the model.

---

## Examples

### Creating and Moving a Shape
```javascript
import { model, transform, compose } from 'nocaljs-cad2d'

const { rectangle, point } = model
const { move } = transform
const { pipe } = compose

const myRect = rectangle(50, 30)
const movedRect = move(myRect, point(10, 20))

// Using pipe
const alsoMovedRect = pipe(
    rectangle(50, 30),
    move(point(10, 20))
)
```

### Complex Composed Model
```javascript
import { model, compose, transform } from 'nocaljs-cad2d'

const { circle, rectangle, point } = model
const { move } = transform
const { pipe, color, models } = compose

const part = pipe(
    models(
        pipe(circle(30), color.red()),
        pipe(rectangle(60, 10), move(point(-30, -5)), color.black())
    ),
    move(point(100, 100))
)
```
