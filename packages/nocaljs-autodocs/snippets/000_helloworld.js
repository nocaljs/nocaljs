import { add, tags, S} from './nanojs/index.mjs'

const { div, p } = tags()

add(S('#helloworld'), div(p('Hello World!')))
