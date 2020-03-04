'use strict';
var path = require('path');

module.exports = {
    mode: 'development',
    entry: [
        path.join(__dirname, 'src/assets/js/index.js')
    ],
    output: {
        path: path.join(__dirname, 'assets/js'),
        filename: 'starterblocks.dev.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: { loader: 'babel-loader' }
            },
            {
                test: /\.scss$/,
                use: [ 'style-loader', 'css-loader', 'sass-loader' ],
            }
        ]
    },
    devtool: "source-map"
};