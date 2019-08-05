const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

const webpack = require('webpack')
const path = require('path')

module.exports = {
    entry: {
        'index': path.resolve(__dirname, "./src/index.js")
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, "./build/")
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                loader: "babel-loader",
                exclude: [path.resolve(__dirname, "./node_modules")]
            },
            {
                test: /\.css$/,
                use:[
                    {
                        loader:'style-loader'
                    },
                    {
                        loader:'css-loader'
                    }
                ],
                exclude: path.resolve(__dirname, "./node_modules/")
            }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, "./build"),
        hot: true,
        host: 'localhost',
        open: true,
        port: 3002
    },
    devtool: "cheap-module-eval-source-map",
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, './src/index.html'),
            inject: true,
            hash: true
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
}