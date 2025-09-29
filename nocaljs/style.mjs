const cache = new Map()

function style(styles) {
    const str = Object.entries(styles).map(([key, value]) => `${key}:${value}`).join(';')
    return cache.get(str) || cache.set(str, str).get(str)
}

export { style }