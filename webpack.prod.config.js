const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

const webpack = require('webpack')
const path = require('path')

module.exports = {
    entry: path.resolve(__dirname, "./src/index.js"),
    
    output: {
        filename: `[name].[contenthash].js`,
        path: path.resolve(__dirname, "./public/")
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
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 0,
          cacheGroups: {
            vendor:{
                test: /[\\/]node_modules[\\/]/,
                name:'vender'
            }
          }
        },
    },
    devtool: "cheap-module-eval-source-map",
    plugins: [
        new CleanWebpackPlugin(),
        new uglify()
        // new webpack.DllReferencePlugin({
        //     context: __dirname,
        //     manifest: require('./dll/library/library.json')
        // }),
        // new HTMLWebpackPlugin({
        //     filename: 'index.html',
        //     template: path.resolve(__dirname, './src/index.html'),
        //     inject: true,
        //     hash: true
        // }),
    ]
}