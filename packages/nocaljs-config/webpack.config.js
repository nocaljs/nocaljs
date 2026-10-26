const path = require('path')

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, 'src', 'index.mjs'),
    output: {
        clean: true,
        path: path.resolve(__dirname, 'dist'),
        filename: 'nocaljs-config.mjs',
        module: true,
        library: {
            type: 'module'
        }
    },
    experiments: {
        outputModule: true
    }
}
