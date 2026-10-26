import { state, tags, add, S } from '../src/index.mjs'

const { div, button, h1, h2, hr } = tags()

const showError = state(false)
const ErrorBox = () => div({ class: 'error' }, 'Something went wrong')

// PROBLEM: If this reactive child returns null on the very first evaluation,
// the renderer may attempt to append a non-node and throw.
const Status = () => () => showError.value ? ErrorBox() : null
// workaround
// const Status = () => () => showError.value ? ErrorBox() : ""

const isProcessing = state(false)

const FormActions = () => div(
    // PROBLEM: disabled="false" is still truthy in HTML.
    // Many browsers will treat the presence of the attribute as “on”.
    button({ type: 'submit', disabled: () => isProcessing.value ? true : false }, 'Convert'),
    // Workaround
    // button({ type: 'submit', disabled: () => isProcessing.value ? true : null }, 'Convert'),
    // button({ type: 'submit', disabled: true }, 'Disabled'),
    button({ onclick: () => isProcessing.value = !isProcessing.value }, 'Toggle processing')
)

add(S('#app'),
    h1('quirks'),
    div(
        h2('Null Return'),
        div(
            button({ onclick: () => showError.value = !showError.value }, 'Toggle error'),
            Status()
        )
    ),
    div(
        h2('Attribute Management '),
        div(
            FormActions()
        )
    )
)