const webpack = require('webpack')
const path = require('path')
module.exports = {
    entry: {
       library: [
          'react',
          'babel',
          'moment'
       ]
    },
    output: {
       filename: '[name].dll.js',
       path: path.resolve(__dirname, './dll/library'),
       library: '[name]'
    },
    plugins: [
     new webpack.DllPlugin({
         name: '[name]',
         path: './dll/library/[name].json'
     })
   ]
 };
