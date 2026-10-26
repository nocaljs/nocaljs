const path = require('path')

module.exports = {
    mode: 'production',
    entry: {
        'core': path.resolve(__dirname, 'src', 'index.mjs'),
        'ext': path.resolve(__dirname, 'src', 'ext.mjs')
    },
    output: {
        clean: true,
        path: path.resolve(__dirname, 'dist'),
        filename: 'nocaljs-cad2d-[name].mjs',
        module: true,
        library: {
            type: 'module'
        }
    },
    experiments: {
        outputModule: true
    }
}
