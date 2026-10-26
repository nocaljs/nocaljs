// Utilities: sleep, schedule, css

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const schedule = f => Promise.resolve().then(f)

const css = (strings, ...values) => {
    return strings.raw.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
}

const S = (selector, context = document) => {
    const elements = (context.shadowRoot ?? context).querySelectorAll(selector)
    return new Proxy(elements, {
        get(target, prop, receiver) {
            const createFn = fn => (...args) => {
                target.forEach(el => fn(el, ...args))
                return target
            }
            const fnMap = {
                'css': (el, property, value) => (el.style[property] = value),
                'on': (el, event, handler) => el.addEventListener(event, handler),
                'attr': (el, name, value) => (el.setAttribute(name, value)),
                'html': (el, html) => (el.innerHTML = html),
                'text': (el, text) => (el.textContent = text)
            }
            if (fnMap[prop]) return createFn(fnMap[prop])
            return (...args) => Array.from(target,
                (el) => (typeof el[prop] === 'function') ? el[prop].apply(el, args) : el[prop])
        },
        set(target, prop, value) {
            target.forEach(el => (el[prop] = value))
            return true
        }
    })
}

export { sleep, schedule, css, S }