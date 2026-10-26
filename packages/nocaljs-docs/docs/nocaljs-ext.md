# nocaljs-ext

## Overview
`nocaljs-ext` is a collection of utility functions for common mathematical operations and formatting, designed to complement the NocalJS ecosystem.

## Installation
> [!IMPORTANT]
> **NocalJS is not currently published on the npm registry.**
> To use it in your project, you must locally install it by copying the `./dist` folder from the NocalJS repository into your project.

```bash
# Example (once copied to your project)
# npm install ./dist/nocaljs-ext
```

## Core Concepts
The package provides stateless utility functions grouped into logical namespaces: `math` for mathematical calculations and `fmt` for string formatting.

---

## API Reference

### `math`
Mathematical utilities.
- `deg(rad)`: Converts radians to degrees.
- `rad(deg)`: Converts degrees to radians.
- `range(start, stop, step)`: Generates an array of numbers from `start` up to (but not including) `stop`, incremented by `step`.

### `fmt`
Formatting utilities.
- `n(prec)`: Returns a function that formats a number to a fixed number of decimal places (`prec`).

---

## Examples

### Mathematical Operations
```javascript
import { math } from 'nocaljs-ext'

console.log(math.deg(Math.PI)) // 180
console.log(math.rad(90))      // 1.5707963267948966

const steps = math.range(0, 10, 2)
console.log(steps) // [0, 2, 4, 6, 8]
```

### Formatting Numbers
```javascript
import { fmt } from 'nocaljs-ext'

const twoDecimals = fmt.n(2)
console.log(twoDecimals(3.14159)) // "3.14"

// Often used with nocaljs-core states
import { state, watch } from 'nocaljs-core'
const price = state(19.99)
watch(() => {
    console.log(`Price: $${fmt.n(2)(price.value)}`)
})
```
