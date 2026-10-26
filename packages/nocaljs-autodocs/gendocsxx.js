const fs = require('fs')
const path = require('path')
const marked = require('marked')
const shell = require('shelljs')

const build_folder = path.join(__dirname, 'build')
const root = path.join(__dirname, '..')
const docs = path.join(__dirname, 'docs')
const snippets_folder = path.join(__dirname, 'snippets')
const target = path.join(build_folder, 'index.js')

const append = (filename, txt) => {
  fs.appendFileSync(filename, txt)
}

const append_target = (txt) => {
  append(target, txt)
}

const escape = (txt) => txt.replaceAll('`', '\\`').replaceAll('$', '\\$')

const get_md_as_html = (filename) => {
  const md = fs.readFileSync(path.join(docs, filename), 'utf8')
  const body = escape(marked.parse(md))
  return body
}

const add_md = (filename) => {
  const body = get_md_as_html(filename)
  append_target(`\n// ${filename}\nadd(document.body, html(\`${body}\`))\n`)
}

shell.rm('-rf', build_folder)
shell.mkdir('-p', build_folder)
shell.cp('-r', path.join(root, 'nanojs'), build_folder)
shell.cp(path.join(root, 'style', 'nano.css'), build_folder)
shell.cp(path.join(__dirname, 'index.html'), build_folder)

append_target(`import { tags, add, html, state, states, watch, derive, change, until, sleep, schedule, css, S, router, model, component, style } from './nanojs/index.mjs'\n`)
append_target(`const { span, a, hr, div, p, ul, li, h1, h2, h3, h4, pre, code, button, input, sup, script } = tags()\n`)

append_target(`
const menu = [ '#home', '#docs', '#github' ]

const Menu = (menu) => {
    return div(
        menu.flatMap(path => [ a({href: path}, path.slice(1).split('/')[0]), span(' | ') ]).slice(0, -1),
        hr()
    )
}

const Header = () => div(
  h1('nJS - A nano sized reactive framework'),
  Menu(menu)
)

const Footer = () => div(
  html(\`${get_md_as_html('footer.md')}\`)
)

const Home = () => div(
  Header(),
  html(\`${get_md_as_html('header.md')}\`),
  Footer()
)
  
const Github = () => div(
  Header(),
  a({href: 'https://github.com/nanoflite/nanojs'}, 'github'),
  Footer()
)

`)

append_target(`

const Docs = () => {
`)

const snippets = fs.globSync(path.join(snippets_folder, '*.js')).sort()
const fns = []
for (const snippet of snippets) {
  const id = snippet.split('_').pop().replace('.js', '')

  const name = id.charAt(0).toUpperCase() + id.slice(1)
  fns.push(`// -- ${name}`)
  fns.push(`${name}()`)

  const md = fs.readFileSync(snippet.replace('.js', '.md'), 'utf8')
  const body = escape(marked.parse(md))
  const js = fs.readFileSync(snippet, 'utf8')

  append_target(`\n
// ${id}
const ${name} = () => 
  div(
    html(\`${body}\`),
  `)
  if (js !== "") {
      append_target(`
    h4('code'),
    pre(code({class: 'language-javascript'}, \`${escape(js)}\`)),
    h4('result'),
    div({id: '${id}', class: 'example'})
      `)
  }
  append_target(` )\n`)
  if (js !== "") {
      append_target(`function ${name}Script() { ${escape(js.split('\n').slice(3).join('\n'))}; return "" }\n`)
      fns.push(`${name}Script()`)
  } else {
      fns.push(`""`)
  }
}

append_target(`return div(\n`)
append_target(`Header(),\n`)
append_target(`${fns.join(',\n')},`)
append_target(`Footer(),\n`)
append_target(`
)
}

router([
    ['#home', Home],
    ['#docs', Docs],
    ['#github', Github]
  ]
)


`)