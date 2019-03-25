const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
    target: 'node',
    entry: path.join(__dirname, 'src/index.ts'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js'
    },
    externals: [ nodeExternals() ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            config$: path.resolve(__dirname, 'config')
        }
    },
    plugins: [
        new WebpackShellPlugin({
            onBuildEnd: ['nodemon build/index.js']
        })
    ],
    watch: true
};