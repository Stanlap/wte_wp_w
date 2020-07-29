const PATHS = require('./globals')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: {
    main: `${PATHS.pre_js}/main.js`
  },
  output: {
    path: `${PATHS.dist}/`,
    publicPath: '/',
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: []
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'favicon.ico',
          from: `${PATHS.src}/img`,
          to: `${PATHS.dist}/public/img`
        },
        {
          from: `${PATHS.src}/server/back`,
          to: `${PATHS.serv}/back_js`
        }
      ]
    }),
    new HtmlWebpackPlugin({
      filename: 'main.html',
      template: `${PATHS.pre}/main.ejs`,
      chunks: ['main']
    })

  ],

}