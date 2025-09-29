const path = require('path')
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, 'nocaljs', 'index.mjs'),
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
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'style/nocaljs.css', to: 'nocaljs.css' }
            ]
        })
    ]
}