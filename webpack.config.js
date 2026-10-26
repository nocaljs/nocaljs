const path = require('path')

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, 'src', 'index.mjs'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'nocaljs.mjs',
        module: true,
        library: {
            type: 'module'
        }
    },
    experiments: {
        outputModule: true
    }
}