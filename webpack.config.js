var path = require('path');

module.exports = {
    output: {
        filename: 'app.bundle.js'
    },
    devtool: 'source-map',
    resolve: {
        root: [
            path.resolve('./bower_components'),
            path.resolve('./src')
        ]
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            }
        ]
    },
    vue: {
        loaders: {
            js: 'babel'
        }
    }
}
