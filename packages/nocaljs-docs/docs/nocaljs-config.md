# nocaljs-config

## Overview
`nocaljs-config` is a lightweight parameter panel library built on top of `nocaljs-core`. It provides a floating UI for real-time manipulation of application state, similar to `dat.gui` but designed specifically for the NocalJS ecosystem.

## Installation
> [!IMPORTANT]
> **NocalJS is not currently published on the npm registry.**
> To use it in your project, you must locally install it by copying the `./dist` folder from the NocalJS repository into your project.

```bash
# Example (once copied to your project)
# npm install ./dist/nocaljs-config
```

## Core Concepts
The package provides a `config` function that creates a reactive configuration panel. Each field added to the panel is automatically linked to a NocalJS `state`, allowing your application to react instantly to changes.

The panel supports multiple positions on the screen: `top-left`, `top-right`, `bottom-left`, and `bottom-right`.

---

## API Reference

### `config(title, [options])`
Initializes a new configuration panel.
- `title`: String or DOM element - The title displayed in the panel header.
- `options`: Object
    - `position`: String - 'top-left', 'top-right' (default), 'bottom-left', 'bottom-right'.
    - `open`: Boolean - Whether the panel is expanded by default (default: `false`).
- **Returns**: A proxy function `params` used to define configuration fields.

### `params(fieldDefinition)`
Defines a field in the config panel and returns a reactive state.
- `fieldDefinition`: Object
    - `type`: String - 'bool', 'range', 'color', 'text', 'choice', 'separator'.
    - `label`: String - The label displayed next to the input.
    - `default`: Initial value.
    - `min`, `max`, `step`: (For 'range' type)
    - `options`: (For 'choice' type) An object mapping values to descriptions.
    - `multiple`: (For 'choice' type) Boolean to allow multiple selection.

### `params.dom()`
Returns a NocalJS component representing the panel's DOM structure. This must be added to the document using `add()`.

---

## Examples

### Basic Parameter Panel
```javascript
import * as nocal from 'nocaljs-core'
import createConfig from 'nocaljs-config'

const { config } = createConfig(nocal)

// Initialize panel
const params = config("Settings", { position: 'top-right', open: true })

// Define fields
const { theme, fontSize, showHeader } = params(
    { type: 'choice', label: 'Theme:', options: { light: 'Light', dark: 'Dark' }, default: 'light' },
    { type: 'range', label: 'Font Size:', default: 16, min: 10, max: 40, step: 1 },
    { type: 'separator', label: 'Display' },
    { type: 'bool', label: 'Show Header:', default: true }
)

// Add to document
nocal.add(document.body, params.dom())

// Use reactive states in your app
nocal.watch(() => {
    console.log(`Current theme: ${theme.value}`)
    document.body.style.fontSize = `${fontSize.value}px`
})
```

### Color and Text Inputs
```javascript
const { bgColor, username } = params(
    { type: 'color', label: 'Background:', default: '#ffffff' },
    { type: 'text', label: 'User Name:', default: 'Anonymous' }
)

nocal.watch(() => {
    document.body.style.backgroundColor = bgColor.value
})
```
