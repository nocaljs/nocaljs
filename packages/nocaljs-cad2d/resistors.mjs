import { add, tags, html } from "https://cdn.jsdelivr.net/gh/nocaljs/nocaljs@cdn/dist/nocaljs.mjs"
import { model, transform, compose, load_font } from './dist/nocaljs-cad2d.mjs'

const font = await load_font('./fonts/IBMPlexSansCondensed-Regular.ttf')

const { div, button, a } = tags()

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

const { point, rectangle, roundrectangle, text, to, boundingbox } = model
const { move, rotate, scale, mirror } = transform
const { pipe, group, color, layer } = compose

const to_SI = (v) => {
    const _SI = (v, e, u) => (v/e).toFixed(1).replace('.', u).replace(`${u}0`, u)
    if (v < 10) return String(v.toFixed(1))
    if (v < 1e3) return String(Math.round(v))
    if (v < 1e6) return _SI(v, 1e3, 'k')
    return _SI(v, 1e6, 'M')
}

const colorcode = (v, e) => {
    const to_color = [ "black", "brown", "red", "orange", "yellow", "green", "blue", "violet", "gray", "white" ]
    const b1 = Math.floor(v)
    const b2 = (v*10) % 10
    return [to_color[b1], to_color[b2], to_color[e], 'silver']
}

const config = {
    lsize: 11.5,   // size in mm for label
    size: 12,
    rounded: 2,  // rounded corners of label
    padding: 1, // between the tiles
    text_size: 4,
    b_h: 4,
    b_w: 1.5,
    b_gap: 0.25,
    series: [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2],
    exp: [0,1,2,3,4,5,6,7]
}

const layerOptions = {
    border:      { fill: "none", stroke: "#111", strokeWidth: 0.1},
    text:        { fill: "#000", stroke: "none" },
    outline:     { fill: "none", stroke: "#000", strokeWidth: 0.2 },
    CutContour:  { fill: "none", stroke: "#EC008C", strokeWidth: 0.15 },

    black:  { fill: "#000000", stroke: "#000", strokeWidth: 0.15 },
    brown:  { fill: "#7B4A12", stroke: "#000", strokeWidth: 0.15 },
    red:    { fill: "#C1121F", stroke: "#000", strokeWidth: 0.15 },
    orange: { fill: "#F77F00", stroke: "#000", strokeWidth: 0.15 },
    yellow: { fill: "#FDC500", stroke: "#000", strokeWidth: 0.15 },
    green:  { fill: "#2A9D8F", stroke: "#000", strokeWidth: 0.15 },
    blue:   { fill: "#1D4ED8", stroke: "#000", strokeWidth: 0.15 },
    violet: { fill: "#6D28D9", stroke: "#000", strokeWidth: 0.15 },
    gray:   { fill: "#6B7280", stroke: "#000", strokeWidth: 0.15 },
    white:  { fill: "#FFFFFF", stroke: "#000", strokeWidth: 0.15 },
    silver: { fill: "#C0C0C0", stroke: "#000", strokeWidth: 0.15 }
};

const labels = []
const size = config.size + config.padding
let y = 0
for (const exp of config.exp) {
    let x = 0
    for (const value of config.series) {
        const ohms = value*Math.pow(10, exp)
        const bands = colorcode(value, exp)
        const x_offset = config.b_w + config.b_gap
        const txt = layer(text(font, to_SI(ohms), config.text_size), 'text')
        const bb = boundingbox(txt)
        console.log(bb)
        const bands_m = group(
            move(layer(rectangle(config.b_w, config.b_h), bands[0]), point( x_offset * 0, 0)),
            move(layer(rectangle(config.b_w, config.b_h), bands[1]), point( x_offset * 1, 0)),
            move(layer(rectangle(config.b_w, config.b_h), bands[2]), point( x_offset * 2, 0)),
            move(layer(rectangle(config.b_w, config.b_h), bands[3]), point( x_offset * 3, 0))
        )
        const bmbb = boundingbox(bands_m)
        const delta = Math.abs(config.size-config.lsize)/2.0
        const label = move(
                group(
                    layer(roundrectangle(config.size, config.size, config.rounded), 'CutContour'),
                    move(
                        group(
                            layer(roundrectangle(config.lsize, config.lsize, config.rounded), 'outline'),
                            move(txt, point((config.size-bb.width)/2, config.size-config.text_size-config.padding)),
                            move(bands_m, point((config.size-bmbb.width)/2, config.padding))
                        ),
                        point(delta, delta)
                    )
                ),
                point(x*size, -y*size)
        )
        labels.push(label)
        x++
    }
    y++
}

const legend = move(
    layer(
        text(font, "E12 resistor labels, (c) 2026 Johan Van den Brande", config.text_size),
        'text'
    ),
    point(0, -config.size*config.exp.length)
)


const m1 = group(...labels, legend)
const bb = boundingbox(m1)
const border = layer(rectangle(bb.width+config.padding*2, bb.height+config.padding*2), 'border')
const m = group(
    move(m1, point(config.padding, bb.height-config.size+config.padding)),
    border
)
m.units = 'mm'

const draw = m => html(to.svg(m, {
    layerOptions,
    useSvgPathOnly: true
}))

add(document.body,
    div(draw(m)),
    download('Download SVG', 'image/svg+xml', 'resistors.svg', () =>  to.svg(m, { layerOptions, useSvgPathOnly: true }))
)
