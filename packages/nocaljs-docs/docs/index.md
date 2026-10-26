# NocalJS - Zero Calories Reactive Framework

![NocalJS - Zero calories JS Reactive Framework](./assets/nocal_small.svg)

## What is NocalJS?

NocalJS is a lightweight, functional, and "zero-calories" reactive framework designed for building modern web applications with minimal overhead. It prioritizes simplicity, performance, and developer experience by providing a small yet powerful set of tools for state management, DOM manipulation, and component-based development.

### Key Features

- **Zero Build Step**: Use it directly in the browser or via simple ESM imports.
- **Reactive State Management**: Simple and predictable state handling with `state`, `watch`, and `derive`.
- **Declarative DOM**: Functional approach to creating and updating the DOM using `tags` and `add`.
- **Lightweight & Modular**: Only include what you need.
- **AI-Ready Documentation**: Detailed specifications designed to be easily understood by both humans and AI agents.

## Eye-Catcher Examples

### 1. Reactive Counter
The classic counter example demonstrates how easily NocalJS handles state and DOM updates.
Follow [Getting Started](getting-started.md) for the complete HTML and served-file layout.

```javascript
import { state, tags, add } from './vendor/nocaljs-core.mjs'

const { button, div, p } = tags()
const counter = state(0)

const App = () => div(
    p("Counter: ", counter),
    button({ onclick: () => counter.value++ }, "Increment"),
    button({ onclick: () => counter.value-- }, "Decrement"),
    button({ onclick: () => counter.value = 0 }, "Reset")
)

add(document.body, App())
```

### 2. Functional CAD Model
NocalJS isn't just for UI; it also powers functional 2D CAD designs.

```javascript
import { model, compose, transform } from './vendor/nocaljs-cad2d-core.mjs'

const { circle, rectangle, point } = model
const { pipe, color, group } = compose
const { move } = transform

const part = pipe(
    group(
        pipe(circle(30), color.red()),
        pipe(rectangle(60, 10), color.black())
    ),
    move(point(40, 20))
)
```

## Documentation Map

Explore the detailed documentation for each NocalJS package:

- [**NocalJS Core**](nocaljs-core.md): The heart of the framework—reactivity, DOM, and utilities.
- [**NocalJS CAD2D**](nocaljs-cad2d.md): Functional 2D CAD DSL and transformations.
- [**NocalJS UI**](nocaljs-ui.md): Interactive UI components and patterns.
- [**NocalJS Config**](nocaljs-config.md): Floating parameter panels for interactive apps.
- [**NocalJS Ext**](nocaljs-ext.md): Mathematical and formatting utilities.
- [**NocalJS Docs**](nocaljs-docs.md): Overview of the documentation system itself.
- [**Lessons & Best Practices**](nocaljs-howto.md): Patterns and workarounds from real-world usage.

---

> [!IMPORTANT]
> **NocalJS is not currently published on the npm registry.**
> To use it in your project, you must locally install it by copying the `./dist` folder from the NocalJS repository into your project.
