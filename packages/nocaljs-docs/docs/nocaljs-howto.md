# NocalJS How-To: Lessons & Best Practices

This guide documents the core patterns, lessons, and workarounds discovered during the development of the `pdf-cutcontour` project using the NocalJS framework.

## 1. Core Architecture: "The NocalJS Way"

Idiomatic NocalJS development favors a fully functional, JavaScript-driven approach over hybrid HTML/JS.

### 1.1 The Skeleton Pattern
Reduce your `index.html` to a absolute minimum. It should only contain the mount point and the entry module script.
```html
<div id="app"></div>
<script type="module" src="/static/js/app.mjs"></script>
```

### 1.2 Functional DOM Construction
Use the `tags()` proxy to create elements programmatically. This keeps your UI structure and logic in the same place and makes it fully reactive.
```javascript
const { div, h1, button } = tags();
const App = () => div(
    h1("My App"),
    button({ onclick: () => console.log("clicked") }, "Click Me")
);
add(S('#app'), App);
```

## 2. Reactivity & State Management

### 2.1 Deeply Reactive Models
Use `model()` to wrap complex objects. Every property becomes a reactive state automatically.
- **Accessing values**: Use `.value` (e.g., `user.name.value`).
- **UI Binding**: Pass the state directly to a tag or prop for automatic tracking (e.g., `p(user.name)`).

### 2.2 `derive()` for Computed UI State
Use `derive()` to create declarative, read-only states based on other states. This is perfect for driving UI visibility or button states.
```javascript
const isProcessing = derive(() => appState.status.value === 'loading');
const canSubmit = derive(() => appState.key.value.length > 0 && !isProcessing.value);
```

### 2.3 `watch()` for Side Effects
Use `watch()` for imperative logic that needs to run when state changes, such as `localStorage` synchronization or triggering external APIs.
```javascript
watch(() => {
    localStorage.setItem('my_key', appState.key.value);
});
```

## 3. Component & Event Patterns

### 3.1 Functional Components
Break your UI into small, pure functions that return DOM elements. 
```javascript
const Header = () => header(h1("Title"), p("Description"));
const App = () => div(Header(), MainContent(), Footer());
```

### 3.2 Property Binding
Properties in `tags()` functions can be static values, reactive states, or functions that return values.
```javascript
// Function-based property for dynamic updates
input({ 
    type: () => appState.showSecret.value ? 'text' : 'password',
    value: appState.secret,
    oninput: e => appState.secret.value = e.target.value
})
```

## 4. Bugs, Pitfalls & Workarounds

### 4.1 Returning `null` for Removal
**Pattern**: In dynamic children (reactive functions or states), you can return `null` to remove the element from the DOM.
**Native Support**: `nocaljs-core` handles this safely by inserting an internal comment node as a stable anchor. This ensures that the framework always knows exactly where to re-insert the element when the state transitions from `null` back to a visible node.

```javascript
// This is now perfectly safe and idiomatic:
const Status = () => () => isError.value ? ErrorBox() : null;
```

### 4.2 Intuitive Boolean Attributes
**Pattern**: Boolean attributes (like `disabled`, `required`, or `checked`) are managed automatically based on their value.
**Logic**: If an attribute value evaluates to `false`, `null`, or `undefined`, the framework calls `removeAttribute()` internally. If it is `true`, the attribute is set (often as an empty string `""` for HTML parity).

```javascript
// Standard boolean logic just works:
button({ 
    type: 'submit', 
    disabled: isProcessing // Automatically removed when false
}, "Submit")
```

### 4.3 Input State Loss (File Inputs)
**Problem**: In a purely functional UI, if a parent component re-renders completely, any local non-reactive state in children is lost. Specifically, `<input type="file">` elements lose their `files` selection if the element itself is re-created.
**Workaround**: Store the file reference in a stable variable outside the component or in the model (though `FileList` isn't easily serializable). In this project, we used a local `let currentFile = null` at the module level and synchronized a `fileName` state in the model for UI display.

### 4.4 Form `novalidate`
**Lesson**: When using NocalJS to handle form submissions asynchronously (`onsubmit`), the browser's native validation can sometimes interfere with your custom reactive feedback.
**Tip**: Add `novalidate: true` to your `form()` props to allow full control via your reactive validation states and `handleConvert` logic.

## 5. Deployment & Integration

### 5.1 MIME Type for `.mjs`
Ensure your server (Flask, Nginx, etc.) serves `.mjs` files with the correct `application/javascript` header.
- In Flask: `app.py` handles this automatically if files are in `static/`.
- In Docker: Ensure `COPY static static` is included.

### 5.2 Asset Pathing
Use absolute paths or relative paths based on the module's location. In Flask templates, `{{ url_for('static', filename='js/spotcolor.mjs') }}` is the safest way to link the entry point.
