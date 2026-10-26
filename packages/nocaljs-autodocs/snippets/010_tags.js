import {add, tags, S} from './nanojs/index.mjs'

const { div, p, ul, li  } = tags()

add(S('#tags'), div(p('Hello World!'), ul(li('a'), li('b'), li('c'))))
