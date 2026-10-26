export default (nocal) => {
    const  { tags, state, watch } = nocal

    const { div, button, a } = tags()
    const { svg, path, circle } = tags('http://www.w3.org/2000/svg')

    /**
     * Create a download button
     * @param label
     * @param mimetype
     * @param filename
     * @param blobfn - return a string or a blob with the contents to download
     */
    const download = (label, mimetype, filename, blobfn) =>
        div(
            button({ onclick: _ => {
                    const link = a({
                        href: URL.createObjectURL(new Blob([ blobfn() ], { type: mimetype})),
                        download: filename
                    })
                    link.click()
                    URL.revokeObjectURL(link.href)
                }}, label)
        )

    /**
     * Draw a dial knob
     * @param radius
     * @param min
     * @param max
     * @param value
     * @returns {*}
     */
    const dial = (radius, min, max, value) => {

        const polar_to_cartesian = (cx, cy, r, deg) => {
            const rad = (deg - 90) * Math.PI / 180
            return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
        }

        const active = state(false)

        const width = 320
        const height = 320
        const deg = 300
        const nticks = 10
        const tick_size = 5

        const cx = width / 2
        const cy = height / 2

        const p2cr = (r, a) => polar_to_cartesian(cx, cy, r, a)
        const p2c = a => p2cr(radius, a)
        const inc = (v, d) => {
            v.value += d
            if (v.value < min) v.value = min
            if (v.value > max) v.value = max
        }

        const start = p2c( - deg / 2)
        const end = p2c(deg / 2)
        const large = deg >= 180 ? "1" : "0"

        const d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, large, 1, end.x, end.y
        ]

        const tick = (v, i) => {
            const angle = -deg/2 + deg/(nticks-1)*i
            const s = p2c(angle)
            const e = p2cr(radius+tick_size, angle)
            return path({"stroke": "black", "stroke-width": 1, fill: "transparent", d: ["M", s.x, s.y, "L", e.x, e.y].join(" "),
                onclick: _ => {
                    if (!active.value) return
                    v.value = (max-min)/(nticks-1)*i
                }
            })
        }
        const ticks = []
        for (let i = 0; i < nticks; i++) {
            ticks.push(tick(value, i))
        }

        const vd = state([])
        watch( _ => {
            const value_degrees = value.value / (max - min) * deg - deg / 2
            const vcs = p2cr(radius - 1, value_degrees)
            const vce = p2cr(radius - 1 - tick_size, value_degrees)
            vd.value = [
                "M", vcs.x, vcs.y,
                "L", vce.x, vce.y,
            ]
        })

        const $svg = svg({
                width: 320,
                height: 320,
                xmlns: "http://www.w3.org/2000/svg"
            },
            path({"stroke": "black", "stroke-width": 1, fill: "transparent", d: d.join(" ")}),
            ...ticks,
            circle({
                cx: cx,
                cy: cy,
                r: radius,
                fill: "transparent",
                // Why doesn't the onclick function work?
                onclick: _ => {
                    console.log('circle')
                    active.value = !active.value
                },
                onwheel: e => {
                    e.preventDefault()
                    if (!active.value) return
                    inc(value, Math.sign(e.deltaY))
                }
            }),
            path({"stroke": _ => active.value ? "red" : "black", "stroke-width": 2, fill: "transparent", d: _ => vd.value.join(" ")}),
        )

        return div($svg)
    }


    return { download, dial }
}
