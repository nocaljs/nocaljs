const math = {
    deg: rad => 180 * rad / Math.PI,
    rad: deg => Math.PI * deg / 180,
    range: (start, stop, step) => Array.from(
        { length: Math.ceil((stop - start) / step) },
        (_, i) => start + i * step
    )
}

const fmt = {
    n: prec => x => x.toFixed(prec)
}

export { math, fmt }
