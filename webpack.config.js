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
        ],
        alias: {
            jquery: __dirname + '/bower_components/jquery/src/jquery.js'
        }
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
    		{
        		test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url'
    		}
        ]
    },
    vue: {
        loaders: {
            js: 'babel',
            sass: 'style!css!sass!resolve-url!sass?sourceMap'
        }
    }
}
