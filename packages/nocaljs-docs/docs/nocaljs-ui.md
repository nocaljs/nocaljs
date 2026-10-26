# nocaljs-ui

## Overview
`nocaljs-ui` provides a set of UI components built with the `nocaljs-core` framework. It includes utilities for file downloads and custom SVG-based interactive components like dials.

## Installation
> [!IMPORTANT]
> **NocalJS is not currently published on the npm registry.**
> To use it in your project, you must locally install it by copying the `./dist` folder from the NocalJS repository into your project.

```bash
# Example (once copied to your project)
# npm install ./dist/nocaljs-ui
```

## Core Concepts
The package exports a function that takes a `nocaljs-core` instance as an argument and returns the UI components. This ensures compatibility with the specific version of the core framework being used.

---

## API Reference

### `download(label, mimetype, filename, blobfn)`
Creates a button that, when clicked, generates and downloads a file.
- `label`: String - The text to display on the button.
- `mimetype`: String - The MIME type of the file (e.g., 'application/json', 'image/svg+xml').
- `filename`: String - The default name for the downloaded file.
- `blobfn`: Function - A function that returns a String or a Blob containing the file's content.

### `dial(radius, min, max, value)`
Creates an interactive SVG dial knob component.
- `radius`: Number - The radius of the dial.
- `min`: Number - The minimum value.
- `max`: Number - The maximum value.
- `value`: State - A reactive `nocaljs-core` state object representing the current value.

---

## Examples

### Basic Setup
```javascript
import * as nocal from 'nocaljs-core'
import createUI from 'nocaljs-ui'

const { download, dial } = createUI(nocal)
```

### Download Button Example
```javascript
const saveBtn = download(
    "Export Config",
    "application/json",
    "config.json",
    () => JSON.stringify({ version: "1.0" })
)

nocal.add(document.body, saveBtn)
```

### Interactive Dial Example
```javascript
const { state, tags, add } = nocal
const volume = state(50)

const myDial = dial(100, 0, 100, volume)

add(document.body, 
    tags().div(
        myDial,
        tags().p("Volume: ", volume)
    )
)
```
