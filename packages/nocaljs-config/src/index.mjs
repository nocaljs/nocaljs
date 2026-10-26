export default (nocal) => {

    const {state, tags, component, css} = nocal

    const {div, label, input, select, option, style, span, link} = tags()

    const styles = css`
        .floating-ui {
            display: flex;
            flex-direction: column;
            position: fixed;
            background-color: white;
            border: 1px solid #333;
            box-shadow: 4px 4px 0;
            z-index: 1000;
            max-width: 500px;
            min-width: 320px;
            margin: 10px;
        }

        .floating-ui .header {
            background-color: #aaa;
            padding: 10px;
            justify-content: space-between;
            cursor: pointer;
        }

        .floating-ui .content {
            overflow: hidden;
            padding: 8px;
        }

        .floating-ui[data-position="bottom-left"] .header {
            order: 2;
        }

        .floating-ui[data-position="bottom-right"] .header {
            order: 2;
        }

        .floating-ui[data-position="top-left"] .header {
            order: -1;
        }

        .floating-ui[data-position="top-right"] .header {
            order: -1;
        }

        .floating-ui[data-position="top-left"] {
            top: 0;
            left: 0;
        }

        .floating-ui[data-position="top-right"] {
            top: 0;
            right: 0;
        }

        .floating-ui[data-position="bottom-left"] {
            bottom: 0;
            left: 0;
        }

        .floating-ui[data-position="bottom-right"] {
            bottom: 0;
            right: 0;
        }

        .form-grid {
            display: grid;
            grid-template-columns: 140px 1fr;
            row-gap: 0.5em;
            align-items: center;
        }

        .align-left {
            justify-self: start;
        }

        .separator {
            grid-column: 1 / -1;
            text-align: center;
            border-bottom: 1px solid #ccc;
        }
    `

    function config(title, {position = 'top-right', open = false} = {}) {
        const fields = new Map()
        const states = []
        const _config = (...args) => {
            let i = 0
            return new Proxy({},
                {
                    get(target, name) {
                        const separators = []
                        while (i < args.length && args[i].type === 'separator') {
                            separators.push(div({class: 'separator'}, span(args[i].label)))
                            i++
                        }
                        const arg = args[i++]
                        const _state = state(arg.default)
                        states.push(_state)
                        let _field
                        switch (arg.type) {
                            case 'bool':
                                _field = bool(name, arg.label, _state)
                                break
                            case 'range':
                                _field = range(name, arg.label, arg.min, arg.max, arg.step, _state)
                                break
                            case 'color':
                                _field = color(name, arg.label, _state)
                                break
                            case 'text':
                                _field = text(name, arg.label, _state)
                                break
                            case 'choice':
                                if (arg.multiple) _state.value = [arg.default]
                                _field = choice(name, arg.label, arg.options, _state, arg.multiple)
                                break
                        }
                        if (separators.length > 0) {
                            _field = [
                                ...separators,
                                _field
                            ]
                        }
                        fields.set(name, _field)
                        return _state
                    }
                }
            )
        }
        _config.dom = component('config-ui', (args, root) => {
            const openState = state(open)
            return [
                link({
                    rel: 'stylesheet',
                    href: 'https://cdn.jsdelivr.net/gh/nocaljs/nocaljs@cdn/dist/nocaljs.css',
                    type: 'text/css'
                }),
                style(styles),
                div({class: 'floating-ui', 'data-position': position},
                    div({
                            class: "header",
                            onclick: () => openState.value = !openState.value
                        },
                        span(title),
                        span({style: 'float: right;'}, () => openState.value ? '▲' : '▼')
                    ),
                    div({class: "content", style: () => `display: ${openState.value ? 'block' : 'none'}`},
                        div({class: "form-grid"},
                            ...Array.from(fields.values())
                        )
                    )
                )
            ]
        })
        return _config
    }

// options is a map (value: desc)
    function choice(name, labl, options, value, multiple = false) {
        const _options = []
        for (const [key, val] of Object.entries(options)) {
            const _option = option({value: key}, val)
            if (val === value.value) _option.setAttribute('selected', true)
            _options.push(_option)
        }
        const _select = select({
            name: name, oninput: (e) => {
                const selectedValues = Array.from(e.target.selectedOptions).map(o => o.value)
                value.value = multiple ? selectedValues : selectedValues[0]
            }
        }, _options)
        if (multiple) {
            _select.setAttribute('multiple', true)
            _select.setAttribute('size', _options.length > 4 ? 4 : _options.length)
        }
        return [
            label({for: name}, labl),
            _select
        ]
    }

    function text(name, labl, value) {
        return [
            label({for: name}, labl),
            input({type: "text", name: name, value: value, oninput: (e) => value.value = e.target.value})
        ]
    }

    function bool(name, labl, value) {
        return [
            label({for: name}, labl),
            input({
                class: 'align-left',
                type: "checkbox",
                name: name,
                checked: (e, attr) => {
                    e.checked = value.value
                },
                onchange: (e) => value.value = e.target.checked
            })
        ]
    }

    function range(name, labl, min, max, step, value) {
        return [
            label({for: name}, labl),
            div(
                input({
                    type: "range",
                    name: name,
                    min: min,
                    max: max,
                    step: step,
                    value: value.value,
                    oninput: (e) => value.value = e.target.value
                })
            )
        ]
    }

    function color(name, labl, value) {
        return [
            label({for: name}, labl),
            input({
                type: "color",
                name: name,
                value: value.value,
                oninput: (e) => value.value = e.target.value
            })
        ]
    }

    return {config, color, range, bool, text, choice}

}