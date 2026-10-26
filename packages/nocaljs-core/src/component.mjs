// Web Components: component

import { add } from './dom.mjs'

class Component extends HTMLElement {
    constructor(app, props) {
        super();
        this.app = app ? app : _ => 'nothing here'
        this.props = props ? props : {}
        this.shadow = this.attachShadow({ mode: 'open' })
    }

    connectedCallback() {
        add(this.shadow, this.app(this.props, this.shadow))
    }
}

function component(name, app) {
    if (!window.customElements.get(name)) {
        const Komponent = class extends Component {}
        window.customElements.define(name, Komponent)
    }
    const klass = window.customElements.get(name)
    return (props) => new klass(app, props)
}

export { component }