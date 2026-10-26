// 1
// 2
// 3
// 4
const gamestate = states()
const { score, timer, showscore, moles, running, lastwacked, high } =
    gamestate(0, 15, false, new Array(9).fill(false), false, -1, localStorage.getItem('high') || 0)

watch( _ => { if (score.value > high.value) high.value = score.value, localStorage.setItem('high', high.value) })

const mole = (i) =>
    div({ class: 'mole',
        onclick: _ => {
            if (running.value && lastwacked.value !== i && moles.value[i]) score.value++
            lastwacked.value = i
        }
    }, _ => moles.value[i] ? `🐹` : ` `)

const nextRandomMole = _ => {
    const i = Math.floor(Math.random() * moles.value.length)
    return moles.value[i] ? nextRandomMole() : i
}

const clearMoles = _ => moles.value = moles.value.map(_ => false)

const play = async () => {
    running.value = true
    while (--timer.value > 0) {
        const theMole = nextRandomMole()
        clearMoles()
        await sleep(200+Math.floor(Math.random()*600))
        moles.value = moles.value.map((_, i) => i === theMole)
        await sleep(400+Math.floor(Math.random()*400))
    }
    clearMoles()
    showscore.value = true
    await change(showscore)
    gamestate.reset()
}

add(S('#whackamole'), () => div({ class: 'container' },
    div({ class: 'game' },
        h1('Whack-A-Mole'),
        div({ class: 'game-info'},
            span(_ => `Time: ${timer.value}s`),
            span(_ => `Score: ${score.value}`),
            span(_ => `High: ${high.value}`)
        ),
        div({class: 'grid'}, moles.value.map((_, i) => mole(i))),
        button({ style: _ => running.value || showscore.value ? `background: #aaa` : `background: #007bff;`,
                 onclick: _ => running.value || play()
               }, 'Start'),
        div({ class: 'scoreboard', style: () => `display: ${showscore.value ? "block" : "none"};`},
            h1('Game Over!'),
            div(_ => `Score: ${score.value}`),
            button({ onclick: _ => showscore.value = false }, 'OK')
        )
    ),
    div({ class: 'footer' }, `(c) 2025 JVdB - powered by nanojs`)
))